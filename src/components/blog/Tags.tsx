import { Row } from "@once-ui-system/core";
import Link from "next/link";
import type { CSSProperties } from 'react';

interface TagsProps {
  tags?: string[];
  className?: string;
}

const tagStyle: CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '16px',
  border: '1px solid',
  borderColor: 'var(--color-primary-500)',
  backgroundColor: 'transparent',
  color: 'var(--color-primary-500)',
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginRight: '8px',
  marginBottom: '8px',
};

const tagHoverStyle: CSSProperties = {
  backgroundColor: 'var(--color-primary-50)',
  transform: 'translateY(-1px)',
};

export function Tags({ tags, className = "" }: TagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <Row wrap gap="8" className={className}>
      {tags.map((tag) => (
        <Link 
          key={tag} 
          href={`/blog/tag/${tag.toLowerCase()}`} 
          style={tagStyle}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, tagHoverStyle);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, tagStyle);
          }}
        >
          {tag}
        </Link>
      ))}
    </Row>
  );
}
