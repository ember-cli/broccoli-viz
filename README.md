## Installation

`npm install -g broccoli-viz`

## Usage

Generate a heimdall-compatible JSON from an ember build.

```sh
BROCCOLI_VIZ=1 ember build
# produces broccoli-viz.0.json

BROCCOLI_VIZ=1 ember serve
# produces broccoli-viz.{buildNumber}.json for each build
```

Produce a graphviz dot file from this JSON

```sh
broccoli-viz broccoli-viz.0.json > broccoli-viz.0.dot
```

Produce a PDF of this graph using graphviz (requires graphviz to be installed)

```sh
dot -Tpdf broccoli-viz.0.dot > broccoli-viz.0.pdf
```

You can then explore the PDF to see where time is being spent on your build.

### Stats Filtering

If you want to show stats other than, or in addition to, the time stats, you can
pass a `--stats` option one or more times.  These are simple glob patterns
matched against the full stats key.

If no `--stats` option is passed, the default is `--stats=time.self --stats=time.total`

Examples:

```sh
# Show time stats and individual fs counts
broccoli-viz --stats='time.*' --stats='fs.*.count' broccoli-viz.0.json > broccoli-viz.0.dot

# Show time stats and lstat, mkdir counts
broccoli-viz --stats='time.*' --stats='fs.lstatSync.count' --stats='fs.mkdirSync.count' broccoli-viz.0.json > broccoli-viz.0.dot

# Show all stats
broccoli-viz --stats='*' broccoli-viz.0.json > broccoli-viz.0.dot
```


### Render subtree

If you want to render only a subtree, `--root-id=:id` where `:id` is the id of the
root of the subgraph we wish to render

If no `--root-id` option is passed, the full graph is rendered

Examples:

```sh
# only renders 255 and its descendents
broccoli-viz --root-id=255 broccoli-viz.0.json > broccoli-viz.0.dot
```
