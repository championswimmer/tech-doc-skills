# Distribution matrix: how skills and MCP are shipped

## Skills across target agents

| Agent | Native project locations | Global/user locations | Plugin/package story | Notes |
| --- | --- | --- | --- | --- |
| Claude Code | `.claude/skills/<name>/SKILL.md` | `~/.claude/skills/<name>/SKILL.md` | Plugins use plugin-root `skills/` plus optional `.claude-plugin/plugin.json` | Plugin skills are namespaced as `plugin-name:skill-name` |
| OpenAI Codex | `.agents/skills/<name>/SKILL.md` scanned from CWD up to repo root | `~/.agents/skills/<name>/SKILL.md` | Codex docs distinguish direct skills from reusable plugins | Symlinked skill folders are supported |
| OpenCode | `.opencode/skills/<name>/SKILL.md`, plus compatible `.claude/skills/` and `.agents/skills/` trees | `~/.config/opencode/skills/<name>/SKILL.md`, plus `~/.claude/skills/` and `~/.agents/skills/` | Can also use remote skill repositories / URLs | Walks upward to the git worktree for project-local discovery |
| Pi | project `.pi/skills/`, package-provided `skills/`, and shared agent-skill locations depending on install mode | `~/.pi/agent/skills/` and shared user-level skill locations | `package.json` can advertise `pi.skills` directories | Package-based distribution is first-class |

## Why `npx skills` is useful here

The `skills` CLI is a pragmatic installer for repositories that expose a `skills/` source tree.

Useful commands:

```bash
npx skills add <source>
npx skills add <source> -g -a claude-code codex opencode
npx skills add <source> -s mermaid-diagrams web-research
npx skills use <source>@web-research --agent codex
npx skills list -g
```

Important behavior:
- it supports local paths as the source, not just GitHub repos
- it can target a subset of agents with `-a`
- it can install only selected skills with `-s`
- for universal agents it uses `.agents/skills` as the canonical target
- Claude Code can also receive `.claude/skills` installs

Practical recommendation for this repo:
- prefer `-a claude-code codex opencode` rather than `--all`
- use `-g` for user-level install, omit it for project-level install
- for Pi, rely on the bundled `package.json.pi.skills` metadata or the included `.pi/skills` compatibility layout

## How MCP servers are distributed

There are two common MCP distribution modes.

### 1) Local MCP servers over `stdio`

Typical packaging:
- npm package invoked with `npx`
- Python package invoked with `uvx`
- standalone binary
- Docker wrapper that runs the server locally

Typical client config pattern:

```json
{
  "mcpServers": {
    "example-server": {
      "command": "npx",
      "args": ["-y", "example-mcp-server"]
    }
  }
}
```

Best for:
- local tools
- filesystem access
- per-user developer workflows
- simple installation from a package registry

### 2) Hosted MCP servers over Streamable HTTP

Typical packaging:
- deployed web service
- stable `/mcp` endpoint
- auth instructions or OAuth flow

Best for:
- shared multi-user services
- SaaS integrations
- centrally managed capabilities

Important protocol note:
- current MCP guidance recommends Streamable HTTP for new remote servers
- older HTTP + SSE transport is kept for backward compatibility

## Repo layout chosen for this bundle

This bundle uses multiple layouts intentionally:

- `skills/` — canonical source of truth and Claude-plugin-friendly layout
- `.claude-plugin/plugin.json` — Claude Code plugin metadata
- `.agents/skills/` — Codex/OpenCode/shared-agent compatibility shim
- `.claude/skills/` — Claude project-skill compatibility shim
- `.opencode/skills/` — OpenCode-native compatibility shim
- `.pi/skills/` — Pi project-skill compatibility shim
- `package.json` with `pi.skills` — Pi package distribution metadata

That lets the same repo work in four ways:
1. as a Claude plugin source tree
2. as an `npx skills` installable bundle
3. as a directly cloned repo with project-local skills discoverable by several agents
4. as a Pi package exposing `skills/`

## Source notes

Primary references used for this matrix:
- `skills` CLI help output (`npx skills --help`, `npx skills use --help`)
- Claude Code plugin docs: https://code.claude.com/docs/en/plugins
- Claude Code skills docs: https://code.claude.com/docs/en/skills
- Codex skills docs: https://developers.openai.com/codex/skills
- OpenCode skills docs: https://open-code.ai/en/docs/skills/
- Pi skills docs: local Pi docs (`docs/skills.md` in the installed Pi package)
- MCP server docs: https://ts.sdk.modelcontextprotocol.io/documents/server.html
- MCP intro: https://modelcontextprotocol.io/docs/getting-started/intro
