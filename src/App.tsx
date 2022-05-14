import { useRef, useState } from "react";
import Plotly from "./plotly";
import createPlotlyComponent from "react-plotly.js/factory";

import MonacoEditor from "react-monaco-editor";

import { LOGS_LANGUAGE, LOGS_THEME } from "./monaco-logs-language";

import "./App.css";
import codeToPlotlyParams from "./logs-to-data";
import { defaultText } from "./default-code";
import { Flank } from "./parser";
import { useHighlight, useHover } from "./hooks";

const Plot = createPlotlyComponent(Plotly);
const config = { scrollZoom: true };
const gh = "https://github.com/dbuezas/esphome-remote_receiver-oscilloscope";


function App() {
  const [code, setCode] = useState(defaultText);
  const [selected, setSelected] = useState<Flank | null>(null);
  const monacoRef = useRef<MonacoEditor | null>(null);
  const {data, layout} = codeToPlotlyParams(code);
  const plotlyDiv = "plotly_div_id";
  useHover({ data, setSelected, plotlyDiv });

  useHighlight({ monacoEditor: monacoRef.current, selected });
  
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
        theme={LOGS_THEME}
        language={LOGS_LANGUAGE}
        height="200px"
        width="100%"
        options={{
          hover: {
            delay: 0,
          },
          wordWrap: "on",
          automaticLayout: true,
          lineNumbers: (num) => {
            const idx = data.findIndex(({ customdata }) =>  customdata![0].line_idx == num);
            if (idx === -1) return "";
            return "L" + (idx + 1);
          },
          glyphMargin: false,
        }}
      />
      <Plot
        divId={plotlyDiv}
        data={data}
        layout={layout}
        config={config}
        onUnhover={(data) => {
          setSelected(null);
        }}
        onHover={(data) => {
          const point = data.points[0];
          setSelected(point.customdata as unknown as Flank);
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
