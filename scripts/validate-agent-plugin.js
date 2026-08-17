#!/usr/bin/env node
/**
 * Self-contained validator for the Agent Plugins 1.0.0 surface of this repo
 * (https://agent-plugins.org, schemas pinned at schemas/1.0.0).
 *
 * Checks:
 *   1. plugin.json against the 1.0.0 manifest schema (const $schema, name
 *      rules, closed top-level field set, closed author object).
 *   2. mcp.json against the 1.0.0 MCP schema (closed top-level field set,
 *      per-server stdio / streamable-http / sse requirements, env and cwd
 *      restrictions).
 *   3. Cross-file consistency: version parity across plugin.json,
 *      .claude-plugin/plugin.json, .claude-plugin/marketplace.json and
 *      package.json, and a SKILL.md in every skills/ subdirectory.
 *
 * No network access and no dependencies — the normative rules of the 1.0.0
 * schemas are hardcoded so this runs offline like the other repo validators.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const PLUGIN_SCHEMA_ID = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
const MCP_SCHEMA_ID = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json";

const PLUGIN_FIELDS = new Set([
  "$schema",
  "name",
  "version",
  "description",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
  "extensions",
]);
const AUTHOR_FIELDS = new Set(["name", "email", "url"]);
const NAME_PATTERN = /^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;

const STDIO_FIELDS = new Set(["type", "command", "args", "env", "cwd"]);
const HTTP_FIELDS = new Set(["type", "url", "headers"]);
const SERVER_TYPES = new Set(["stdio", "streamable-http", "sse"]);
const FORBIDDEN_ENV_KEYS = new Set(["PLUGIN_ROOT", "PLUGIN_DATA"]);
const CWD_PATTERN = /^(?:\.\/|\$\{PLUGIN_ROOT\}(?:\/|$)|\$\{PLUGIN_DATA\}(?:\/|$))/;

const errors = [];
const fail = (msg) => errors.push(msg);

function readJson(rel) {
  const file = path.join(ROOT, rel);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    fail(`${rel}: unreadable or invalid JSON (${err.message})`);
    return null;
  }
}

function checkClosed(obj, allowed, label) {
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) fail(`${label}: unexpected property "${key}"`);
  }
}

function validatePluginManifest() {
  const plugin = readJson("plugin.json");
  if (!plugin) return;

  if (plugin.$schema !== PLUGIN_SCHEMA_ID) {
    fail(`plugin.json: $schema must be "${PLUGIN_SCHEMA_ID}"`);
  }
  if (typeof plugin.name !== "string" || !plugin.name) {
    fail("plugin.json: " + '"name" is required');
  } else {
    if (plugin.name.length > 64) fail(`plugin.json: name exceeds 64 chars (${plugin.name.length})`);
    if (!NAME_PATTERN.test(plugin.name)) fail(`plugin.json: name "${plugin.name}" violates the spec naming pattern`);
  }
  checkClosed(plugin, PLUGIN_FIELDS, "plugin.json");

  if (plugin.author !== undefined) {
    if (typeof plugin.author !== "object" || plugin.author === null || Array.isArray(plugin.author)) {
      fail("plugin.json: author must be an object");
    } else {
      checkClosed(plugin.author, AUTHOR_FIELDS, "plugin.json author");
    }
  }
  if (plugin.keywords !== undefined && !Array.isArray(plugin.keywords)) {
    fail("plugin.json: keywords must be an array");
  }
}

function validateServer(name, server) {
  const label = `mcp.json mcpServers.${name}`;
  if (typeof server !== "object" || server === null || Array.isArray(server)) {
    fail(`${label}: must be an object`);
    return;
  }
  if (!SERVER_TYPES.has(server.type)) {
    fail(`${label}: type must be one of stdio | streamable-http | sse (got ${JSON.stringify(server.type)})`);
    return;
  }

  if (server.type === "stdio") {
    checkClosed(server, STDIO_FIELDS, label);
    if (typeof server.command !== "string" || !server.command) {
      fail(`${label}: stdio servers require a non-empty "command"`);
    }
    if (server.args !== undefined && (!Array.isArray(server.args) || server.args.some((a) => typeof a !== "string"))) {
      fail(`${label}: args must be an array of strings`);
    }
    if (server.env !== undefined) {
      for (const [key, value] of Object.entries(server.env)) {
        if (FORBIDDEN_ENV_KEYS.has(key)) fail(`${label}: env key "${key}" is reserved by the spec`);
        if (typeof value !== "string") fail(`${label}: env.${key} must be a string`);
      }
    }
    if (server.cwd !== undefined && (typeof server.cwd !== "string" || !CWD_PATTERN.test(server.cwd))) {
      fail(`${label}: cwd must be plugin-relative (./…), \${PLUGIN_ROOT}-rooted, or \${PLUGIN_DATA}-rooted`);
    }
  } else {
    checkClosed(server, HTTP_FIELDS, label);
    if (typeof server.url !== "string" || !server.url) {
      fail(`${label}: ${server.type} servers require a non-empty "url"`);
    }
    if (server.headers !== undefined) {
      for (const [key, value] of Object.entries(server.headers)) {
        if (typeof value !== "string") fail(`${label}: header "${key}" must be a string`);
      }
    }
  }
}

function validateMcpConfig() {
  const mcp = readJson("mcp.json");
  if (!mcp) return;

  if (mcp.$schema !== MCP_SCHEMA_ID) {
    fail(`mcp.json: $schema must be "${MCP_SCHEMA_ID}"`);
  }
  checkClosed(mcp, new Set(["$schema", "mcpServers"]), "mcp.json");
  if (typeof mcp.mcpServers !== "object" || mcp.mcpServers === null || Array.isArray(mcp.mcpServers)) {
    fail('mcp.json: "mcpServers" is required and must be an object');
    return;
  }
  for (const [name, server] of Object.entries(mcp.mcpServers)) {
    validateServer(name, server);
  }
}

function validateCrossFileConsistency() {
  const plugin = readJson("plugin.json");
  const claude = readJson(path.join(".claude-plugin", "plugin.json"));
  const marketplace = readJson(path.join(".claude-plugin", "marketplace.json"));
  const pkg = readJson("package.json");

  const versions = new Map();
  if (plugin?.version) versions.set("plugin.json", plugin.version);
  if (claude?.version) versions.set(".claude-plugin/plugin.json", claude.version);
  const marketplaceVersion = marketplace?.plugins?.[0]?.version;
  if (marketplaceVersion) versions.set(".claude-plugin/marketplace.json", marketplaceVersion);
  if (pkg?.version) versions.set("package.json", pkg.version);

  const distinct = new Set(versions.values());
  if (distinct.size > 1) {
    const detail = [...versions.entries()].map(([f, v]) => `${f}=${v}`).join(", ");
    fail(`version drift across manifests: ${detail}`);
  }

  const skillsDir = path.join(ROOT, "skills");
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(skillsDir, entry.name, "SKILL.md");
    if (!fs.existsSync(skillMd)) {
      fail(`skills/${entry.name}: missing SKILL.md (auto-discovery depends on it)`);
    }
  }
}

validatePluginManifest();
validateMcpConfig();
validateCrossFileConsistency();

if (errors.length) {
  console.error("Agent Plugins 1.0.0 validation failed:");
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}
console.log("Agent Plugins 1.0.0 validation passed (plugin.json, mcp.json, version parity, skills discovery).");
