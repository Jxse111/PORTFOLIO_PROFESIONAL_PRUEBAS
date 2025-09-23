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
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'El comentario es requerido';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'El comentario debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica del lado del cliente
    if (!formData.name.trim() || !formData.email.trim() || !formData.comment.trim()) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Por favor, ingresa un email válido.');
      return;
    }

    if (formData.comment.trim().length < 10) {
      alert('El comentario debe tener al menos 10 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xeqyjwpj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          comment: formData.comment,
          postTitle,
          postSlug,
          subject: `Nuevo comentario en: ${postTitle}`,
          _next: typeof window !== 'undefined' ? window.location.href : '',
          _redirect: false
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', comment: '' });
        setErrors({});
      } else {
        throw new Error(data.error || 'Error al enviar el comentario');
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      alert(`Error al enviar el comentario: ${error instanceof Error ? error.message : 'Error desconocido'}. Por favor, inténtalo de nuevo.`);
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
            <Column gap="4">
              <Input
                id="comment-name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                style={{ flex: 1 }}
              />
              {errors.name && (
                <Text variant="body-default-xs" style={{ color: 'var(--color-danger)' }}>
                  {errors.name}
                </Text>
              )}
            </Column>
            <Column gap="4">
              <Input
                id="comment-email"
                name="email"
                type="email"
                placeholder="Tu correo electrónico"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                style={{ flex: 1 }}
              />
              {errors.email && (
                <Text variant="body-default-xs" style={{ color: 'var(--color-danger)' }}>
                  {errors.email}
                </Text>
              )}
            </Column>
          </Row>

          <Column gap="4">
            <Textarea
              id="comment-text"
              name="comment"
              placeholder="Escribe tu comentario aquí..."
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              required
              rows={6}
              resize="vertical"
            />
            {errors.comment && (
              <Text variant="body-default-xs" style={{ color: 'var(--color-danger)' }}>
                {errors.comment}
              </Text>
            )}
          </Column>

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
