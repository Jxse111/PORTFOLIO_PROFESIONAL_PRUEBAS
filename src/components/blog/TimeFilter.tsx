"use client";

import { Text } from "@once-ui-system/core";
import type React from "react";
import styles from "./BlogFilters.module.css";

interface TimeFilterProps {
  selectedTimeFilter: string;
  onTimeFilterChange: (filter: string) => void;
}

export function TimeFilter({
  selectedTimeFilter,
  onTimeFilterChange,
}: TimeFilterProps) {
  return (
    <div className={styles.selectBlock}>
      <Text variant="label-strong-m">Ordenar por</Text>
      <label htmlFor="time-select" className="sr-only">Orden</label>
      <select
        id="time-select"
        value={selectedTimeFilter}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onTimeFilterChange(e.target.value)}
        className={styles.select}
      >
        <option value="newest">Más recientes</option>
        <option value="oldest">Más antiguos</option>
        <option value="last-updated">Última actualización</option>
      </select>
    </div>
  );
}
