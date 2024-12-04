import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Importe seu AuthService

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage {
  name: string = '';
  email: string = '';
  birthDate: string = '';
  cellphone: string = '';
  password: string = '';

  showPassword: boolean = false; // Para mostrar/ocultar a senha

  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Cria uma nova conta com os dados fornecidos
   */
  createAccount(form: NgForm) {
    if (form.valid) {
      console.log('Conta criada com sucesso!', {
        name: this.name,
        email: this.email,
        birthDate: this.birthDate,
        cellphone: this.cellphone,
        password: this.password,
      });
      this.router.navigate(['/login']);
    }
  }

  /**
   * Cria uma nova conta usando a conta do Google
   */
  async createAccountWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle(); // Chame o método do AuthService
      console.log('Conta criada com Google!', user);
      this.router.navigate(['/login']); // Redirecione após o sucesso
    } catch (error) {
      console.error('Erro ao criar conta com Google:', error);
    }
  }

  // Método para alternar a visibilidade da senha
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Formata a data de nascimento para o formato DD/MM/AAAA
   */
  formatDate() {
    if (this.birthDate) {
      this.birthDate = this.birthDate.replace(/\D/g, '');
      if (this.birthDate.length > 8) {
        this.birthDate = this.birthDate.slice(0, 8);
      }
      this.birthDate = this.birthDate
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d{4})$/, '$1/$2');
    }
  }

  /**
   * Formata o celular para o formato (XX) XXXXX-XXXX
   */
  formatPhone() {
    if (this.cellphone) {
      this.cellphone = this.cellphone.replace(/\D/g, '');
      if (this.cellphone.length > 11) {
        this.cellphone = this.cellphone.slice(0, 11);
      }
      if (this.cellphone.length <= 10) {
        this.cellphone = this.cellphone
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      } else {
        this.cellphone = this.cellphone
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d{4})$/, '$1-$2');
      }
    }
  }
}
