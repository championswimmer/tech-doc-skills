# tech-doc-skills

Portable agent skills for writing technical docs and RFCs.

This repo is the canonical source for two reusable skills:

- `mermaid-diagrams` — write, style, template, and validate Mermaid diagrams for architecture notes, RFCs, ADRs, and READMEs
- `web-research` — gather current technical evidence with a clear query strategy, source-quality rules, and failover across search tools

These skills are designed to work with **Claude Code**, **OpenAI Codex**, **OpenCode**, and **Pi** through the same canonical `skills/` tree.

## Install

Install the bundle from this GitHub repo:

```bash
npx skills add championswimmer/tech-doc-skills
```

Install only one skill if you want a narrower setup:

```bash
npx skills add championswimmer/tech-doc-skills -s mermaid-diagrams
npx skills add championswimmer/tech-doc-skills -s web-research
```

## What these skills do

### `mermaid-diagrams`

Use this skill when you want to:
- turn a design into a diagram
- choose the right Mermaid diagram type
- group things cleanly with subgraphs and boxes
- apply semantic colors for actors, control planes, data stores, success, and failure
- validate Mermaid before publishing docs

Includes:
- `scripts/validate-mermaid.js`
- `scripts/new-mermaid-template.js`
- `references/diagram-types.md`
- `references/flowchart-keywords.md`
- `references/er-keywords.md`
- `references/gantt-keywords.md`
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

## Repository layout

```text
.
├── README.md
├── LICENSE
├── package.json
└── skills/
    ├── mermaid-diagrams/
    │   ├── SKILL.md
    │   ├── references/
    │   └── scripts/
    └── web-research/
        ├── SKILL.md
        ├── references/
        └── scripts/
```

## Validate locally

```bash
npm run validate:mermaid
npm run validate:research
npm run validate
```

## License

MIT
