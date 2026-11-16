"use client";

import {
  LazyMotion,
  m,
  MotionConfig,
  useReducedMotion,
  useScroll,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";

const loadFeatures = () =>
  import("./motion-features").then((module) => module.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [layoutFeatures, setLayoutFeatures] = useState<
    typeof import("motion/react").domMax | null
  >(null);
  useEffect(() => {
    // Layout projection is only needed once a visitor interacts with the page.
    // Keep its measuring and hydration work out of the initial reading experience.
    let alive = true;
    const loadLayout = () => {
      document.removeEventListener("pointerdown", loadLayout);
      document.removeEventListener("keydown", loadLayout);
      void import("./layout-features").then((module) => {
        if (alive) setLayoutFeatures(module.default);
      });
    };
    document.addEventListener("pointerdown", loadLayout, { passive: true });
    document.addEventListener("keydown", loadLayout);
    return () => {
      alive = false;
      document.removeEventListener("pointerdown", loadLayout);
      document.removeEventListener("keydown", loadLayout);
    };
  }, []);
  return (
    <LazyMotion features={layoutFeatures || loadFeatures} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

export function Reveal({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      id={id}
      className={`reveal ${className}`}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </m.div>
  );
}

export function Trail() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  return (
    <div className="evidence-trail" aria-hidden="true">
      <svg
        width="1"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 1 100"
      >
        <path d="M.5 0V100" className="trail-base" />
        <m.path
          d="M.5 0V100"
          className="trail-progress"
          style={{ pathLength: reduced ? 1 : scrollYProgress }}
        />
      </svg>
    </div>
  );
}

export function MagneticLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  function move(event: MouseEvent<HTMLAnchorElement>) {
    if (reduced || !matchMedia("(pointer: fine)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.transform = `translate(${Math.max(-8, Math.min(8, (event.clientX - box.left - box.width / 2) * 0.09))}px, ${Math.max(-8, Math.min(8, (event.clientY - box.top - box.height / 2) * 0.15))}px)`;
  }
  return (
    <a
      ref={ref}
      href={href}
      className="button-primary"
      onMouseMove={move}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </a>
  );
}

export function Tilt({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <div
      className="portrait-tilt"
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.transform = `perspective(800px) rotateY(${(event.clientX - box.left - box.width / 2) / 35}deg) rotateX(${-(event.clientY - box.top - box.height / 2) / 35}deg)`;
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}

export function Verified() {
  const reduced = useReducedMotion();
  return (
    <m.span
      className="verified"
      title="The end of the evidence trail"
      initial={reduced ? false : { opacity: 0, rotate: -12, scale: 1.15 }}
      whileInView={{ opacity: 1, rotate: -5, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <span aria-hidden="true">✓</span> Verified
    </m.span>
  );
}
