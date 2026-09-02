"use client";

import { LayoutGrid, X } from "lucide-react";
import { OptionWheel } from "./option-wheel";
import { useNavOptionWheel } from "../hooks/use-nav-option-wheel";

export function NavOptionWheel() {
  const {
    isMounted,
    items,
    open,
    close,
    handleSelect,
    overlayRef,
    backdropRef,
    contentRef,
    opensFromRight,
    wheelSide,
    labels,
  } = useNavOptionWheel();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-expanded={isMounted}
        aria-controls="nav-option-wheel-panel"
        aria-label={labels.openMenu}
        className="fixed end-4 top-4 z-50 hidden size-15 cursor-pointer items-center justify-center rounded-full border border-border bg-card/80 text-primary shadow-lg backdrop-blur-md transition-colors duration-200 hover:bg-card hover:text-foreground lg:flex"
      >
        <LayoutGrid className="size-5" aria-hidden />
      </button>

      {isMounted ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-60 hidden lg:block"
          role="presentation"
        >
          <button
            ref={backdropRef}
            type="button"
            aria-label={labels.closeMenu}
            className="absolute inset-0 cursor-default bg-background/15 backdrop-blur-xl"
            onClick={close}
          />

          <div
            id="nav-option-wheel-panel"
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-label={labels.wheelLabel}
            dir="ltr"
            className={`pointer-events-none absolute inset-y-0 w-full max-w-4xl ${opensFromRight ? "end-0" : "start-0"}`}
            onWheel={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label={labels.closeMenu}
              className={`pointer-events-auto absolute top-6 z-10 flex size-10 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground ${opensFromRight ? "end-6" : "start-6"}`}
            >
              <X className="size-5" aria-hidden />
            </button>

            <div className="pointer-events-auto h-full">
              <OptionWheel
                items={items}
                defaultSelected={0}
                onSelect={handleSelect}
                textColor="#5a8a7a"
                activeColor="#89d7b7"
                side={wheelSide}
                fontSize={8}
                spacing={1.35}
                curve={1}
                tilt={9}
                blur={1.5}
                fade={0.22}
                smoothing={220}
                inset={56}
                loop={false}
                draggable
                ariaLabel={labels.wheelLabel}
                className="font-(family-name:--font-sans)!"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
