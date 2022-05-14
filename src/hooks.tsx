import MonacoEditor, { monaco } from "react-monaco-editor";

import { useEffect, useRef } from "react";
import { MyData } from "./logs-to-data";
import { Flank } from "./parser";
import { LOGS_LANGUAGE } from "./monaco-logs-language";
import Plotly from "./plotly";

const triggerPlotlyHover = (
  div: string,
  hover: 
    {
      xval: number;
      yval: number;
      curveNumber: number;
    }[],
  axes: string[]
) => (Plotly as any).Fx.hover(div, hover, axes);

export const useHover = ({
  data,
  setSelected,
  plotlyDiv,
}: {
  data: MyData[];
  setSelected: React.Dispatch<React.SetStateAction<Flank | null>>;
  plotlyDiv: string;
}) =>
  useEffect(() => {
    const hoverProvider = monaco.languages.registerHoverProvider(
      LOGS_LANGUAGE,
      {
        provideHover: function (model, position) {
          for (const { customdata } of data) {
            for (const datum of customdata as Flank[]) {
              const isRightLine = datum.line_idx == position.lineNumber;
              const isRightCol =
                datum.col_start <= position.column &&
                datum.col_end >= position.column;
              if (isRightLine && isRightCol) {
                triggerPlotlyHover(
                  plotlyDiv,
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
          triggerPlotlyHover(plotlyDiv, [], []);
        },
      }
    );

    return () => {
      hoverProvider.dispose();
    };
  }, [data, setSelected, plotlyDiv]);

export const useHighlight = ({
  selected,
  monacoEditor,
}: {
  selected: Flank | null;
  monacoEditor: MonacoEditor | null;
}) => {
  const decorations = useRef<any>(null);

  useEffect(() => {
    decorations.current = monacoEditor?.editor?.deltaDecorations(
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
  }, [monacoEditor, selected]);
};