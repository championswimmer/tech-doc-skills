---
name: web-research
description: Use this skill when asked to research current technical information for docs, RFCs, ADRs, design notes, build-vs-buy analysis, API usage, release notes, benchmarks, or ecosystem comparisons. Prioritizes official sources, multi-angle query planning, and explicit failover across Exa, parallel search, and Perplexity.
license: MIT
compatibility: Works best when Exa, Perplexity, and a parallel-search/web-search capability are available. If one provider is unavailable, follow the failover matrix and continue with the remaining tools.
metadata:
  category: docs
  tags: [research, rfc, docs, exa, perplexity, mcp]
---

Use this skill for evidence-backed web research that feeds technical docs and RFCs.

## When to use it

- researching current APIs, libraries, releases, or standards
- gathering evidence for an RFC or ADR
- comparing tools, approaches, or vendors
- finding official docs, changelogs, and source repositories
- validating assumptions with up-to-date information
- collecting citations and open questions before writing

## Default research workflow

1. Restate the research goal in one sentence.
2. Break it into 3-5 subquestions.
3. Generate 3-6 diverse search angles instead of repeating the same query.
4. Prioritize official docs and source repos first.
5. Use at least two independent sources for any consequential claim.
6. Read the best pages, not just snippets.
7. Separate facts, inferences, and unresolved questions.
8. Return citations or links for every non-obvious claim.

## Preferred tool order

### 1) Exa for discovery

Use Exa first when you need semantically relevant pages, official docs, company pages, blog posts, release notes, or specific categories.

Best uses:
- find the best URLs quickly
- find official sources before reading secondary commentary
- discover recent high-signal pages around a topic

### 2) Parallel search for breadth

Use a parallel-search workflow next when you need several search angles explored at once.

Best uses:
- compare multiple approaches side-by-side
- search official docs, GitHub, vendor blogs, and independent commentary in parallel
- reduce query bias from a single phrasing

If a dedicated parallel-search tool is not available, run multiple search queries via a batched web search, or issue several targeted Exa / Perplexity searches yourself.

### 3) Perplexity for synthesis and cross-checking

Use Perplexity after discovery for quick synthesis, summaries with citations, and fact cross-checking.

Best uses:
- summarize what multiple sources agree on
- answer direct factual questions with citations
- check whether an interpretation is broadly supported

### 4) Fetch/read exact pages

After discovery, read the pages that matter.

Use page-fetching tools to:
- inspect official documentation sections
- read release notes and announcements fully
- capture details hidden behind snippets
- preserve exact links for later citation

### 5) Code/doc search for implementation details

If the question is partly about API usage or library behavior, complement web research with code/doc search or official docs lookup.

## Failover matrix

### If Exa is unavailable

- use Perplexity search for URL discovery
- or use a batched web search with 3-4 diverse queries
- then fetch the best pages directly

### If parallel search is unavailable

- run multiple queries manually, each with a distinct angle
- or use a batched web search that supports multiple queries
- explicitly avoid asking the same question in near-duplicate wording

### If Perplexity is unavailable

- use Exa for discovery
- fetch the top pages
- synthesize manually from the retrieved content
- quote the specific source URLs you used

### If both Exa and Perplexity are unavailable

- use any available web search plus page fetching
- bias strongly toward official docs, source repositories, and release notes
- note reduced confidence if source diversity is weak

### If a page blocks extraction or snippets are insufficient

- fetch the page directly with a readability/browser fallback
- if still blocked, find mirrored docs, GitHub sources, or official reference pages

### If the topic is code-heavy

- use code/doc search and official documentation lookup in addition to web search
- prefer source code, API docs, and release notes over forum summaries

## Query design rules

Good query sets vary by angle:
- official docs angle
- source repo / changelog angle
- implementation / architecture angle
- comparison / alternatives angle
- recent updates angle

Bad query sets repeat the same words with small changes.

Use the helper script when you want a fast plan:

```bash
node ./scripts/research-plan.js "How are Claude plugins, Codex skills, OpenCode skills, Pi skills, and MCP servers distributed?"
node ./scripts/research-plan.js "What changed in Mermaid v11 for RFC diagrams?" --queries 5
node ./scripts/research-plan.js --self-test
```

## Source quality rules

Prefer evidence in this order when possible:
1. official docs / specifications
2. source repositories and release notes
3. vendor engineering blogs
4. high-quality third-party deep dives
5. community discussions for edge cases only

For RFCs and technical docs:
- call out publication date or recency when it matters
- distinguish fact from interpretation
- note tool/version scope
- keep a short list of open questions instead of guessing

## Recommended final answer shape

- objective
- key findings
- evidence with links/citations
- implications for the RFC or doc
- risks / caveats
- open questions
- optional appendix with raw sources

## References

Load these on demand:
- `references/query-patterns.md` — strong query patterns for docs, RFCs, APIs, and comparisons
- `references/tool-failover.md` — fallback guidance for Exa, parallel search, Perplexity, and page fetching
- `references/source-quality.md` — how to rank evidence and avoid weak claims
- `references/rfc-research-output-template.md` — a ready structure for turning research into RFC notes
