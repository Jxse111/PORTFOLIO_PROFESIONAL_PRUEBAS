"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./BlogFilters.module.css";

export type CustomSelectOption = {
  value: string;
  label: string;
};

interface CustomSelectProps {
  id?: string;
  ariaLabel?: string;
  placeholder?: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (val: string) => void;
}

export function CustomSelect({
  id,
  ariaLabel,
  placeholder = "Seleccionar",
  value,
  options,
  onChange,
}: CustomSelectProps) {
  const internalId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const idx = options.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : 0;
  });

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("mousedown", handleGlobalClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handleGlobalClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    // Sync activeIndex when value changes externally
    const idx = options.findIndex((o) => o.value === value);
    if (idx >= 0) setActiveIndex(idx);
  }, [value, options]);

  useEffect(() => {
    if (!open) return;
    // Focus the selected option on open
    const li = listRef.current?.querySelector<HTMLLIElement>(
      `li[data-index='${activeIndex}']`
    );
    li?.focus();
  }, [open, activeIndex]);

  const selectByIndex = (idx: number) => {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDownOnList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectByIndex(activeIndex);
    }
  };

  const selected = options.find((o) => o.value === value);

  const listboxId = id || internalId;

  return (
    <div className={styles.customSelectRoot}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${listboxId}-listbox`}
        className={`${styles.select} ${styles.customSelectTrigger}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.buttonContent}>
          <span>{selected ? selected.label : placeholder}</span>
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
        <span className="sr-only">{ariaLabel || placeholder}</span>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${listboxId}-listbox`}
          role="listbox"
          aria-label={ariaLabel || placeholder}
          tabIndex={-1}
          className={styles.customSelectMenu}
          onKeyDown={handleKeyDownOnList}
        >
          {options.map((opt, idx) => {
            const selected = value === opt.value;
            return (
              <li
                key={opt.value}
                data-index={idx}
                role="option"
                aria-selected={selected}
                tabIndex={0}
                className={`${styles.customSelectOption} ${selected ? styles.customSelectOptionSelected : ""}`}
                onClick={() => selectByIndex(idx)}
                onKeyUp={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    selectByIndex(idx);
                  }
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
