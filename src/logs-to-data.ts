import type { Data } from "plotly.js";
import parser, { Flank } from "./parser";
export type MyData = Partial<Data&{customdata:Flank[]}>
export default function logsToData(logs: string) {
  const patterns = parser(logs);
  return patterns.map((pattern, patternIdx) => {
    const data: MyData  = {
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
    };
    return data;
  });
}
