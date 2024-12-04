import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';
  emailInvalid: boolean = false;
  emailSent: boolean = false;

  constructor(private router: Router) {}

  resetPassword() {
    if (!this.email || !this.validateEmail(this.email)) {
      this.emailInvalid = true;
      return;
    }

    // Simulação de envio do e-mail de redefinição de senha
    console.log('Solicitação de redefinição de senha enviada para:', this.email);

    this.emailSent = true;

    // Após um tempo (por exemplo, 2 segundos), redirecionar para a página de login
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000); // 2 segundos de delay antes de redirecionar
  }

  // Validação simples de email
  validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
