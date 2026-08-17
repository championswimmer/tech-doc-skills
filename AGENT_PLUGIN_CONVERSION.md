# Agent Plugins 1.0.0 conversion notes

This repo is a **dual-format plugin**:

- **Claude Code plugin** — manifest at `.claude-plugin/plugin.json` (plus `.claude-plugin/marketplace.json`)
- **Agent Plugins 1.0.0** (<https://agent-plugins.org>) — manifest at root `plugin.json`, MCP config at root `mcp.json`, skills auto-discovered from `skills/`

The conversion was mostly smooth because this plugin only uses **skills** and **MCP servers**, both of which exist in Agent Plugins 1.0.0. This file records the things that did **not** map cleanly from the Claude Code plugin format to the Agent Plugins 1.0.0 spec, and the workarounds chosen.

## 1. No portable API-key / secret substitution in MCP config

The single biggest gap.

- **Claude Code** expands `${ENV_VAR}` placeholders in `env` and header values of `mcpServers` entries, so `.claude-plugin/plugin.json` can reference `${PERPLEXITY_API_KEY}`, `${PARALLEL_API_KEY}`, `${EXA_API_KEY}` and have them resolved from the user's shell environment.
- **Agent Plugins 1.0.0** explicitly only guarantees expansion of `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` in `mcp.json`. Every other placeholder-like string **MUST remain literal**, and clients **MUST NOT** expand environment variables in `env` values, URLs, or headers. The spec also says plugins MUST NOT embed credentials in `env`/headers.

Consequence: `mcp.json` ships with the same `${...}` placeholder strings, but a strictly spec-compliant client will pass them through **literally**, so `perplexity`, `parallel-search`, and `exa` will fail authentication unless the client has its own substitution mechanism (e.g. VS Code's `${env:VAR}` / input variables, Cursor's own env expansion) or the user edits the file. There is no spec-defined way to say "read this key from the user's environment". `context7` needs no key and works everywhere as-is.

Chosen workaround: keep the `${VAR}` placeholders (schema-valid strings, not embedded credentials) and document the caveat in the README, telling users to configure the API keys however their specific client handles MCP secrets.

## 2. Transport type naming: `http` → `streamable-http`

- **Claude Code** uses `"type": "http"` for remote HTTP MCP servers (used by `parallel-search`).
- **Agent Plugins 1.0.0** only allows `"stdio"`, `"streamable-http"`, or `"sse"`, so the value had to be renamed to `"streamable-http"` in `mcp.json`.

Semantic equivalent, purely a rename — but it means the two configs cannot literally share the same server definition block.

## 3. `type: "stdio"` must be explicit

- **Claude Code** treats a missing `type` as stdio by default, so `.claude-plugin/plugin.json` omits it for `context7`, `perplexity`, and `exa`.
- **Agent Plugins 1.0.0** requires `"type": "stdio"` explicitly for command-based servers.

Had to add the field in `mcp.json`; trivial, but another reason the MCP config cannot be shared verbatim.

## 4. MCP servers cannot live in the manifest

- **Claude Code** allows `mcpServers` inline in `plugin.json` (which this repo uses), with no separate file required.
- **Agent Plugins 1.0.0** has a **closed** manifest schema (`additionalProperties: false`) with no `mcpServers` field at all. MCP servers must live in a separate root-level `mcp.json`.

Result: the MCP definitions now exist twice (`.claude-plugin/plugin.json` and `mcp.json`) and must be kept in sync manually.

## 5. Skills path is not configurable

- **Claude Code** lets the manifest point at a skills directory via the `skills` field (`"skills": "./skills"` here).
- **Agent Plugins 1.0.0** only auto-discovers `skills/` at the plugin root; there is no manifest field to relocate it.

Not a problem today (this repo already uses `skills/` at the root), but it means the `skills` field in `.claude-plugin/plugin.json` has no Agent Plugins counterpart.

## 6. Dropped manifest fields

The Agent Plugins manifest schema is closed. These fields from `.claude-plugin/plugin.json` have no equivalent and were simply dropped from the root `plugin.json`:

- `displayName` — no display-name concept in the spec.
- `skills` — see §5.
- `mcpServers` — see §4.

(`name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords` all map 1:1.)

## 7. No marketplace / distribution concept

- **Claude Code** distribution runs through plugin marketplaces, described by `.claude-plugin/marketplace.json` in this repo.
- **Agent Plugins 1.0.0** deliberately puts discovery, installation, and marketplaces out of scope — the spec only defines the on-disk plugin layout. Each client (VS Code "Install Plugin From Source", Copilot CLI, Cursor, Antigravity `agy plugin install`, …) has its own installation mechanism.

So `marketplace.json` remains Claude-Code-only, and install instructions per client live in the README.

## 8. Version drift between two manifests

The plugin version is now declared in two places — `plugin.json` (Agent Plugins) and `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` (Claude Code), plus `package.json`. There is no shared file, so releases must bump all of them. Mitigation: `npm run validate:agent-plugin` (part of `npm run validate`) fails the build if the versions drift apart.

## Tooling

`scripts/validate-agent-plugin.js` (run via `npm run validate:agent-plugin`, included in `npm run validate`) checks, offline and with no dependencies:

1. `plugin.json` against the Agent Plugins 1.0.0 manifest rules (exact `$schema`, name pattern/length, closed field set).
2. `mcp.json` against the 1.0.0 MCP rules (per-server `stdio` / `streamable-http` / `sse` requirements, reserved env keys, `cwd` containment pattern).
3. Cross-file consistency — version parity across `plugin.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, and `package.json`, plus a `SKILL.md` in every `skills/` subdirectory.

## Non-issues (worth noting)

- The plugin name `tech-doc-skills` satisfies the Agent Plugins naming rule (`^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$`, ≤ 64 chars) unchanged.
- Both skills (`mermaid-diagrams`, `web-research`) are plain `SKILL.md`-based skills under `skills/`, which both formats discover identically — no skill changes were needed.
- This plugin uses no commands, agents, or hooks, so the absence of those component types in Agent Plugins 1.0.0 did not affect the conversion.
