"use client";

import { useState } from "react";
import { Column, Heading, Text, Row, Input, Button } from "@once-ui-system/core";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicated" | "error">("idle");
  const [message, setMessage] = useState("");

  const getMessageColor = () => {
    switch (status) {
      case "success":
      case "duplicated":
        return "success-strong";
      case "error":
        return "danger-strong";
      default:
        return "neutral-weak";
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setError("Introduce un correo válido.");
      return;
    }
    setError("");
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Error al suscribirse");
      }
      if (data.duplicated) {
        setStatus("duplicated");
        setMessage("Ya estabas suscrito a la newsletter.");
      } else {
        setStatus("success");
        setMessage("¡Suscripción realizada con éxito! 🎉");
      }
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Ha ocurrido un error. Verifica tu conexión e inténtalo de nuevo.");
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
      <form onSubmit={onSubmit}>
        <Row id="newsletter_form" fillWidth maxWidth={24} s={{ direction: "column" }} gap="8" horizontal="center">
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorMessage={error}
            disabled={status === "loading"}
          />
          <Row height="48" vertical="center">
            <Button
              type="submit"
              size="m"
              fillWidth
              disabled={status === "loading" || !email.trim()}
            >
              {status === "loading" ? "Suscribiendo..." : "Suscribirse"}
            </Button>
          </Row>
          {message && (
            <Text
              variant="body-default-s"
              onBackground={getMessageColor()}
              style={{ textAlign: "center" }}
            >
              {message}
            </Text>
          )}
        </Row>
      </form>
    </Column>
  );
}
