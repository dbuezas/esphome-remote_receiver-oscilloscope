const newPatternToken = "Received Raw: ";
const continueToken = ": ";
export type Flank = {
  x_start: number;
  x_end: number;
  y: number;
  flank: "RISING" | "FALLING";
  pulseVal: number;
  duration: number;
  flank_idx: number;
  pattern_idx: number;
  line_idx: number;
  col_start: number;
  col_end: number;
};
export default function parse(log: string) {
  const lines = log.split("\n");
  let currentPattern: Flank[] | null = null;
  const patterns: Flank[][] = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const newPatternStart = line.indexOf(newPatternToken);
    const continueStart = line.indexOf(continueToken);
    let col = -1;
    if (newPatternStart > -1) {
      col = newPatternStart + newPatternToken.length;
      currentPattern = [];
      currentPattern.push({
        // fake pattern so the plot starts on the rising flank
        x_start: 0,
        x_end: 0,
        y: 0,
        flank: "FALLING",
        pulseVal: 0,
        duration: 0,
        flank_idx: 0,
        pattern_idx: patterns.length,
        line_idx: lineIdx + 1,
        col_start: col,
        col_end: col,
      });
      patterns.push(currentPattern);
    } else if (continueStart > -1) {
      col = continueStart + continueToken.length;
    } else {
      col = 0;
      // continue;
    }
    if (currentPattern == null) continue;
    const pulseStr = line.slice(col);
    const pulses = pulseStr.split(",");
    for (let i = 0; i < pulses.length; i++) {
      let pulse = pulses[i];
      while (pulse[0] === " ") {
        col++;
        pulse = pulse.slice(1);
      }
      const pulseVal = parseInt(pulse, 10);
      const lastPulse = currentPattern[currentPattern.length - 1];
      const duration = Math.abs(pulseVal);
      if (Number.isNaN(pulseVal)) continue;
      currentPattern.push({
        x_start: lastPulse.x_end,
        x_end: lastPulse.x_end + duration,
        y: pulseVal > 0 ? 1 : 0,
        flank: pulseVal > 0 ? "RISING" : "FALLING",
        pulseVal,
        duration,
        pattern_idx: patterns.length,
        line_idx: lineIdx + 1,
        flank_idx: currentPattern.length,
        col_start: col,
        col_end: col + pulse.length,
      });
      col += pulse.length + ",".length;
    }
  }
  for (const currentPattern of patterns) {
    const lastPulse = currentPattern[currentPattern.length - 1];
    currentPattern.push({
      // fake pattern so the plot ends on the falling flank
      x_start: lastPulse.x_end,
      x_end: lastPulse.x_end + length,
      y: 0,
      flank: "FALLING",
      pulseVal: 0,
      duration: 0,
      pattern_idx: patterns.length,
      line_idx: lastPulse.line_idx,
      flank_idx: -1,
      col_start: lastPulse.col_end,
      col_end: lastPulse.col_end,
    });
  }
  return patterns;
}
