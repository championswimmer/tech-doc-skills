# tech-doc-skills

Portable agent skills for writing technical docs and RFCs.

This bundle currently ships two skills:

- `mermaid-diagrams` — create, style, template, and validate Mermaid diagrams for docs and RFCs
- `web-research` — research current technical topics with explicit tool ordering, citations, and failover across Exa, parallel search, and Perplexity

The repo is designed to work across **Claude Code**, **OpenAI Codex**, **OpenCode**, and **Pi**.

## What this repo contains

- canonical skills in `skills/`
- a Claude Code plugin manifest in `.claude-plugin/plugin.json`
- compatibility shims for multiple agents:
  - `.agents/skills/`
  - `.claude/skills/`
  - `.opencode/skills/`
  - `.pi/skills/`
- Pi package metadata in `package.json` via `pi.skills`
- research notes in `research/`

## Concepts in one minute

### Skills

A **skill** is a reusable workflow bundle:
- `SKILL.md` instructions
- optional `scripts/`
- optional `references/`
- optional assets/examples

### Plugins

A **plugin** is a distribution wrapper around one or more skills. In Claude Code, plugins can also bundle agents, hooks, MCP config, and helper binaries.

### MCP

**MCP** (Model Context Protocol) is how agents connect to external tools/resources/prompts. Skills often tell the model how to use those tools; MCP servers provide the tools themselves.

For the longer research summary, see:
- [`research/agent-skills-plugins-and-mcp.md`](research/agent-skills-plugins-and-mcp.md)
- [`research/distribution-matrix.md`](research/distribution-matrix.md)

## Install with `npx skills`

The [`skills`](https://skills.sh/) CLI can install this bundle from a local path or a remote repository.

### 1) Install from this local checkout

From this repo root:

```bash
npx skills add . -a claude-code codex opencode
```

Install globally instead of project-locally:

```bash
npx skills add . -g -a claude-code codex opencode
```

Install only one skill:

```bash
npx skills add . -a claude-code codex opencode -s mermaid-diagrams
npx skills add . -a claude-code codex opencode -s web-research
```

List the skills without installing:

```bash
npx skills add . -l -y
```

### 2) Use a skill without installing it

Generate a one-off prompt:

```bash
npx skills use . --skill mermaid-diagrams
npx skills use . --skill web-research
```

Start a supported agent interactively from a real terminal:

```bash
npx skills use . --skill mermaid-diagrams --agent claude-code
npx skills use . --skill web-research --agent codex
```

### 3) Install from a remote repository

Replace `<repo>` with your GitHub source, for example `your-org/tech-doc-skills`:

```bash
npx skills add <repo> -a claude-code codex opencode
npx skills add <repo> -g -a claude-code codex opencode
```

## Pi support

`npx skills` is most useful for Claude Code, Codex, and OpenCode installs.

Pi support is provided by this repo layout itself:
- `package.json` advertises `./skills` via `pi.skills`
- `.pi/skills/` contains compatibility symlinks to the canonical skills
- `.agents/skills/` also mirrors the same skills for shared-agent setups

Common Pi-friendly options:

### Use the repo directly in a project

If Pi is running inside this repo or a copied project tree, it can use:
- `.pi/skills/`
- package-provided `skills/`
- shared agent-skill layouts, depending on your Pi setup

### Install the package into a Pi project

```bash
npm install <repo-or-package>
```

Pi can then discover the packaged `skills/` directory via `package.json` metadata.

## Agent compatibility matrix

| Agent | Supported by this repo | How |
| --- | --- | --- |
| Claude Code | Yes | `skills/` plugin layout, `.claude-plugin/plugin.json`, and `.claude/skills/` shims |
| OpenAI Codex | Yes | `.agents/skills/` shims and `npx skills` install flow |
| OpenCode | Yes | `.opencode/skills/` shims plus `.agents/skills/` compatibility |
| Pi | Yes | `package.json.pi.skills`, `.pi/skills/`, and shared skill-compatible layout |

## Included skills

## `mermaid-diagrams`

Use when you need to:
- write Mermaid for RFCs, ADRs, READMEs, and architecture docs
- choose the right diagram type
- apply semantic colors and grouping
- validate Mermaid before shipping

Includes:
- `scripts/validate-mermaid.js`
- `scripts/new-mermaid-template.js`
- diagram references and RFC-friendly patterns

Examples:

```bash
node skills/mermaid-diagrams/scripts/validate-mermaid.js docs/architecture.md
node skills/mermaid-diagrams/scripts/new-mermaid-template.js flowchart --title "Docs review flow"
```

## `web-research`

Use when you need to:
- gather current technical information for docs or RFCs
- compare tools, ecosystems, or standards
- collect official docs, release notes, and source references
- work with explicit failover if Exa / parallel search / Perplexity are missing

Includes:
- `scripts/research-plan.js`
- references for query design, failover, source quality, and RFC-ready outputs

Examples:

```bash
node skills/web-research/scripts/research-plan.js "How are Claude plugins, Codex skills, OpenCode skills, Pi skills, and MCP servers distributed?"
node skills/web-research/scripts/research-plan.js "What changed in Mermaid v11 for RFC diagrams?" --queries 5
```

## Repo layout

```text
.
├── .agents/skills/                 # shared-agent compatibility shims
├── .claude-plugin/plugin.json      # Claude Code plugin metadata
├── .claude/skills/                 # Claude project-skill shims
├── .opencode/skills/               # OpenCode project-skill shims
├── .pi/skills/                     # Pi project-skill shims
├── research/                       # internet research notes for maintainers/users
├── skills/
│   ├── mermaid-diagrams/
│   │   ├── SKILL.md
│   │   ├── references/
│   │   └── scripts/
│   └── web-research/
│       ├── SKILL.md
│       ├── references/
│       └── scripts/
└── package.json                    # includes Pi skill-package metadata
```

## Validate locally

```bash
npm run validate:mermaid
npm run validate:research
npm run validate
```

## Authoring / maintenance notes

- Keep the canonical source of truth in `skills/`
- Keep compatibility directories as symlinks pointing back to `skills/`
- Keep `SKILL.md` lean; move heavy detail into `references/`
- Validate example scripts whenever the skill body changes
- Prefer official docs and source repos in the research references

## Source material used while building this bundle

- Claude Code plugin docs: https://code.claude.com/docs/en/plugins
- Claude Code skills docs: https://code.claude.com/docs/en/skills
- OpenAI Codex skills docs: https://developers.openai.com/codex/skills
- OpenCode skills docs: https://open-code.ai/en/docs/skills/
- MCP intro: https://modelcontextprotocol.io/docs/getting-started/intro
- MCP server docs: https://ts.sdk.modelcontextprotocol.io/documents/server.html
- `skills` CLI: https://skills.sh/

## License

MIT
