import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.fromEmail =
      this.configService.get<string>('EMAIL_FROM') || 'noreply@pitanga.digital';
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  async sendVerificationEmail(
    email: string,
    name: string | null,
    token: string,
  ): Promise<boolean> {
    const verificationUrl = `${this.frontendUrl}/verify-email?token=${token}`;

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Verifique seu email - Pitanga',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Pitanga</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Olá${name ? `, ${name}` : ''}!</h2>
              <p>Obrigado por se cadastrar no Pitanga. Para completar seu registro, por favor verifique seu email clicando no botão abaixo:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verificar Email</a>
              </div>
              <p style="color: #666; font-size: 14px;">Se o botão não funcionar, copie e cole este link no seu navegador:</p>
              <p style="color: #666; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">Este link expira em 24 horas.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">Se você não criou uma conta no Pitanga, pode ignorar este email.</p>
            </div>
          </body>
          </html>
        `,
      });

      this.logger.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      return false;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    name: string | null,
    token: string,
  ): Promise<boolean> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Redefinir sua senha - Pitanga',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Pitanga</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Olá${name ? `, ${name}` : ''}!</h2>
              <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Redefinir Senha</a>
              </div>
              <p style="color: #666; font-size: 14px;">Se o botão não funcionar, copie e cole este link no seu navegador:</p>
              <p style="color: #666; font-size: 12px; word-break: break-all;">${resetUrl}</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">Este link expira em 1 hora.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">Se você não solicitou uma redefinição de senha, pode ignorar este email.</p>
            </div>
          </body>
          </html>
        `,
      });

      this.logger.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string | null): Promise<boolean> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Bem-vindo ao Pitanga!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Pitanga</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Bem-vindo${name ? `, ${name}` : ''}!</h2>
              <p>Sua conta foi verificada com sucesso. Você agora pode acessar todas as funcionalidades do Pitanga.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${this.frontendUrl}/dashboard" style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Acessar Dashboard</a>
              </div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">Obrigado por escolher o Pitanga!</p>
            </div>
          </body>
          </html>
        `,
      });

      this.logger.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error);
      return false;
    }
  }
}
