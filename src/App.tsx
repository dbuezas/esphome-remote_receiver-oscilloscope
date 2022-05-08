import { useState } from "react";
import Plot from "react-plotly.js";
import type {Layout} from "plotly.js";

import MonacoEditor from 'react-monaco-editor';
import  './log';


import "./App.css";
import logsToData from "./logs-to-data";

const defaultText = `[15:26:51][D][remote.raw:028]: Received Raw: 1097, -352, 373, -1048, 1075, -355, 379, -1049, 355, -1076, 356, -1052, 356, -1079, 350, -1055, 375, -1057, 1072, -388, 334, -1075, 1073, -356, 353, -1072, 355, -1074, 356, -1052, 355, -1079, 350, -1058, 370, -1056, 1076, -350, 1096, -355,
[15:26:51][D][remote.raw:041]:   349, -1072, 1079, -348, 381, -1052, 356, -1079, 350
[15:26:51][D][remote.raw:028]: Received Raw: 1095, -352, 347, -1071, 1075, -356, 378, -1049, 355, -1076, 355, -1053, 356, -1080, 349, -1084, 348, -1056, 1074, -376, 346, -1075, 1074, -356, 357, -1068, 355, -1075, 356, -1053, 356, -1078, 349, -1081, 347, -1056, 1097, -352, 1073, -380,
[15:26:51][D][remote.raw:041]:   351, -1072, 354, -1049, 1081, -374, 349, -1080, 347
[15:26:51][D][remote.raw:028]: Received Raw: 1103, -355, 354, -1075, 1056, -373, 349, -1081, 351, -1056, 347, -1080, 347, -1075, 347, -1074, 349, -1072, 1078, -350, 381, -1051, 1081, -347, 373, -1058, 370, -1056, 346, -1077, 347, -1074, 350, -1072, 353, -1072, 1081, -349, 1081, -371,
[15:26:51][D][remote.raw:041]:   1073, -349, 371, -1073, 348, -1073, 352, -1072, 355`;

function App() {
  const [code, setCode] = useState(defaultText);

  const {data} = logsToData(code)
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
      Paste the esphome logs here:
      <br />
      <br />
      <MonacoEditor
        value={code}
        onChange={code => setCode(code)}
        language="coffeescript"
        height="200px"
      />
       
      <Plot
        data={data}
        layout={layout}
        useResizeHandler
        style={{width: "100%", height: "100%"}}
      />
    </div>
  );
}

export default App;
