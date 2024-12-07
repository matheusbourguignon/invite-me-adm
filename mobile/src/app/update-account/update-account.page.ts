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
  passwordInvalid: boolean = false;

  // Propriedade para armazenar a imagem de perfil
  profilePicture: string | undefined;
  
  // Propriedade para controlar se o modal de imagem ampliada está aberto
  isZoomedImageModalOpen: boolean = false;

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
      password: ['', [Validators.minLength(6)]],
    });
  }

  // Método para atualizar a conta
  onSubmit() {
    if (this.updateAccountForm.valid) {
      this.authService.updateAccount(this.updateAccountForm.value).subscribe(
        (response) => {
          console.log('Account updated:', response);
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.navCtrl.navigateRoot('/profile');
          }, 3000);
        },
        (error) => {
          console.error('Error updating account:', error);
          alert(error.error.message || 'Failed to update account.');
        }
      );
    }
  }

  // Método para exibir/ocultar a senha
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Método para manipular a mudança da imagem de perfil
  handleImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result as string; // Atualiza a imagem de perfil
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para abrir o action sheet
  presentActionSheet() {
    // Implementação do action sheet para alterar a imagem de perfil
  }

  // Método para fechar o modal de imagem ampliada
  closeZoomedImage() {
    this.isZoomedImageModalOpen = false; // Fecha o modal de imagem ampliada
  }

  // Método para abrir o modal de imagem ampliada
  openZoomedImage() {
    this.isZoomedImageModalOpen = true; // Abre o modal de imagem ampliada
  }

   // Método de logout
   logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logged out:', response);
        // Redirecionar para a página de login após o logout
        this.navCtrl.navigateRoot('/login');
      },
      (error) => {
        console.error('Error logging out:', error);
        alert('Failed to log out.');
      }
    );
  }

}
