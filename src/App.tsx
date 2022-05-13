import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import Plotly from "plotly.js-basic-dist";
import Plotly from "./plotly";
import createPlotlyComponent from "react-plotly.js/factory";

import type { Layout } from "plotly.js";

import MonacoEditor, { monaco } from "react-monaco-editor";

import "./log";

import "./App.css";
import logsToData from "./logs-to-data";
import { defaultText } from "./default-code";
import { Flank } from "./parser";

const Plot = createPlotlyComponent(Plotly);
const config = { scrollZoom: true };
const gh = "https://github.com/dbuezas/esphome-remote_receiver-oscilloscope";

function App() {
  const [code, setCode] = useState(defaultText);
  const [selected, setSelected] = useState<Flank | null>(null);
  const monacoRef = useRef<MonacoEditor | null>(null);
  const decorations = useRef<any>(null);
  const data = logsToData(code);

  useEffect(() => {
    const hoverProvider = monaco.languages.registerHoverProvider(
      "mySpecialLanguage",
      {
        provideHover: function (model, position) {
          for (const { customdata } of data) {
            for (const datum of customdata as Flank[]) {
              const isRightLine = datum.line_idx == position.lineNumber;
              const isRightCol =
                datum.col_start <= position.column &&
                datum.col_end >= position.column;
              if (isRightLine && isRightCol) {
                Plotly.Fx.hover(
                  "plotly_1234",
                  [
                    {
                      xval: datum.x_start,
                      yval: datum.y,
                      curveNumber: datum.pattern_idx - 1,
                    },
                  ],
                  ["xy" + (datum.pattern_idx == 1 ? "" : datum.pattern_idx)]
                );
                setSelected(datum);
                return { contents: [] };
                // return {
                //   range: new monaco.Range(
                //     datum.line_idx,
                //     datum.col_start+1,
                //     datum.line_idx,
                //     datum.col_end+1
                //   ),
                //   contents: [
                //     { value: "**SOURCE**" },
                //     { value: "```html\n" + JSON.stringify(datum) + "\n```" },
                //   ],
                // };
              }
            }
          }
          // remove tooltip
          Plotly.Fx.hover("plotly_1234", [], []);
        },
      }
    );

    return () => {
      hoverProvider.dispose();
    };
  }, [monacoRef.current]);
  useEffect(() => {
    console.log(selected);
    decorations.current = monacoRef.current?.editor?.deltaDecorations(
      decorations.current || [],
      selected === null
        ? []
        : [
            {
              range: new monaco.Range(
                selected.line_idx,
                0,
                selected.line_idx,
                0
              ),
              options: {
                isWholeLine: true,
                linesDecorationsClassName: "myLineDecoration",
              },
            },
            {
              range: new monaco.Range(
                selected.line_idx,
                selected.col_start + 1,
                selected.line_idx,
                selected.col_end + 1
              ),
              options: { inlineClassName: "myInlineDecoration" },
            },
          ]
    );
    console.log(decorations.current);
  }, [monacoRef.current, selected]);
  const layout: Partial<Layout> = {
    uirevision: "true",
    dragmode: "pan",
    // @ts-expect-error /* modebar not in types */
    modebar: {
      orientation: "v",
    },
    grid: {
      rows: data.length,
      columns: 1,
      pattern: "coupled",
      roworder: "top to bottom",
    },
    xaxis: {
      tickformat: ",.0f",
      ticksuffix: "µs",
    },
    yaxis: {
      showticklabels: false,
    },
    hoverlabel: { bgcolor: "#FFF" },
    height: 600,
    margin: {
      l: 30,
      r: 30,
      t: 10,
      b: 20,
    },
    hovermode: "x unified",
    hoverdistance: -1,
    autosize: true,
    showlegend: false,
  };
  for (let i = 0; i < data.length; i++) {
    const axis = ("yaxis" + (i == 0 ? "" : i + 1)) as "yaxis";
    layout[axis] = {
      showticklabels: false,
      fixedrange: true,
      title: "L" + (i + 1),
    };
  }
  /* onChange={(evn) => setCode(evn.target.value)} */
  return (
    <div style={{ margin: 10 }}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css"
      />
      Paste the esphome logs here:
      <br />
      <br />
      <MonacoEditor
        ref={monacoRef}
        value={code}
        onChange={(code) => setCode(code)}
        theme="myCoolTheme"
        language="mySpecialLanguage"
        height="200px"
        width="100%"
        options={{
          hover: {
            delay: 0,
          },
          wordWrap: "on",
          automaticLayout: true,
          lineNumbers: (num) => {
            const idx = data.findIndex(({ customdata }) => {
              const r = customdata![0].line_idx == num;
              return r;
            });
            if (idx < 0) return "";
            return "L" + (idx + 1);
          },
          glyphMargin: false,
        }}
      />
      <Plot
        divId="plotly_1234"
        data={data}
        layout={layout}
        config={config}
        onUnhover={(data) => {
          setSelected(null);
        }}
        onHover={(data: any) => {
          const point = data.points[0];
          setSelected(point.customdata);
        }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
      <a
        className="github-fork-ribbon right-bottom fixed"
        href={gh}
        data-ribbon="Fork me on GitHub"
        title="Fork me on GitHub"
      >
        Fork me on GitHub
      </a>
    </div>
  );
}

export default App;
