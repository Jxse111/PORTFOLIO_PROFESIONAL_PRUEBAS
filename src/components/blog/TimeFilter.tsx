"use client";

<<<<<<< HEAD
import { Text } from "@once-ui-system/core";
import React from "react";

interface TimeFilterProps {
  selectedTimeFilter: string;
  onTimeFilterChange: (filter: string) => void;
=======
import { Flex, Text, Select } from "@once-ui-system/core";

interface TimeFilterProps {
  selectedTimeFilter: string;
  onTimeFilterChange: (timeFilter: string) => void;
>>>>>>> cc35403ae83f6032b76c6ee0806d77f6ace1eadb
}

export function TimeFilter({
  selectedTimeFilter,
  onTimeFilterChange,
}: TimeFilterProps) {
  return (
<<<<<<< HEAD
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
=======
    <Flex direction="column" gap="8">
      <Text variant="label-strong-m">Ordenar por:</Text>
      <Select
        label="Orden"
        value={selectedTimeFilter}
        onChange={(e) => onTimeFilterChange(e.target.value)}
        size="m"
>>>>>>> cc35403ae83f6032b76c6ee0806d77f6ace1eadb
      >
        <option value="newest">Más recientes</option>
        <option value="oldest">Más antiguos</option>
        <option value="last-updated">Última actualización</option>
<<<<<<< HEAD
      </select>
    </div>
=======
      </Select>
    </Flex>
>>>>>>> cc35403ae83f6032b76c6ee0806d77f6ace1eadb
  );
}
