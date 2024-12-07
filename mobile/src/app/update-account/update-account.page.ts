import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.page.html',
  styleUrls: ['./update-account.page.scss'],
})
export class UpdateAccountPage {
  updateAccountForm: FormGroup;
  showSuccessMessage: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController
  ) {
    this.updateAccountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.updateAccountForm.valid) {
      const formData = this.updateAccountForm.value;
      const userId = 'some-user-id'; // Aqui você vai passar o ID do usuário correto

      console.log('Sending data to backend:', { ...formData, userId });  // Log para verificar os dados

      this.authService.updateAccount({ ...formData, userId }).subscribe(
        (response) => {
          console.log('Account updated:', response);
          this.showSuccessMessage = true; // Exibe a mensagem de sucesso
          setTimeout(() => {
            this.navCtrl.navigateRoot('/profile'); // Navega para a página de perfil após a atualização
          }, 3000); // Espera 3 segundos para a navegação
        },
        (error) => {
          console.error('Error updating account:', error);
          alert(error.error.message || 'Failed to update account.');
        }
      );
    }
  }
}
