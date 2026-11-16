/**
 * The ASCII background is one drawing: a nine-layer neural network in training.
 * Pure helpers only — no DOM, React or timers. Every glyph is a real monospace
 * character painted with Canvas 2D; there are no images, SVG paths or WebGL.
 */

/** Row height relative to a cell's width — tuned for monospace line spacing. */
export const ROW_SCALE = 1.9;

export interface Point {
  x: number;
  y: number;
}

/**
 * Cursor position used by the responsive scene.
 *
 * `x` / `y` are normalised viewport coordinates in [-1, 1], measured from the
 * viewport centre (x: left → right, y: top → bottom). Raw CSS pixels would need
 * the canvas cell size to map onto the glyph grid; normalised coordinates map
 * directly onto grid fractions because the grid spans the whole viewport.
 * The renderer smooths these values before passing them in. `active` is false
 * once the cursor has left and the position has eased back to rest.
 */
export interface Pointer {
  x: number;
  y: number;
  active: boolean;
}

export interface Palette {
  /** Theme-derived colour for the quiet body of the diagram. */
  base: string;
  /** Theme-derived colour for active pulses and highlights. */
  strong: string;
}

/** A tiny character framebuffer. Higher alpha wins when cells overlap. */
export class GlyphGrid {
  readonly cols: number;
  readonly rows: number;
  readonly chars: string[];
  readonly alpha: Float32Array;
  /** Cells painted with the strong palette colour (receptive-field core). */
  readonly strong: Uint8Array;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.chars = new Array<string>(cols * rows).fill(" ");
    this.alpha = new Float32Array(cols * rows);
    this.strong = new Uint8Array(cols * rows);
  }

  put(x: number, y: number, character: string, alpha = 0.5): void {
    const column = Math.round(x);
    const row = Math.round(y);
    if (column < 0 || row < 0 || column >= this.cols || row >= this.rows) return;
    const index = row * this.cols + column;
    if (alpha >= this.alpha[index]) {
      this.chars[index] = character;
      this.alpha[index] = alpha;
    }
  }

  /** Writes text, skipping spaces so labels never erase overlapping lines. */
  text(x: number, y: number, value: string, alpha = 0.5): void {
    Array.from(value).forEach((character, index) => {
      if (character !== " ") this.put(x + index, y, character, alpha);
    });
  }

  /**
   * Soft "receptive field": gently brightens existing glyphs around a point in
   * grid space. Falloff is a smoothstep over a normalised ellipse, so there is
   * no visible hard circle — brightness simply melts back into the field.
   * Only the small core of the ellipse switches to the strong palette.
   */
  focus(
    cx: number,
    cy: number,
    radiusX: number,
    radiusY: number,
    gain: number,
  ): void {
    const x0 = Math.max(0, Math.floor(cx - radiusX));
    const x1 = Math.min(this.cols - 1, Math.ceil(cx + radiusX));
    const y0 = Math.max(0, Math.floor(cy - radiusY));
    const y1 = Math.min(this.rows - 1, Math.ceil(cy + radiusY));

    for (let row = y0; row <= y1; row++) {
      for (let column = x0; column <= x1; column++) {
        const index = row * this.cols + column;
        if (this.chars[index] === " ") continue;

        const dx = (column - cx) / radiusX;
        const dy = (row - cy) / radiusY;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared >= 1) continue;

        const linear = 1 - distanceSquared;
        const falloff = linear * linear * (3 - 2 * linear);
        this.alpha[index] = Math.min(1, this.alpha[index] + gain * falloff);
        if (distanceSquared < 0.14 && falloff > 0.45 && gain > 0.1) {
          this.strong[index] = 1;
        }
      }
    }
  }
}

/** Layer widths of the multilayer perceptron living in the background. */
const DEEP_WIDTHS = [4, 6, 8, 10, 10, 10, 8, 6, 3] as const;

/** Stable pseudo-random weight per connection, so the mesh never flickers. */
function weight(a: number, b: number, c: number): number {
  let n =
    Math.imul(a + 1, 73856093) ^
    Math.imul(b + 1, 19349663) ^
    Math.imul(c + 1, 83492791);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

/**
 * A wide, deliberately deep network drawn across the whole viewport. It gets
 * its grid size from the window so no hidden layer is cropped away.
 *
 * One loop (~11s): a layer-by-layer activation wave, three forward signals,
 * a loss reading, then error signals travelling back through the same graph.
 * This is a drawing of the *shape* of training, not a real model.
 */
export function buildDeepNetScene(
  cols: number,
  rows: number,
  time: number,
  pointer?: Pointer,
): GlyphGrid {
  const grid = new GlyphGrid(cols, rows);
  const count = DEEP_WIDTHS.length;
  const margin = Math.max(3, Math.round(cols * 0.04));
  const top = Math.max(5, Math.round(rows * 0.13));
  const bottom = rows - Math.max(6, Math.round(rows * 0.17));
  const span = Math.max(1, bottom - top);

  // --- Cursor response -----------------------------------------------------
  // The pointer arrives normalised and already smoothed by the renderer, so
  // the mesh can simply lean into it. With no pointer (reduced motion, or the
  // very first frame) every offset is zero and the resting scene is unchanged.
  const px = pointer ? Math.max(-1, Math.min(1, pointer.x)) : 0;
  const py = pointer ? Math.max(-1, Math.min(1, pointer.y)) : 0;
  const pointerOn = pointer?.active ?? false;

  // The grid spans the viewport, so a normalised position maps straight onto
  // grid fractions without needing the canvas cell size.
  const focusX = (px * 0.5 + 0.5) * (cols - 1);
  const focusY = (py * 0.5 + 0.5) * (rows - 1);
  // Scale the field's gain with distance from centre. When the cursor leaves,
  // the renderer eases the position back to zero, so this fades out smoothly
  // instead of snapping off at the window edge.
  const focusGain = pointerOn ? 0.25 * Math.min(1, Math.hypot(px, py) * 2.2) : 0;

  // Glyphs soften towards the centre, where the reading column sits.
  const damp = (x: number): number =>
    0.52 + 0.48 * Math.min(1, Math.abs(x - cols / 2) / (cols * 0.34));

  const layers = DEEP_WIDTHS.map((size, layerIndex) => {
    const depth = layerIndex / (count - 1);
    // Deeper layers lean a little further toward the cursor (up to ~1.8 cols),
    // so the whole mesh subtly tilts rather than sliding as one block.
    const x =
      margin +
      layerIndex / (count - 1) * (cols - 1 - 2 * margin) +
      px * 1.8 * depth;
    return Array.from({ length: size }, (_, nodeIndex) => ({
      x,
      y: top + (nodeIndex / (size - 1)) * span + py * 1.2,
    }));
  });

  const stroke = (from: Point, to: Point, alpha: number): void => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const steps = Math.max(1, Math.round(Math.max(Math.abs(dx), Math.abs(dy))));
    const character =
      Math.abs(dx) < 1 ? "|" : Math.abs(dy) < 1 ? "-" : dx * dy > 0 ? "\\" : "/";
    for (let step = 0; step <= steps; step++) {
      const fraction = step / steps;
      grid.put(
        from.x + dx * fraction,
        from.y + dy * fraction,
        character,
        alpha * damp(from.x + dx * fraction),
      );
    }
  };

  // A travelling signal follows its straight line, but bows gently toward the
  // cursor in the middle of the hop (endpoints stay pinned to their neurons).
  const curve = (from: Point, to: Point, t: number): Point => {
    let x = from.x + (to.x - from.x) * t;
    let y = from.y + (to.y - from.y) * t;
    if (pointerOn) {
      const bump = Math.sin(Math.PI * t);
      const vx = focusX - x;
      const vy = focusY - y;
      const distance = Math.hypot(vx, vy) || 1;
      const pull = Math.min(1, 6 / distance) * 1.2 * bump;
      x += (vx / distance) * pull;
      y += (vy / distance) * pull;
    }
    return { x, y };
  };

  const strokeSignal = (from: Point, to: Point, alpha: number): void => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const steps = Math.max(1, Math.round(Math.max(Math.abs(dx), Math.abs(dy))));
    const character =
      Math.abs(dx) < 1 ? "|" : Math.abs(dy) < 1 ? "-" : dx * dy > 0 ? "\\" : "/";
    for (let step = 0; step <= steps; step++) {
      const t = step / steps;
      const point = curve(from, to, t);
      grid.put(point.x, point.y, character, alpha * damp(point.x));
    }
  };

  // The dense mesh: every neuron connected to every neuron in the next layer.
  // Stronger weights are drawn brighter, which gives the field its texture.
  for (let layerIndex = 0; layerIndex < count - 1; layerIndex++) {
    const layer = layers[layerIndex];
    const next = layers[layerIndex + 1];
    for (let fromIndex = 0; fromIndex < layer.length; fromIndex++) {
      for (let toIndex = 0; toIndex < next.length; toIndex++) {
        const w = weight(layerIndex, fromIndex, toIndex);
        stroke(layer[fromIndex], next[toIndex], 0.045 + w * 0.12);
      }
    }
  }

  const cycle = time / 11;
  const epoch = Math.floor(time / 11);
  const phase = cycle % 1;

  // The forward pass lights up whole layers in sequence — a wave you can
  // watch crossing the page, with the most recent layer glowing brightest.
  if (phase < 0.62) {
    const wave = (phase / 0.62) * (count - 1);
    const waveIndex = Math.min(count - 1, Math.floor(wave));
    const waveFraction = wave - waveIndex;
    layers.forEach((layer, layerIndex) => {
      if (layerIndex > waveIndex) return;
      const age = waveIndex - layerIndex;
      const alpha =
        age === 0
          ? 0.72 + 0.2 * waveFraction
          : age === 1
            ? 0.6
            : 0.42 * Math.exp(-age * 0.6);
      if (alpha < 0.44) return;
      layer.forEach((node) => grid.put(node.x, node.y, "@", alpha * damp(node.x)));
    });
  }

  // Three signals travel together, like a tiny training batch, each with a
  // deterministic route through the layer widths.
  for (let batch = 0; batch < 3; batch++) {
    const local = (cycle + batch * 0.3) % 1;
    const route = layers.map((_, layerIndex) =>
      Math.floor(weight(batch, layerIndex, 17) * DEEP_WIDTHS[layerIndex]),
    );
    const forward = local < 0.6;
    const progress = forward
      ? (local / 0.6) * (count - 1)
      : (1 - (local - 0.6) / 0.4) * (count - 1);
    const index = Math.max(0, Math.min(count - 2, Math.floor(progress)));
    const fraction = progress - index;
    const a = forward
      ? layers[index][route[index]]
      : layers[index + 1][route[index + 1]];
    const b = forward
      ? layers[index + 1][route[index + 1]]
      : layers[index][route[index]];
    strokeSignal(a, b, forward ? 0.55 : 0.4);
    const head = curve(a, b, fraction);
    grid.put(head.x, head.y, forward ? "*" : "+", 0.98);
    if (forward) {
      for (let layerIndex = 0; layerIndex <= index; layerIndex++) {
        const age = index - layerIndex;
        if (age > 2) continue;
        const node = layers[layerIndex][route[layerIndex]];
        grid.put(node.x, node.y, "@", 0.94 - age * 0.18);
      }
    }
  }

  layers.forEach((layer) => {
    layer.forEach((node) => {
      if (grid.alpha[Math.round(node.y) * cols + Math.round(node.x)] < 0.8) {
        grid.put(node.x, node.y, "o", 0.5 * damp(node.x));
      }
    });
  });

  // A small loss trace in the top-left margin, dipping as the epoch advances.
  const lossX = 1;
  grid.text(lossX, 1, "loss", 0.3);
  const lossY = (i: number): number => 3 + Math.round(2 * Math.exp(-i / 5));
  for (let i = 0; i < 14; i++) {
    grid.put(lossX + i, lossY(i), i % 4 === 0 ? "-" : ".", 0.16 + i * 0.006);
  }
  const marker = Math.floor((cycle % 1) * 13);
  grid.put(lossX + marker, lossY(marker), "@", 0.8);

  const names = [
    "in",
    ...Array.from({ length: count - 2 }, (_, i) => `h${i + 1}`),
    "out",
  ];
  layers.forEach((layer, layerIndex) => {
    const label = names[layerIndex];
    const x = layer[0].x;
    grid.text(Math.round(x - label.length / 2), bottom + 2, label, 0.26 * damp(x));
  });
  grid.text(
    Math.max(1, Math.round(cols / 2 - 5)),
    rows - 2,
    `epoch ${String(epoch % 1000).padStart(3, "0")}`,
    0.24,
  );

  // Last pass: brighten the soft receptive field around the cursor.
  if (focusGain > 0.001) grid.focus(focusX, focusY, 8, 6, focusGain);
  return grid;
}

/** Paint a framebuffer as monospace glyphs. */
export function paintGrid(
  context: CanvasRenderingContext2D,
  grid: GlyphGrid,
  x: number,
  y: number,
  cell: number,
  palette: Palette,
): void {
  const rowHeight = cell * ROW_SCALE;
  context.font = `${(cell * 1.55).toFixed(1)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  context.textBaseline = "top";
  let usingStrong: boolean | null = null;
  for (let row = 0; row < grid.rows; row++) {
    const baseline = y + row * rowHeight;
    for (let column = 0; column < grid.cols; column++) {
      const index = row * grid.cols + column;
      const character = grid.chars[index];
      if (character === " ") continue;
      const strong = grid.strong[index] === 1 || grid.alpha[index] >= 0.78;
      if (strong !== usingStrong) {
        context.fillStyle = strong ? palette.strong : palette.base;
        usingStrong = strong;
      }
      context.globalAlpha = grid.alpha[index];
      context.fillText(character, x + column * cell, baseline);
    }
  }
  context.globalAlpha = 1;
}
