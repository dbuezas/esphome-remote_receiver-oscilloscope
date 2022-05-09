import type { Data } from "plotly.js";

function isTruthy<T>(x: T | undefined): x is T {
  return !!x;
}

function logsToArray(logs: string) {
  let lines = logs
    .split("\n")
    .map((line, i) => (line.includes("Received Raw: ") ? i+1 : -1))
    .filter((x) => x !== -1);
  
  let dumpN = 0
  let lineToDump = logs
    .split("\n")
    .map((line, i) => {
      if (line.includes("Received Raw: ")) {
        dumpN++
        return ""+dumpN
      }
      return ""
    })
  let raw = logs
    .replace(/.*\]: /g, "")
    .replace(/\n/g, "")
    .split("Received Raw: ")
    .map((arr) => arr.replace(/[^0-9\-,]/g, ""))
    .map((arr) => {
      try {
        return window.eval(`[${arr}]`) as number[];
      } catch (e) {
        console.log("---------");
        console.log(e);
        console.log(arr);
        console.log("---------");
      }
    })
    .filter(isTruthy);
  raw.shift();
  return {raw, lines, lineToDump};
}

function arrayToData(arr:{raw: number[][], lines: number[], lineToDump: number[]}) {
  const data = arr.raw.map((series2, i) => {
    const series = series2.slice();
    series.unshift(-1);
    series.unshift(1);

    let acc = 0;
    const data: Partial<Data> = {
      x: series.map((val) => (acc += Math.abs(val))),
      y: series.map((val) => (val > 0 ? 1 : 0)),
      yaxis: "y" + (i + 1),
      fill: "tozeroy",
      name: "L" + (i+1),
      text: series as any,
      customdata: {
        // @ts-expect-error
        name: i+1,
      },
      hovertemplate:
        "<b>Pulse length:</b> %{text}us<br>" +
        "<b>value:</b> %{y}<br>" +
        "<b>starts at:</b> %{x}us<br>" ,
      line: {
        width: 1,
        shape: "vh",
      },
    };
    return data;
  });

  return { data, lineToDump: arr.lineToDump };
}

function logsToData(logs: string) {
  return arrayToData(logsToArray(logs));
}

export default logsToData;
