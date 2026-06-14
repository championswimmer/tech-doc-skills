# Skills, plugins, and MCP: what they are

This repository targets four related but distinct concepts.

## 1) Skills

A skill is the smallest reusable workflow unit for coding agents.

Common shape across Claude Code, Codex, OpenCode, and Pi:
- one folder per skill
- a required `SKILL.md`
- optional `scripts/`, `references/`, `assets/`, or examples
- short frontmatter with at least `name` and `description`

Why skills exist:
- they keep specialized instructions off the base prompt until needed
- they enable progressive disclosure: agents see name/description first, then load the full body only when relevant
- they can bundle executable helper scripts and reference docs beside the prompt text

Cross-agent convergence:
- Claude Code treats skills as reusable instructions discoverable from `.claude/skills/` or from plugins
- OpenAI Codex treats skills as reusable workflows discoverable from `.agents/skills/`
- OpenCode reads its own `.opencode/skills/` plus Claude-compatible and `.agents`-compatible paths
- Pi supports package-provided `skills/` directories and project/user skill locations

## 2) Plugins

A plugin is the installable distribution unit around one or more skills and, depending on the agent, may also bundle extra behavior.

In Claude Code specifically, a plugin can bundle:
- `skills/`
- `agents/`
- `hooks/`
- `.mcp.json`
- `bin/`
- settings and related metadata

That makes plugins a good fit for:
- versioned releases
- team sharing
- grouping multiple related skills
- shipping skills together with MCP configuration or helper executables

Codex documentation draws the same conceptual distinction: skills are the authoring format, plugins are the reusable installable package for sharing skills and optional app integrations.

## 3) MCP

MCP stands for Model Context Protocol.

At a high level, MCP standardizes how an LLM client talks to external capabilities such as tools, prompts, and resources.

Key ideas:
- the client is the LLM application or agent host
- the server exposes tools/resources/prompts
- communication happens over a transport such as local `stdio` or remote Streamable HTTP

Why MCP matters for skill bundles:
- skills can instruct an agent to use MCP-backed tools consistently
- plugins can ship `.mcp.json` config or point users at external MCP servers
- the same research or diagram skill can operate across agents if the relevant tools are exposed consistently

## 4) How these concepts fit together

A practical mental model:
- **Skill** = reusable workflow instructions
- **Plugin** = installable package that may contain one or more skills plus integrations
- **MCP server** = capability provider that exposes tools/resources/prompts to the agent

Example:
- a `web-research` skill tells the agent how to use Exa, Perplexity, or parallel-search effectively
- a plugin can package that skill together with other related skills
- an MCP server can provide one of those search tools to the agent runtime

## Why this repo uses a `skills/` source tree

This bundle keeps canonical content in `skills/` because:
- Claude plugins load skills from a plugin-root `skills/` directory
- `npx skills` understands repositories with skills in a `skills/` tree
- Pi can expose packaged skills from `package.json` metadata pointing at `./skills`
- compatibility shims can point `.agents/skills/`, `.claude/skills/`, `.opencode/skills/`, and `.pi/skills/` back to the same source of truth

## Source notes

Primary references used for this summary:
- Claude Code plugin docs: https://code.claude.com/docs/en/plugins
- Claude Code skills docs: https://code.claude.com/docs/en/skills
- Codex skills docs: https://developers.openai.com/codex/skills
- OpenCode skills docs: https://open-code.ai/en/docs/skills/
- Pi skills docs: local Pi docs (`docs/skills.md` in the installed Pi package)
- MCP docs: https://modelcontextprotocol.io/docs/getting-started/intro
- MCP TypeScript SDK server docs: https://ts.sdk.modelcontextprotocol.io/documents/server.html
