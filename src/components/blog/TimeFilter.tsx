"use client";

import { Flex, Text, Select } from "@once-ui-system/core";

interface TimeFilterProps {
  selectedTimeFilter: string;
  onTimeFilterChange: (timeFilter: string) => void;
}

export function TimeFilter({
  selectedTimeFilter,
  onTimeFilterChange,
}: TimeFilterProps) {
  return (
    <Flex direction="column" gap="8">
      <Text variant="label-strong-m">Ordenar por:</Text>
      <Select
        label="Orden"
        value={selectedTimeFilter}
        onChange={(e) => onTimeFilterChange(e.target.value)}
        size="m"
      >
        <option value="newest">Más recientes</option>
        <option value="oldest">Más antiguos</option>
        <option value="last-updated">Última actualización</option>
      </Select>
    </Flex>
  );
}
