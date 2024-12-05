import { Component } from '@angular/core';
import { NavController } from '@ionic/angular'; // Se você estiver usando NavController para navegação
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = ''; // Inicializa como string vazia
  password: string = ''; // Inicializa como string vazia
  emailInvalid: boolean = false;
  passwordInvalid: boolean = false;
  showPassword: boolean = false; // Adiciona a propriedade showPassword

  constructor(private authService: AuthService, private navCtrl: NavController) {}

  login() {
    this.emailInvalid = false;
    this.passwordInvalid = false;
  
    // Validação do email e senha
    if (!this.validateEmail(this.email)) {
      this.emailInvalid = true;
    }
  
    if (!this.validatePassword(this.password)) {
      this.passwordInvalid = true;
    }
  
    if (this.emailInvalid || this.passwordInvalid) {
      return;
    }
  
    // Chama o serviço de autenticação com email e senha
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido', response);
        // Redireciona para a página principal
        this.navCtrl.navigateRoot('/tabs');
      },
      error: (error) => {
        console.error('Erro ao fazer login', error);
        // Verificar se o erro é uma instância de Error
        if (error instanceof Error) {
          alert('Erro ao fazer login: ' + error.message);
        } else {
          alert('Erro desconhecido ao fazer login');
        }
      }
    });
  }

  // Método para login com Google
  async loginWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle().toPromise();
      console.log('Login com Google bem-sucedido', user);

      // Navega para a página inicial após o login com Google
      this.navCtrl.navigateRoot('/tabs');
    } catch (error) {
      console.error('Erro ao fazer login com Google', error);
      // Verificar se o erro é uma instância de Error
      if (error instanceof Error) {
        alert('Erro ao fazer login com Google: ' + error.message);
      } else {
        alert('Erro desconhecido ao fazer login com Google');
      }
    }
  }

  // Funções de validação
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    return password.length >= 6;
  }
}
