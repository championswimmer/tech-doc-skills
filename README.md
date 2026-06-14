# tech-doc-skills

Portable agent skills for writing technical docs and RFCs.

This repository packages two reusable skills that work across **Claude Code**, **OpenAI Codex**, **OpenCode**, and **Pi**:

- `mermaid-diagrams` — write, style, template, and validate Mermaid diagrams for architecture notes, RFCs, ADRs, and READMEs
- `web-research` — gather current technical evidence with a clear query strategy, source-quality rules, and failover across search tools

## Install

Use the `skills` CLI to install the bundle from this GitHub repo:

```bash
npx skills add championswimmer/tech-doc-skills
```

Install just one skill if you want a narrower setup:

```bash
npx skills add championswimmer/tech-doc-skills -s mermaid-diagrams
npx skills add championswimmer/tech-doc-skills -s web-research
```

You can also point `skills` at the repository directly from GitHub or a local checkout if you prefer.

## What these skills do

### `mermaid-diagrams`

Use this skill when you want to:
- turn a design into a diagram
- choose the right Mermaid diagram type
- group things cleanly with subgraphs / boxes
- apply semantic colors for actors, control planes, data stores, success, and failure
- validate Mermaid before publishing docs

Includes:
- `scripts/validate-mermaid.js`
- `scripts/new-mermaid-template.js`
- `references/diagram-types.md`
- `references/rfc-diagram-patterns.md`
- `references/official-sources.md`

### `web-research`

Use this skill when you want to:
- research current tools, standards, APIs, or ecosystem changes
- compare options for an RFC or design doc
- gather source-backed evidence from official docs and repos
- keep a clear failover order if one search tool is unavailable

Includes:
- `scripts/research-plan.js`
- `references/query-patterns.md`
- `references/tool-failover.md`
- `references/source-quality.md`
- `references/rfc-research-output-template.md`

## How the repository is organized

- `skills/` contains the canonical skill source
- `.claude-plugin/plugin.json` describes the plugin bundle for Claude Code
- `.agents/skills/`, `.claude/skills/`, `.opencode/skills/`, and `.pi/skills/` point back to the same skills for compatibility
- `research/` contains the background notes that informed the bundle
- `package.json` advertises the skill tree for Pi

## What are skills, plugins, and MCP?

- **Skill**: a reusable workflow package, centered on `SKILL.md`, with optional scripts and references
- **Plugin**: a distributable wrapper that can ship one or more skills together
- **MCP**: the protocol agents use to connect to external tools, resources, and prompts

The design goal here is simple: keep the authoring guidance in the skill, keep the reusable bundle in the plugin, and let each agent discover the same canonical content.

## Validate locally

```bash
npm run validate:mermaid
npm run validate:research
npm run validate
```

## Supporting research

- [`research/agent-skills-plugins-and-mcp.md`](research/agent-skills-plugins-and-mcp.md)
- [`research/distribution-matrix.md`](research/distribution-matrix.md)

## License

MIT
