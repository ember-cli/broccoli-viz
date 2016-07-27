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
