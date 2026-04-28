# Graphify Integration Setup for Space Agent

Graphify transforms any folder of code, docs, images, or videos into a queryable knowledge graph. Perfect for Sensei to understand codebases, find architectural relationships, and answer design questions.

## Installation

### 1. Install graphify globally

```bash
# Recommended - works on Mac and Linux
uv tool install graphifyy

# Or with pipx
pipx install graphifyy

# Or with pip
pip install graphifyy
```

### 2. Enable in Space Agent

Graphify skills are already integrated into the agent. Use them in conversations:

- **Build graph**: `graphify_build_graph` - Turn a folder into a knowledge graph
- **Query graph**: `graphify_query_graph` - Ask natural language questions
- **Find paths**: `graphify_find_path` - Find connections between concepts
- **Explain nodes**: `graphify_explain_node` - Get explanations of concepts

## Quick Start

### Build a graph of the O.W.P.I.L codebase

```bash
# Build knowledge graph from src/
graphify ./app --out graphify-out --mode fast

# Open the interactive graph
open graphify-out/graph.html
```

### Query from the agent

Tell Sensei:
- "Build a knowledge graph of the dashboard code"
- "Query the graph: what connects the authentication to the user profile?"
- "Find the path from HeroSection to dashboard"
- "Explain the skill registry"

### What you get

- **graph.html** - Interactive visualization, click nodes to explore
- **GRAPH_REPORT.md** - God nodes, surprising connections, suggested questions
- **graph.json** - Persistent queryable graph for later use
- **Token savings** - 71.5x fewer tokens per query vs reading raw files

## Features

### Multimodal Input
- Code (Python, TypeScript, JavaScript, Go, Rust, etc.)
- Docs (markdown, PDFs, HTML)
- Images (screenshots, diagrams)
- Video/Audio (transcribed with Whisper locally)

### Command Examples

```bash
# Build graph on a folder
graphify ./src

# Deep extraction for more connections
graphify ./src --mode deep

# Auto-watch for changes (rebuilds on save)
graphify ./src --watch

# Update only changed files
graphify ./src --update

# Export to different formats
graphify ./src --svg              # SVG graph
graphify ./src --graphml          # Gephi/yEd format
graphify ./src --neo4j            # Neo4j Cypher format
graphify ./src --wiki             # Wikipedia-style articles
```

### Query Examples

```bash
# Natural language query
graphify query "what connects authentication to profiles?"

# Find shortest path between concepts
graphify path "AuthService" "UserProfile"

# Get explanation of a node
graphify explain "SkillRegistry"

# Limit token budget
graphify query "how does the agent work?" --budget 1500
```

## Integration with Space Agent

The agent has 4 graphify skills:

### 1. `graphify_build_graph`
Build a knowledge graph from any folder.

```typescript
// Usage in agent conversation
{
  skill: "graphify_build_graph",
  args: {
    folder_path: "./app",
    mode: "deep",
    output_dir: "graphify-out"
  }
}
```

### 2. `graphify_query_graph`
Query an existing graph with natural language.

```typescript
{
  skill: "graphify_query_graph",
  args: {
    query: "what connects authentication to profiles?",
    graph_path: "graphify-out/graph.json"
  }
}
```

### 3. `graphify_find_path`
Find shortest path between two concepts.

```typescript
{
  skill: "graphify_find_path",
  args: {
    from_node: "HeroSection",
    to_node: "Dashboard",
    graph_path: "graphify-out/graph.json"
  }
}
```

### 4. `graphify_explain_node`
Get plain-language explanation of a concept.

```typescript
{
  skill: "graphify_explain_node",
  args: {
    node_name: "SkillRegistry"
  }
}
```

## Why Graphify + Space Agent?

| Without Graphify | With Graphify |
|---|---|
| Agent reads entire codebases | Agent queries compact graph |
| High token cost per question | 71.5x token savings |
| No architectural overview | God nodes + community structure |
| Hard to find connections | Explicit paths and relationships |
| No confidence scores | Edge confidence tagged |

## Token Savings Example

Querying a 52-file codebase:
- **Raw files**: ~150,000 tokens per query
- **Via graphify**: ~2,100 tokens per query
- **Savings**: 71.5x reduction

## Privacy

- **Code files**: Processed locally with tree-sitter AST (no LLM)
- **Videos/Audio**: Transcribed locally with Whisper (no cloud)
- **Docs/Images**: Sent to your model API (Claude, GPT-4, etc.)
- **No telemetry**: Zero tracking or analytics

## Troubleshooting

### "graphify: command not found"
```bash
# Use the full path
python -m graphify --version

# Or ensure it's on PATH
export PATH="$HOME/.local/bin:$PATH"  # Linux
export PATH="$HOME/Library/Python/3.x/bin:$PATH"  # Mac
```

### Graph extraction is slow
- Use `--mode fast` (default) instead of `--mode deep`
- Run `--update` to only re-process changed files
- Exclude folders with `.graphifyignore`

### "Graph not found" error
- Build the graph first: `graphify ./src`
- Check output directory: default is `graphify-out/`

## Next Steps

1. Build a graph of the O.W.P.I.L codebase
2. Query it: "What are the main architectural components?"
3. Use with agent: "Query the graph about authentication flow"
4. Export for documentation: `graphify ./src --wiki`

**Resources:**
- GitHub: https://github.com/safishamsi/graphify
- Homepage: https://graphifylabs.ai/
- Docs: https://github.com/safishamsi/graphify/tree/v5#usage
