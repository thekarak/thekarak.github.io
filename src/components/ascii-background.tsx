"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  buildDeepNetScene,
  paintGrid,
  ROW_SCALE,
  type Palette,
  type Pointer,
} from "./ascii-scenes";

const FRAME_MS = 1000 / 12;
/** How quickly the smoothed pointer chases the real one (per animation frame). */
const POINTER_EASE = 0.08;

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  return {
    base: styles.getPropertyValue("--ascii").trim() || "#3b4673",
    strong: styles.getPropertyValue("--ascii-strong").trim() || "#26305c",
  };
}

/** The background is decorative only: one fixed canvas, no controls. */
export function AsciiBackground() {
  // Null on the first render keeps server and client markup identical.
  const [host, setHost] = useState<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pointer state lives entirely in refs: moving the cursor must never cause a
  // React render. `target` is the raw normalised position, `current` is the
  // eased position the scene actually reads once per drawn frame.
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const active = useRef(false);
  const leaving = useRef(false);

  useEffect(() => setHost(document.body), []);

  useEffect(() => {
    if (!host) return;
    const element = canvasRef.current;
    const context = element?.getContext("2d", { alpha: true });
    if (!element || !context) return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastDraw = 0;
    let disposed = false;
    let time = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let palette = readPalette();
    let reduced = motion.matches;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const cell = Math.max(5, Math.min(width / 60, height / (34 * ROW_SCALE)));
      const cols = Math.max(24, Math.floor(width / cell));
      const rows = Math.max(18, Math.min(34, Math.floor(height / (cell * ROW_SCALE))));

      // Normalised coordinates (-1..1 from the viewport centre) are passed
      // straight through: the glyph grid spans the viewport, so they map onto
      // grid fractions without the renderer knowing the canvas cell size.
      // Reduced motion keeps the frame static and ignores the pointer.
      const pointer: Pointer | undefined = reduced
        ? undefined
        : {
            x: current.current.x,
            y: current.current.y,
            active: active.current,
          };

      paintGrid(context, buildDeepNetScene(cols, rows, time, pointer), 0, 0, cell, palette);
    };

    const still = () => reduced || document.hidden;
    const tick = (now: number) => {
      if (disposed || still()) {
        frame = 0;
        return;
      }
      if (!lastDraw) lastDraw = now;
      const elapsed = now - lastDraw;

      // Ease every animation frame (not only at draw time) so the mesh tracks
      // the cursor smoothly regardless of display refresh rate. This is pure
      // number crunching — no state updates, no allocations.
      current.current.x += (target.current.x - current.current.x) * POINTER_EASE;
      current.current.y += (target.current.y - current.current.y) * POINTER_EASE;

      // On leave we keep `active` true until the position has settled, then
      // flip it off. That lets the field melt back to rest instead of snapping.
      if (leaving.current) {
        if (
          Math.abs(current.current.x) < 0.002 &&
          Math.abs(current.current.y) < 0.002
        ) {
          current.current.x = 0;
          current.current.y = 0;
          active.current = false;
          leaving.current = false;
        }
      }

      if (elapsed >= FRAME_MS) {
        time += Math.min(elapsed / 1000, 0.1);
        lastDraw = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastDraw = 0;
      reduced = motion.matches;
      palette = readPalette();
      draw();
      if (!still()) frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      sync();
    };

    // --- Pointer listeners (passive; they never touch React state) ----------
    const onPointerMove = (event: PointerEvent) => {
      target.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (event.clientY / window.innerHeight) * 2 - 1;
      active.current = true;
      leaving.current = false;
    };

    const onPointerLeave = () => {
      // Ease back to centre; `active` is cleared in tick once we arrive.
      target.current.x = 0;
      target.current.y = 0;
      leaving.current = true;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    const themeObserver = new MutationObserver(sync);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    };
  }, [host]);

  return (
    <>
      {host &&
        createPortal(
          <canvas ref={canvasRef} className="ascii-canvas" aria-hidden="true" />,
          host,
        )}
    </>
  );
}
