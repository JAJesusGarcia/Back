import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { to, subject, text } = req.body;

    const mailOptions = {
      from: 'info@synergy2devs.com',
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error detallado al enviar email:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

//CONTROLADORES OK !! 