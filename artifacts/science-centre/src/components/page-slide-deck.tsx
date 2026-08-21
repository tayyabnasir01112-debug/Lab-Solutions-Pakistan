import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.68, ease: [0.76, 0, 0.24, 1] },
  },
  exit: (dir: number) => ({
    y: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.68, ease: [0.76, 0, 0.24, 1] },
  }),
};

export function PageSlideDeck({
  sections,
  children,
  names,
  accent = "hsl(var(--primary))",
  onCurrentChange,
}: {
  sections?: React.ReactNode[];
  children?: React.ReactNode;
  names: string[];
  accent?: string;
  onCurrentChange?: (current: number) => void;
}) {
  const slideItems = sections ?? React.Children.toArray(children);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const cooldown = useRef(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100dvh";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  const goTo = (index: number) => {
    if (cooldown.current || index === current || index < 0 || index >= slideItems.length) return;
    cooldown.current = true;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    window.setTimeout(() => {
      cooldown.current = false;
    }, 780);
  };

  useEffect(() => {
    slideRefs.current[current]?.scrollTo({ top: 0, behavior: "instant" });
    onCurrentChange?.(current);
  }, [current, onCurrentChange]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const active = slideRefs.current[current];
      if (!active || Math.abs(e.deltaY) < 20) return;

      const canScrollDown = active.scrollTop + active.clientHeight < active.scrollHeight - 8;
      const canScrollUp = active.scrollTop > 8;
      if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) return;

      e.preventDefault();
      goTo(e.deltaY > 0 ? current + 1 : current - 1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(current + 1);
      }
      if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(current - 1);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [current, slideItems.length]);

  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 65) return;
      goTo(diff > 0 ? current + 1 : current - 1);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [current, slideItems.length]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background">
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <div
            ref={node => {
              slideRefs.current[current] = node;
            }}
            className="h-[100dvh] overflow-y-auto overscroll-contain"
          >
            {slideItems[current]}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none fixed bottom-4 left-6 z-40 hidden md:block">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {String(current + 1).padStart(2, "0")} / {String(slideItems.length).padStart(2, "0")} - {names[current]}
        </span>
      </div>

      <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {slideItems.map((_, index) => (
          <button key={index} onClick={() => goTo(index)} className="group flex items-center justify-end gap-2" title={names[index]}>
            <span className="border border-border bg-background/95 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              {names[index]}
            </span>
            <motion.span
              className="rounded-full"
              animate={{
                width: index === current ? 10 : 5,
                height: index === current ? 10 : 5,
                backgroundColor: index === current ? accent : "hsl(var(--border))",
                boxShadow: index === current ? `0 0 10px ${accent}80` : "none",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
