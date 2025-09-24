"use client";

<<<<<<< HEAD
import { Text } from "@once-ui-system/core";
import type React from "react";
=======
import { Flex, Text, Select } from "@once-ui-system/core";
>>>>>>> cc35403ae83f6032b76c6ee0806d77f6ace1eadb

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
<<<<<<< HEAD
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 200 }}>
      <Text variant="label-strong-m">Filtrar por categoría</Text>
      <label htmlFor="category-select" className="sr-only">Categoría</label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--color-neutral-alpha-weak)",
          background: "var(--color-background)",
          color: "var(--color-on-background)",
        }}
=======
    <Flex direction="column" gap="8">
      <Text variant="label-strong-m">Filtrar por categoría:</Text>
      <Select
        label="Categoría"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        size="m"
>>>>>>> cc35403ae83f6032b76c6ee0806d77f6ace1eadb
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
<<<<<<< HEAD
      </select>
    </div>
=======
      </Select>
    </Flex>
>>>>>>> cc35403ae83f6032b76c6ee0806d77f6ace1eadb
  );
}
