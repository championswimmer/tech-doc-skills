# tech-doc-skills

Portable agent skills for writing technical docs and RFCs.

This repository publishes a small cross-agent skill bundle that works with:
- **Claude Code**
- **OpenAI Codex**
- **OpenCode**
- **Pi coding agent**

It currently ships two skills:
- `mermaid-diagrams` — create, style, template, and validate Mermaid diagrams for docs and RFCs
- `web-research` — research current technical topics with explicit tool ordering, citations, and failover across Exa, parallel search, and Perplexity

---

## Quick install

### Install the whole bundle

Project-local install for Claude Code, Codex, and OpenCode:

```bash
npx skills add championswimmer/tech-doc-skills -a claude-code codex opencode
```

Global install instead of project-local:

```bash
npx skills add championswimmer/tech-doc-skills -g -a claude-code codex opencode
```

### Install one skill only

Install only `mermaid-diagrams`:

```bash
npx skills add championswimmer/tech-doc-skills -a claude-code codex opencode -s mermaid-diagrams
```

Install only `web-research`:

```bash
npx skills add championswimmer/tech-doc-skills -a claude-code codex opencode -s web-research
```

Install multiple selected skills:

```bash
npx skills add championswimmer/tech-doc-skills -a claude-code codex opencode -s mermaid-diagrams web-research
```

List available skills without installing:

```bash
npx skills add championswimmer/tech-doc-skills -l -y
```

### Use a skill without installing it

Generate a one-off prompt from a skill:

```bash
npx skills use championswimmer/tech-doc-skills --skill mermaid-diagrams
npx skills use championswimmer/tech-doc-skills --skill web-research
```

If you want `skills` to launch a supported agent directly, run it from a real interactive terminal:

```bash
npx skills use championswimmer/tech-doc-skills --skill mermaid-diagrams --agent claude-code
npx skills use championswimmer/tech-doc-skills --skill web-research --agent codex
```

> `skills use --agent ...` needs a TTY. In CI or other non-interactive shells, use prompt generation instead.

---

## Install instructions by agent

## Claude Code

### Install the full plugin/skill bundle

```bash
npx skills add championswimmer/tech-doc-skills -a claude-code
```

### Install one Claude Code skill only

```bash
npx skills add championswimmer/tech-doc-skills -a claude-code -s mermaid-diagrams
npx skills add championswimmer/tech-doc-skills -a claude-code -s web-research
```

### Use without installing

```bash
npx skills use championswimmer/tech-doc-skills --skill mermaid-diagrams
```

This repo also contains Claude-friendly layout for direct consumption:
- `.claude-plugin/plugin.json`
- `.claude/skills/`
- canonical plugin `skills/`

## OpenAI Codex

### Install the full bundle

```bash
npx skills add championswimmer/tech-doc-skills -a codex
```

### Install one Codex skill only

```bash
npx skills add championswimmer/tech-doc-skills -a codex -s mermaid-diagrams
npx skills add championswimmer/tech-doc-skills -a codex -s web-research
```

### Use without installing

```bash
npx skills use championswimmer/tech-doc-skills --skill web-research
```

This repo also includes Codex-compatible `.agents/skills/` shims.

## OpenCode

### Install the full bundle

```bash
npx skills add championswimmer/tech-doc-skills -a opencode
```

### Install one OpenCode skill only

```bash
npx skills add championswimmer/tech-doc-skills -a opencode -s mermaid-diagrams
npx skills add championswimmer/tech-doc-skills -a opencode -s web-research
```

### Use without installing

```bash
npx skills use championswimmer/tech-doc-skills --skill mermaid-diagrams
```

This repo also includes OpenCode-compatible `.opencode/skills/` shims and shared `.agents/skills/` compatibility.

## Pi coding agent

Pi support is provided by the repository layout and package metadata.

This repo includes:
- `package.json` with `pi.skills: ["./skills"]`
- `.pi/skills/` compatibility shims
- canonical `skills/` directories

### Install the full bundle for Pi

Install the package from GitHub:

```bash
npm install github:championswimmer/tech-doc-skills
```

Pi can then discover the packaged `skills/` directory through `package.json` metadata.

### Install one Pi skill only

If you want only one skill exposed in a project-local `.pi/skills/` directory:

```bash
npm install github:championswimmer/tech-doc-skills
mkdir -p .pi/skills
PKG_DIR=$(node -p "require('path').dirname(require.resolve('tech-doc-skills/package.json'))")
ln -s "$PKG_DIR/skills/mermaid-diagrams" .pi/skills/mermaid-diagrams
```

Or for the research skill:

```bash
npm install github:championswimmer/tech-doc-skills
mkdir -p .pi/skills
PKG_DIR=$(node -p "require('path').dirname(require.resolve('tech-doc-skills/package.json'))")
ln -s "$PKG_DIR/skills/web-research" .pi/skills/web-research
```

### Use the repo directly with Pi

If Pi is running inside this repo or a copied project tree, it can use:
- `.pi/skills/`
- package-provided `skills/`
- shared skill layouts such as `.agents/skills/`, depending on your Pi setup

---

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

---

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

---

## How to ask your agent to use these skills

After install, prompts like these usually work well:

- `Use the mermaid-diagrams skill to turn this architecture note into a Mermaid flowchart and validate it.`
- `Use the web-research skill to gather current sources for this RFC and list open questions.`
- `Use the web-research skill first, then use mermaid-diagrams to visualize the final architecture.`

---

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

**MCP** (Model Context Protocol) is how agents connect to external tools/resources/prompts. Skills tell the model how to use those tools well; MCP servers provide the tools themselves.

For the longer research summary, see:
- [`research/agent-skills-plugins-and-mcp.md`](research/agent-skills-plugins-and-mcp.md)
- [`research/distribution-matrix.md`](research/distribution-matrix.md)

---

## Agent compatibility matrix

| Agent | Supported by this repo | How |
| --- | --- | --- |
| Claude Code | Yes | `skills/` plugin layout, `.claude-plugin/plugin.json`, and `.claude/skills/` shims |
| OpenAI Codex | Yes | `.agents/skills/` shims and `npx skills` install flow |
| OpenCode | Yes | `.opencode/skills/` shims plus `.agents/skills/` compatibility |
| Pi | Yes | `package.json.pi.skills`, `.pi/skills/`, and shared skill-compatible layout |

---

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

---

## Validate locally

```bash
npm run validate:mermaid
npm run validate:research
npm run validate
```

---

## Authoring / maintenance notes

- Keep the canonical source of truth in `skills/`
- Keep compatibility directories as symlinks pointing back to `skills/`
- Keep `SKILL.md` lean; move heavy detail into `references/`
- Validate example scripts whenever the skill body changes
- Prefer official docs and source repos in the research references

---

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
