# Configuración de Mailchimp para Newsletter

## Variables de Entorno Requeridas

Para que la integración con Mailchimp funcione correctamente, necesitas configurar las siguientes variables en tu archivo `.env.local`:

```env
# Mailchimp API Configuration
MAILCHIMP_API_KEY=tu_api_key_real_de_mailchimp
MAILCHIMP_API_SERVER=us22  # O el servidor correcto de tu cuenta
MAILCHIMP_AUDIENCE_ID=tu_audience_id_real
```

## Cómo obtener las credenciales de Mailchimp

### 1. API Key
1. Ve a tu cuenta de Mailchimp
2. Navega a **Account > Extras > API keys**
3. Crea una nueva API key o usa una existente
4. Copia la key completa

### 2. Server Prefix
El servidor se encuentra al final de tu API key. Por ejemplo:
- Si tu API key termina en `-us22`, entonces `MAILCHIMP_API_SERVER=us22`
- Otros valores comunes: `us1`, `us18`, `us20`, etc.

### 3. Audience ID
1. Ve a **Audience > All contacts**
2. Selecciona **Settings > Audience name and defaults**
3. Copia el **Audience ID**

## Cómo funciona la integración

1. **NewsletterForm.tsx**: Componente de formulario que captura el email del usuario
2. **API Route** (`/api/newsletter/subscribe`): Envía el email a Mailchimp usando la API oficial
3. **Mailchimp**: Agrega el suscriptor a tu audiencia

## Notas importantes

- La integración usa el paquete oficial `@mailchimp/mailchimp_marketing`
- Los emails duplicados son manejados correctamente (no generan error)
- El sistema tiene manejo de errores robusto
- Los usuarios reciben feedback visual del estado de la suscripción
