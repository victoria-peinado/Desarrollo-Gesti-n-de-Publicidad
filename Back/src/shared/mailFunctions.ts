import { intlFormat } from 'date-fns';
import nodemailer from 'nodemailer';

// Función para enviar correos
export async function sendEmail(to: string[], subject: string, text: string, html?: string) {
        // Configurar el transporte SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER, // Tu email
                pass: process.env.EMAIL_PASS, // Tu contraseña o App Password (recomendado)
            },
        });

        // Opciones del correo
        const mailOptions = {
            from: 'brancattilautygoretti@gmail.com', // Dirección del remitente
            to, // Dirección del destinatario
            subject, // Asunto del correo
            text, // Cuerpo en texto plano
            html, // Cuerpo en HTML (opcional)
        };

        // Enviar el correo
        console.log('Estoy por enviar el mail.')
        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo enviado: ${info.messageId}`);
        return info
   
}


