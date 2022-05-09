import { useState } from "react";
// import Plotly from "plotly.js-basic-dist";
import Plotly from "./plotly";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

import type {Layout} from "plotly.js";

import MonacoEditor from 'react-monaco-editor';
import  './log';


import "./App.css";
import logsToData from "./logs-to-data";
import { defaultText } from "./default-code";

const gh = 'https://github.com/dbuezas/esphome-remote_receiver-oscilloscope'

function App() {
  const [code, setCode] = useState(defaultText);

  const {data, lineToDump} = logsToData(code)
  const layout: Partial<Layout> = {
    grid:{
      rows: data.length,
      columns: 1,
      pattern: "coupled",
      roworder: "top to bottom",
    },
    yaxis: {
      showticklabels: false,
    },
    height: 600,
    margin: {
      l: 10,
      r: 10,
      t: 10,
      b: 20,
    },
    autosize:true,
    // showlegend: false,
  }
  for (let i = 0; i< data.length;i++){
    const axis = "yaxis"+(i+1) as "yaxis" 
    layout[axis] = {
      showticklabels: false,
    }
  }
  /* onChange={(evn) => setCode(evn.target.value)} */
  return (
    <div style={{margin: 10}}>
       <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css"
      />
      Paste the esphome logs here:
      <br />
      <br />
      <MonacoEditor
        value={code}
        onChange={code => setCode(code)}
        theme="myCoolTheme"
      	language="mySpecialLanguage"
        height="200px"
        width="100%"
        options= {{
          automaticLayout:true,
          lineNumbers: num=>lineToDump[num-1]?"L"+lineToDump[num-1]:"",
          glyphMargin: false,
        }}
      />
       
      <Plot
        data={data}
        layout={layout}
        useResizeHandler
        style={{width: "100%", height: "100%"}}
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
