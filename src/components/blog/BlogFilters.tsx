"use client";

import { Flex, Text, Button } from "@once-ui-system/core";

interface BlogFiltersProps {
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

export function BlogFilters({
  allTags,
  selectedTags,
  onTagToggle,
  onClearFilters,
}: BlogFiltersProps) {
  if (allTags.length === 0) return null;

  return (
    <Flex direction="column" gap="16" marginBottom="24">
      <Flex gap="8" wrap>
        <Text variant="label-strong-m">Filtrar por etiquetas:</Text>
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? "primary" : "secondary"}
            onClick={() => onTagToggle(tag)}
            size="s"
            style={{ 
              cursor: "pointer",
              borderRadius: '9999px',
              padding: '4px 12px',
              fontSize: '0.75rem',
              lineHeight: '1rem',
              fontWeight: selectedTags.includes(tag) ? '600' : '400',
              backgroundColor: selectedTags.includes(tag) 
                ? 'var(--color-primary)' 
                : 'var(--color-neutral-weak)',
              color: selectedTags.includes(tag) 
                ? 'var(--color-on-primary)' 
                : 'var(--color-on-background)'
            }}
          >
            {tag}
          </Button>
        ))}
      </Flex>
      {selectedTags.length > 0 && (
        <Flex gap="8" align="center">
          <Text variant="body-default-xs">
            Filtros activos: {selectedTags.join(", ")}
          </Text>
          <Button
            size="s"
            variant="tertiary"
            onClick={onClearFilters}
            style={{ 
              padding: '4px 12px',
              fontSize: '0.75rem',
              lineHeight: '1rem'
            }}
          >
            Limpiar filtros
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
