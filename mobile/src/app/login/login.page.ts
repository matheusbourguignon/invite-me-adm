import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Importe o AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;  // Variável para controle de visibilidade da senha
  passwordInvalid: boolean = false;  // Controle de validação da senha
  showSuccessMessage: boolean = false;  // Variável para mostrar a mensagem de sucesso

  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Método para autenticação do usuário
   */
  async login() {
    if (this.email && this.password) {
      try {
        // Envia a requisição de login para o backend
        const response = await this.authService.login(this.email, this.password).toPromise();

        console.log('Login realizado com sucesso!', response);

        // Salva o token ou informações do usuário no localStorage, se necessário
        localStorage.setItem('userToken', response.token);  // Supondo que o token esteja na resposta

        // Exibe a mensagem de sucesso
        this.showSuccessMessage = true;

        // Redireciona para as tabs após o login
        this.router.navigate(['/tabs']);
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Verifique suas credenciais.');
        this.showSuccessMessage = false; // Caso ocorra erro, a mensagem de sucesso será desativada
      }
    }
  }

  /**
   * Método para login com o Google
   */
  async loginWithGoogle() {
    try {
      const response = await this.authService.loginWithGoogle().toPromise();
      
      console.log('Login com Google realizado com sucesso!', response);

      // Salva o token ou informações do usuário no localStorage, se necessário
      localStorage.setItem('userToken', response.token);

      // Exibe a mensagem de sucesso
      this.showSuccessMessage = true;

      // Redireciona para as tabs após o login
      this.router.navigate(['/tabs']);
    } catch (error) {
      console.error('Erro ao fazer login com o Google:', error);
      alert('Erro ao fazer login com o Google.');
      this.showSuccessMessage = false;
    }
  }
}
