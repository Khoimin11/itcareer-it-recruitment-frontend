"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";

type Option = { value: string; label: string };

export const FilterSelect = ({ id, label, value, options, icon, onChange, name, variant = "filter" }: {
  id: string;
  label: string;
  value: string;
  options: Option[];
  icon?: ReactNode;
  name?: string;
  variant?: "filter" | "home";
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = Math.max(0, options.findIndex(option => option.value === value));
  const selected = options[selectedIndex];
  const listId = `${id}-options`;

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  useEffect(() => {
    if (open) containerRef.current?.querySelector<HTMLElement>(`[data-option-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const choose = (index: number) => {
    setOpen(false);
    onChange(options[index].value);
    buttonRef.current?.focus();
  };

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      if (event.key === "Escape" && open) event.preventDefault();
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(activeIndex);
      else { setActiveIndex(selectedIndex); setOpen(true); }
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        setActiveIndex(event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : selectedIndex);
        setOpen(true);
      } else {
        setActiveIndex(index => event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 :
          (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
      }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const start = open ? activeIndex : selectedIndex;
      const index = options.findIndex((_, offset) => options[(start + offset + 1) % options.length].label.toLocaleLowerCase("vi").startsWith(event.key.toLocaleLowerCase("vi")));
      if (index !== -1) { setActiveIndex((start + index + 1) % options.length); setOpen(true); }
    }
  };

  return (
    <div ref={containerRef} className="relative min-w-0" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      {name && <input type="hidden" name={name} value={value} />}
      <button ref={buttonRef} id={id} type="button" role="combobox" aria-label={`${label}: ${selected.label}`}
        aria-expanded={open} aria-haspopup="listbox" aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        onKeyDown={handleKey} onClick={() => { setActiveIndex(selectedIndex); setOpen(current => !current); }}
        className={`flex w-full items-center gap-3 border text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070d8] motion-reduce:transition-none ${variant === "home" ? "h-14 rounded-lg px-5 text-base font-medium" : "h-12 rounded-xl px-3.5 text-sm"} ${open ? "border-[#0070d8] bg-white ring-2 ring-blue-100" : variant === "home" ? "border-slate-200 bg-white text-slate-900 hover:border-blue-300" : value ? "border-blue-300 bg-blue-50 text-[#005eb8]" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"}`}>
        {icon && <span aria-hidden="true" className={`shrink-0 ${value || open ? "text-[#0070d8]" : "text-slate-400"}`}>{icon}</span>}
        <span className="flex-1 truncate">{selected.label}</span>
        <FaChevronDown aria-hidden="true" className={`shrink-0 text-[10px] text-slate-500 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <ul id={listId} role="listbox" aria-label={label}
        className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
        {options.map((option, index) => <li key={option.value} id={`${id}-option-${index}`} data-option-index={index}
          role="option" aria-selected={option.value === value}
          onMouseDown={event => event.preventDefault()} onMouseEnter={() => setActiveIndex(index)} onClick={() => choose(index)}
          className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-sm ${index === activeIndex ? "bg-blue-50 text-[#005eb8]" : "text-slate-700"} ${option.value === value ? "font-medium" : ""}`}>
          <span>{option.label}</span>{option.value === value && <FaCheck aria-hidden="true" className="shrink-0 text-xs text-[#0070d8]" />}
        </li>)}
      </ul>}
    </div>
  );
};
