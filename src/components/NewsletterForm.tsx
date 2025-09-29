"use client";

import { useState } from "react";
import { Column, Heading, Text, Row, Input, Button } from "@once-ui-system/core";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    // Validación básica del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Por favor, introduce un email válido.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Crear formulario y enviarlo
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://app.us22.list-manage.com/subscribe/post?u=2cba46fd901f6409b897c6afa&id=297b4122f5&f_id=0054c2e1f0';
      form.target = '_blank';
      form.style.display = 'none';

      // Email field
      const emailInput = document.createElement('input');
      emailInput.type = 'hidden';
      emailInput.name = 'EMAIL';
      emailInput.value = email;
      form.appendChild(emailInput);

      // Bot protection field
      const botInput = document.createElement('input');
      botInput.type = 'hidden';
      botInput.name = 'b_2cba46fd901f6409b897c6afa_297b4122f5';
      botInput.value = '';
      form.appendChild(botInput);

      // Submit the form
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      setMessage("¡Gracias por suscribirte! Serás redirigido a Mailchimp para confirmar tu suscripción.");
    } catch (error) {
      setMessage("Error al procesar la suscripción. Inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
    >
      <Column maxWidth="xs" horizontal="center">
        <Heading marginBottom="s" variant="display-strong-xs">
          Newsletter
        </Heading>
        <Text wrap="balance" marginBottom="l" variant="body-default-l" onBackground="neutral-weak">
          Suscríbete y recibe un correo cada vez que publique un nuevo post sobre desarrollo web y tecnología.
        </Text>
      </Column>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <Column gap="16">
          <div>
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <Row height="48" vertical="center">
            <Button
              type="submit"
              size="m"
              fillWidth
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? "Suscribiendo..." : "Suscribirse"}
            </Button>
          </Row>

          {message && (
            <Text
              variant="body-default-s"
              onBackground={message.includes("Error") ? "danger-strong" : "success-strong"}
              style={{ textAlign: "center" }}
            >
              {message}
            </Text>
          )}
        </Column>
      </form>
    </Column>
  );
}
