"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { CustomerTile } from "@/components/sections/customer-tile";
import { cn } from "@/lib/utils";
import type { Customer } from "../../../../content/schemas";

const PIXELS_PER_SECOND = 40;

/**
 * Auto-scrolling logo strip, moved by translating the track directly rather
 * than native scrollLeft — that way it always visibly moves regardless of
 * whether the duplicated content happens to overflow the viewport (a
 * scrollLeft-based approach can't move at all once it doesn't overflow).
 * The tile list renders twice back to back; "period" is the pixel distance
 * from the start of the first copy to the start of the second — once the
 * offset passes one period it wraps, so movement loops seamlessly in both
 * directions. A visitor can grab-and-drag (mouse/touch) or use the wheel to
 * move it manually; auto-scroll pauses on hover/focus and while dragging.
 */
export function CustomerMarquee({ customers }: { customers: Customer[] }) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const periodRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const applyTransform = () => {
    const track = trackRef.current;
    if (track) track.style.transform = `translateX(-${offsetRef.current}px)`;
  };

  const wrapOffset = () => {
    const period = periodRef.current;
    if (period <= 0) return;
    offsetRef.current = ((offsetRef.current % period) + period) % period;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const [firstSet, secondSet] = Array.from(track.children) as HTMLElement[];
    if (!firstSet || !secondSet) return;

    const measure = () => {
      periodRef.current = secondSet.offsetLeft - firstSet.offsetLeft;
    };
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    return () => resizeObserver.disconnect();
  }, [customers]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let frameId: number;
    let lastTime: number | null = null;

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      if (!pausedRef.current && !draggingRef.current) {
        offsetRef.current += (PIXELS_PER_SECOND * delta) / 1000;
        wrapOffset();
        applyTransform();
      }
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      offsetRef.current += delta;
      wrapOffset();
      applyTransform();
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [shouldReduceMotion]);

  if (customers.length === 0) return null;

  if (shouldReduceMotion) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        {customers.map((customer) => (
          <CustomerTile key={customer.slug} customer={customer} />
        ))}
      </div>
    );
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    const delta = dragStartXRef.current - e.clientX;
    offsetRef.current = dragStartOffsetRef.current + delta;
    wrapOffset();
    applyTransform();
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      aria-label="Customer logos, drag or scroll to browse"
      className={cn(
        "overflow-hidden [touch-action:pan-y]",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={trackRef} className="flex w-max items-center gap-4 select-none">
        {[0, 1].map((setIndex) => (
          <div
            key={setIndex}
            aria-hidden={setIndex === 1}
            className="flex shrink-0 items-center gap-4"
          >
            {customers.map((customer) => (
              <CustomerTile key={customer.slug} customer={customer} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
