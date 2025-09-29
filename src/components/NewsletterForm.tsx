"use client";

import { useState } from "react";
import { Column, Heading, Text, Row, Button } from "@once-ui-system/core";

export default function NewsletterForm() {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
  };

  if (showForm) {
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
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <link href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" rel="stylesheet" type="text/css">
              <style type="text/css">
                #mc_embed_signup{background:transparent; clear:left; font:14px Helvetica,Arial,sans-serif; width:100%; max-width:600px;}
                #mc_embed_signup h2 {color: var(--neutral-on-background-strong); margin-bottom: 16px;}
                #mc_embed_signup input[type="email"] {background: var(--surface-background); border: 1px solid var(--neutral-border-medium); color: var(--neutral-on-background-strong); padding: 12px; border-radius: 8px; width: 100%; margin-bottom: 16px;}
                #mc_embed_signup input[type="submit"] {background: var(--brand-background-strong); color: var(--brand-on-background-strong); border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;}
                #mc_embed_signup input[type="submit"]:hover {background: var(--brand-background-medium);}
                .response {margin-top: 16px; padding: 12px; border-radius: 8px;}
                #mce-success-response {background: var(--success-background-weak); color: var(--success-on-background-strong); border: 1px solid var(--success-border-medium);}
                #mce-error-response {background: var(--danger-background-weak); color: var(--danger-on-background-strong); border: 1px solid var(--danger-border-medium);}
              </style>
              <div id="mc_embed_signup">
                <form action="https://app.us22.list-manage.com/subscribe/post?u=2cba46fd901f6409b897c6afa&amp;id=297b4122f5&amp;f_id=0054c2e1f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank">
                  <div id="mc_embed_signup_scroll">
                    <div class="mc-field-group">
                      <label for="mce-EMAIL">Email Address <span style="color: var(--danger-on-background-strong)">*</span></label>
                      <input type="email" name="EMAIL" class="required email" id="mce-EMAIL" required placeholder="tucorreo@ejemplo.com">
                    </div>
                    <div id="mce-responses" class="clear foot">
                      <div class="response" id="mce-error-response" style="display: none;"></div>
                      <div class="response" id="mce-success-response" style="display: none;"></div>
                    </div>
                    <div style="position: absolute; left: -5000px;" aria-hidden="true">
                      <input type="text" name="b_2cba46fd901f6409b897c6afa_297b4122f5" tabindex="-1" value="">
                    </div>
                    <div class="optionalParent">
                      <div class="clear foot">
                        <input type="submit" name="subscribe" id="mc-embedded-subscribe" class="button" value="Suscribirse">
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            `
          }}
        />
      </Column>
    );
  }

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
      <Row height="48" vertical="center">
        <Button size="m" fillWidth onClick={handleShowForm}>
          Ver formulario de suscripción
        </Button>
      </Row>
    </Column>
  );
}
