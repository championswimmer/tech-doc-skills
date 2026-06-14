# Tool failover guide

This skill prefers Exa -> parallel breadth -> Perplexity -> page fetch, but it should degrade gracefully.

## Preferred stack

1. Exa for semantic discovery
2. Parallel search for breadth across multiple angles
3. Perplexity for fast synthesis and citation-rich QA
4. Page fetching / content extraction for exact reading
5. Code/doc search for implementation details

## Exa unavailable

Use:
- Perplexity search for top URLs
- batched web search with 3-6 differentiated queries
- page fetch on the strongest URLs

What to change:
- be more explicit in queries, because keyword search is less semantic
- spend extra effort verifying the official source is actually official

## Parallel search unavailable

Use:
- a batched web search API that supports multiple queries
- or run several Exa / Perplexity searches manually

What to change:
- write the query set before searching
- ensure each query has a different angle: official docs, source repo, release notes, comparison, caveats

## Perplexity unavailable

Use:
- Exa to discover sources
- direct page reads to gather exact claims
- manual synthesis in your own words

What to change:
- cite URLs explicitly
- separate facts from your interpretation since there is less automatic synthesis

## Page extraction fails

Use:
- browser or richer fetch fallback
- source repo mirror, raw docs, or official GitHub pages
- alternate official page that contains the same information

What to change:
- avoid citing only the snippet if the underlying page was not read

## Topic is code/API heavy

Add:
- code/doc search
- official API docs lookup
- source repository search

What to change:
- prefer examples, release notes, and source code over opinionated blog posts

## Minimum acceptable fallback path

If only basic web search remains available:
1. search official docs
2. search source repo
3. read the top 2-5 relevant pages fully
4. capture links for every non-obvious claim
5. mark confidence lower where evidence is thin
