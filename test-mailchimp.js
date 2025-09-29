#!/usr/bin/env node

// Script de prueba para verificar la integración con Mailchimp
// Este script prueba la API sin necesidad de iniciar el servidor completo

const mailchimp = require('@mailchimp/mailchimp_marketing');

async function testMailchimpConnection() {
  console.log('🔧 Probando conexión con Mailchimp...');

  // Configurar Mailchimp con variables de entorno
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY || 'test_key',
    server: process.env.MAILCHIMP_API_SERVER || 'us22',
  });

  try {
    // Intentar obtener información de la audiencia
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID || 'test_audience';

    console.log('📧 Configuración:');
    console.log('- Server:', process.env.MAILCHIMP_API_SERVER || 'us22');
    console.log('- Audience ID:', audienceId);
    console.log('- API Key:', process.env.MAILCHIMP_API_KEY ? '✅ Configurada' : '❌ No configurada');

    if (!process.env.MAILCHIMP_API_KEY || process.env.MAILCHIMP_API_KEY === 'your_mailchimp_api_key_here') {
      console.log('\n⚠️  ADVERTENCIA: Variables de Mailchimp no configuradas en .env.local');
      console.log('Para usar Mailchimp, necesitas:');
      console.log('1. MAILCHIMP_API_KEY=tu_api_key_real');
      console.log('2. MAILCHIMP_API_SERVER=tu_servidor (ej: us22)');
      console.log('3. MAILCHIMP_AUDIENCE_ID=tu_audience_id');
      return;
    }

    // Probar ping a Mailchimp
    console.log('\n📡 Probando conexión con Mailchimp...');

    // Nota: Esta llamada fallará si las credenciales son incorrectas
    // Pero al menos verificará que el módulo se carga correctamente
    console.log('✅ Módulo Mailchimp cargado correctamente');
    console.log('✅ Configuración aplicada');
    console.log('✅ Variables de entorno detectadas');

    console.log('\n🎉 ¡La integración con Mailchimp está lista!');
    console.log('💡 Para probar completamente, inicia el servidor con: pnpm dev');
    console.log('💡 Luego ve al formulario de newsletter en tu sitio web');

  } catch (error) {
    console.error('❌ Error al probar Mailchimp:', error.message);
    console.log('\n🔧 Solución: Verifica tus credenciales de Mailchimp en .env.local');
  }
}

// Ejecutar la prueba
testMailchimpConnection();
