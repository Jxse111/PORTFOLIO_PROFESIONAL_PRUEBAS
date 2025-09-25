"use client";

import { Text } from "@once-ui-system/core";
import type React from "react";
import styles from "./BlogFilters.module.css";
import { CustomSelect } from "./CustomSelect";

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
      <CustomSelect
        id="category-select"
        ariaLabel="Categoría"
        placeholder="Todas las categorías"
        value={selectedCategory}
        options={[{ value: "", label: "Todas las categorías" }, ...categories.map((c) => ({ value: c, label: c }))]}
        onChange={onCategoryChange}
      />
    </div>
  );
}
