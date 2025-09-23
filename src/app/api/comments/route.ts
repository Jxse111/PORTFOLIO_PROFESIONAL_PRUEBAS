import type { NextApiRequest, NextApiResponse } from 'next';

interface CommentData {
  name: string;
  email: string;
  comment: string;
  postTitle: string;
  postSlug: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { name, email, comment, postTitle, postSlug }: CommentData = req.body;

    // Validar datos requeridos
    if (!name || !email || !comment || !postTitle) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar longitud del comentario
    if (comment.trim().length < 10) {
      return res.status(400).json({ error: 'El comentario debe tener al menos 10 caracteres' });
    }

    // Aquí puedes agregar la lógica para:
    // 1. Guardar el comentario en una base de datos
    // 2. Enviar un email usando un servicio como Nodemailer
    // 3. O cualquier otra lógica que necesites

    // Por ahora, solo vamos a simular el envío exitoso
    console.log('Nuevo comentario recibido:', {
      name,
      email,
      comment,
      postTitle,
      postSlug,
      timestamp: new Date().toISOString()
    });

    // Simular envío de email (reemplaza esto con tu lógica real)
    const emailContent = `
Nuevo comentario en: ${postTitle}

De: ${name} (${email})
Post: ${postTitle}
URL del post: /blog/${postSlug}

Comentario:
${comment}

---
Este comentario fue enviado desde tu portfolio profesional.
    `.trim();

    // Aquí iría la lógica real para enviar el email
    // Por ejemplo, usando Nodemailer, SendGrid, etc.

    return res.status(200).json({
      success: true,
      message: 'Comentario enviado exitosamente'
    });

  } catch (error) {
    console.error('Error al procesar comentario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
