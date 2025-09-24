"use client";

import { Flex, Text, Select } from "@once-ui-system/core";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <Flex direction="column" gap="8">
      <Text variant="label-strong-m">Filtrar por categoría:</Text>
      <Select
        label="Categoría"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        size="m"
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
    </Flex>
  );
}
