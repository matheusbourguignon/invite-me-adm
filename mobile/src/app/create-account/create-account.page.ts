import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage {
  createAccountForm: FormGroup;
  showSuccessMessage: boolean = false; // Variável para controlar a exibição da mensagem de sucesso
  showPassword: boolean = false; // Controle para mostrar/ocultar senha
  passwordInvalid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController
  ) {
    this.createAccountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.createAccountForm.valid) {
      this.authService.createAccount(this.createAccountForm.value).subscribe(
        (response) => {
          console.log('Account created:', response);
          this.showSuccessMessage = true; // Exibe a mensagem de sucesso
          setTimeout(() => {
            this.navCtrl.navigateRoot('/login'); // Navega para a página de login após o cadastro
          }, 3000); // Espera 3 segundos para a navegação
        },
        (error) => {
          console.error('Error creating account:', error);
          alert(error.error.message || 'Failed to create account.');
        }
      );
    }
  }
}
