"use client";

import { Text } from "@once-ui-system/core";
import type React from "react";
import styles from "./BlogFilters.module.css";
import { CustomSelect } from "./CustomSelect";

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
      <CustomSelect
        id="time-select"
        ariaLabel="Orden"
        placeholder="Más recientes"
        value={selectedTimeFilter}
        options={[
          { value: "newest", label: "Más recientes" },
          { value: "oldest", label: "Más antiguos" },
          { value: "last-updated", label: "Última actualización" },
        ]}
        onChange={onTimeFilterChange}
      />
    </div>
  );
}
