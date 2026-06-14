# Query patterns for technical docs and RFC research

Use multiple search angles instead of repeating the same question.

## 1) Official-source angle

Best for definitions, supported behavior, configuration, installation, and product positioning.

Examples:
- `official documentation for Model Context Protocol streamable HTTP stdio`
- `Claude Code plugins official docs skills directory namespace`
- `OpenAI Codex skills official docs .agents/skills`
- `OpenCode skills official docs compatibility .claude .agents`

## 2) Source-repo angle

Best for real implementation details and current file layout.

Examples:
- `openai codex skills loader .agents/skills GitHub`
- `opencode skills.mdx GitHub .agents .claude`
- `anthropic claude-code plugins skills GitHub SKILL.md`

## 3) Release / changelog angle

Best for recent changes and migration risk.

Examples:
- `Mermaid v11 release notes class diagram state diagram`
- `Model Context Protocol spec changelog streamable HTTP SSE deprecated`
- `Claude Code plugins release notes skills`

## 4) Comparison angle

Best for build-vs-buy or ecosystem surveys.

Examples:
- `Claude Code plugins vs standalone skills`
- `Codex skills vs plugins distribution`
- `Exa vs Perplexity for technical research`

## 5) Implementation angle

Best for code paths, API calls, CLI usage, and automation examples.

Examples:
- `npx skills add local path claude-code codex opencode`
- `mmdc validate mermaid markdown fenced code blocks`
- `MCP stdio server npm package config snippet`

## 6) Recency angle

Best when freshness matters.

Examples:
- `site:modelcontextprotocol.io streamable HTTP stdio 2026`
- `site:code.claude.com plugins skills 2026`
- `site:developers.openai.com codex skills 2026`

## Bad query patterns

Avoid:
- repeating the same words with tiny changes
- asking broad questions without naming the system or version
- relying on a single synthesized answer without reading the linked sources

## Good query bundle for an RFC

For one research prompt, aim for 4-6 queries covering:
1. official docs
2. source repository / implementation
3. release notes / recency
4. comparison or alternative view
5. caveats / edge cases
