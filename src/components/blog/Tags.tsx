import { Badge, Row, Text } from "@once-ui-system/core";
import Link from "next/link";

interface TagsProps {
  tags?: string[];
  className?: string;
}

export function Tags({ tags, className = "" }: TagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <Row wrap gap="8" className={className}>
      {tags.map((tag) => (
        <Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`} passHref>
          <Badge
            as="a"
            variant="outline"
            size="s"
            interactive
            hoverable
            color="primary"
            marginRight="8"
            marginBottom="8"
          >
            {tag}
          </Badge>
        </Link>
      ))}
    </Row>
  );
}
