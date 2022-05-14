import type { Data, Layout } from "plotly.js";
import parser, { Flank } from "./parser";
export type MyData = Partial<Data & { customdata: Flank[] }>;

const getData = (patterns: Flank[][]): MyData[] =>
  patterns.map((pattern, patternIdx) => ({
    x: pattern.map(({ x_start }) => x_start),
    y: pattern.map(({ y }) => y),
    yaxis: "y" + (patternIdx + 1),
    fill: "tozeroy",
    name: "L" + (patternIdx + 1),
    customdata: pattern,
    hovertemplate:
      "<b>Num:</b> %{customdata.pulseVal:,.0f}µs<br>" +
      "<b>Flank:</b> %{customdata.flank}<br>" +
      "<b>Flank index:</b> %{customdata.flank_idx}<br>" +
      "<b>Starts at:</b> %{customdata.x_start:,.0f}µs<br>" +
      "<b>Ends at:</b> %{customdata.x_end:,.0f}µs<br>" +
      // "<b>Pattern:</b> L%{customdata.pattern_idx}<br>" +
      "<extra></extra>",
    mode: "lines",
    line: {
      width: 1,
      shape: "hv",
    },
  }));

const getLayout = (patterns: Flank[][]): Partial<Layout> => {
  const layout: Partial<Layout> = {
    uirevision: "true",
    dragmode: "pan",
    // @ts-expect-error /* modebar not in types */
    modebar: {
      orientation: "v",
    },
    grid: {
      rows: patterns.length,
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
  for (let i = 0; i < patterns.length; i++) {
    const axis = ("yaxis" + (i == 0 ? "" : i + 1)) as "yaxis";
    layout[axis] = {
      showticklabels: false,
      fixedrange: true,
      title: "L" + (i + 1),
    };
  }
  return layout;
};


export default function codeToPlotlyParams(logs: string) {
  const patterns = parser(logs);
  const data = getData(patterns);
  const layout = getLayout(patterns);
  return { data, layout };
}