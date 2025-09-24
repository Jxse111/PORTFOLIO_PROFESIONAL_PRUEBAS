"use client";

import { Text } from "@once-ui-system/core";
import React from "react";

interface TimeFilterProps {
  selectedTimeFilter: string;
  onTimeFilterChange: (filter: string) => void;
}

export function TimeFilter({
  selectedTimeFilter,
  onTimeFilterChange,
}: TimeFilterProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 200 }}>
      <Text variant="label-strong-m">Ordenar por</Text>
      <label htmlFor="time-select" className="sr-only">Orden</label>
      <select
        id="time-select"
        value={selectedTimeFilter}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onTimeFilterChange(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--color-neutral-alpha-weak)",
          background: "var(--color-background)",
          color: "var(--color-on-background)",
        }}
      >
        <option value="newest">Más recientes</option>
        <option value="oldest">Más antiguos</option>
        <option value="last-updated">Última actualización</option>
      </select>
    </div>
  );
}
