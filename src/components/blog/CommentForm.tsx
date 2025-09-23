"use client";

import { useState } from "react";
import { Column, Row, Text, Button, Textarea, Input, Flex } from "@once-ui-system/core";

interface CommentFormProps {
  postTitle: string;
  postSlug: string;
}

export default function CommentForm({ postTitle, postSlug }: CommentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xeqyjwpj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          postTitle,
          postSlug,
          subject: `Nuevo comentario en: ${postTitle}`,
          _captcha: "false"
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", comment: "" });
      } else {
        throw new Error("Error al enviar el comentario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar el comentario. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Column fillWidth gap="16" padding="24" background="success-alpha-weak" radius="l" horizontal="center">
        <Text variant="heading-strong-m" onBackground="success-strong">
          ¡Comentario enviado!
        </Text>
        <Text variant="body-default-m" onBackground="success-medium">
          Gracias por tu comentario. Te responderé pronto a tu correo electrónico.
        </Text>
        <Button
          variant="secondary"
          size="s"
          onClick={() => setSubmitted(false)}
        >
          Enviar otro comentario
        </Button>
      </Column>
    );
  }

  return (
    <Column fillWidth gap="24" padding="24" background="neutral-alpha-weak" radius="l">
      <Text variant="heading-strong-l" marginBottom="16">
        Deja tu comentario
      </Text>

      <form onSubmit={handleSubmit}>
        <Column gap="16">
          <Row gap="16" s={{ direction: "column" }}>
            <Input
              id="comment-name"
              type="text"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <Input
              id="comment-email"
              type="email"
              placeholder="Tu correo electrónico"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              style={{ flex: 1 }}
            />
          </Row>

          <Textarea
            id="comment-text"
            placeholder="Escribe tu comentario aquí..."
            value={formData.comment}
            onChange={(e) => handleInputChange("comment", e.target.value)}
            required
            rows={6}
            resize="vertical"
          />

          <Flex horizontal="end" gap="12">
            <Button
              type="submit"
              variant="primary"
              size="m"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.comment}
            >
              {isSubmitting ? "Enviando..." : "Publicar comentario"}
            </Button>
          </Flex>
        </Column>
      </form>

      <Text variant="body-default-xs" onBackground="neutral-medium" style={{ textAlign: "center" }}>
        Tu comentario será enviado directamente a josemartinezestrada111@gmail.com
      </Text>
    </Column>
  );
}
