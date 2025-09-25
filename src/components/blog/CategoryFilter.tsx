"use client";

import { Text } from "@once-ui-system/core";
import type React from "react";
import styles from "./BlogFilters.module.css";

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
    <div className={styles.selectBlock}>
      <Text variant="label-strong-m">Filtrar por categoría</Text>
      <label htmlFor="category-select" className="sr-only">Categoría</label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value)}
        className={styles.select}
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
