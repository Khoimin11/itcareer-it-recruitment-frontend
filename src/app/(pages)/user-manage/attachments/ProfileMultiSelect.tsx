"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";

export function ProfileMultiSelect({ id, label, value, options, disabled, onChange }: {
  id: string; label: string; value: string; options: string[]; disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = [...new Set(value.split(",").map(item => item.trim()).filter(Boolean))];
  // Existing values remain available even if they are absent from the suggestion list.
  const allOptions = [...new Set([...options, ...selected])];
  const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const filtered = allOptions.filter(option => normalize(option).includes(normalize(search.trim())));

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  const toggleOption = (option: string) => {
    onChange((selected.includes(option) ? selected.filter(item => item !== option) : [...selected, option]).join(", "));
  };

  return <div ref={rootRef} className="profile-multi" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (event.key === "Escape" && open) {
      event.preventDefault(); event.stopPropagation(); setOpen(false); triggerRef.current?.focus();
    }
  }}>
    <div className={`profile-multi-control ${open ? "is-open" : ""}`}>
      {selected.map(option => <span className="profile-multi-chip" key={option}>
        <span>{option}</span><button type="button" disabled={disabled} aria-label={`Bỏ chọn ${option}`} onClick={() => toggleOption(option)}><FiX aria-hidden="true" /></button>
      </span>)}
      <button ref={triggerRef} id={id} type="button" className="profile-multi-toggle" disabled={disabled}
        aria-label={`Chọn ${label.toLowerCase()}`} aria-expanded={open} aria-controls={open ? `${id}-options` : undefined}
        onClick={() => { setSearch(""); setOpen(current => !current); }}>
        <span>{selected.length ? "Chọn thêm" : "Chọn mục phù hợp"}</span><FiChevronDown aria-hidden="true" className={open ? "is-open" : ""} />
      </button>
    </div>
    {open && <div className="profile-multi-panel" id={`${id}-options`}>
      <div className="profile-multi-search"><FiSearch aria-hidden="true" /><input ref={searchRef} type="search" value={search}
        aria-label={`Tìm ${label.toLowerCase()}`} placeholder="Tìm nhanh…" onChange={event => setSearch(event.target.value)}
        onKeyDown={event => { if (event.key === "Enter") event.preventDefault(); }} /></div>
      <div className="profile-multi-options" role="group" aria-label={label}>
        {filtered.map(option => <label className={`profile-multi-option ${selected.includes(option) ? "is-selected" : ""}`} key={option}>
          <input type="checkbox" disabled={disabled} checked={selected.includes(option)} onChange={() => toggleOption(option)}
            onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); toggleOption(option); } }} /><span>{option}</span>
        </label>)}
        {!filtered.length && <p className="profile-multi-empty">Không tìm thấy lựa chọn phù hợp.</p>}
      </div>
    </div>}
  </div>;
}
