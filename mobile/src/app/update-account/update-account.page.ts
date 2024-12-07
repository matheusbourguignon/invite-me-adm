import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.page.html',
  styleUrls: ['./update-account.page.scss'],
})
export class UpdateAccountPage implements OnInit {

  profilePicture: string | undefined;
  name: string | undefined;
  cellphone: string | undefined;
  email: string | undefined;
  birthDate: string | undefined;
  isZoomedImageModalOpen = false;
  isDataUpdated = false;
  isErrorOccurred = false;

  constructor(
    private actionSheetController: ActionSheetController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    // Carrega os dados do localStorage, se disponíveis
    const storedName = localStorage.getItem('userFullName'); // O nome completo é carregado aqui
    const storedEmail = localStorage.getItem('userEmail');
    const storedProfilePicture = localStorage.getItem('userProfilePicture');
    const storedCellphone = localStorage.getItem('userCellphone');
    const storedBirthDate = localStorage.getItem('userBirthDate');
    
    // Se os dados estiverem no localStorage, carrega-os
    this.name = storedName || '';  // Aqui estamos definindo 'name' com o nome completo
    this.email = storedEmail || '';
    this.profilePicture = storedProfilePicture || '';
    this.cellphone = storedCellphone || '';
    this.birthDate = storedBirthDate || '';
    
    // Formata a data de nascimento e telefone
    this.formatDate();
    this.formatPhone();
  }
  
  

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opções de Imagem',
      buttons: [
        {
          text: 'Alterar Foto',
          handler: () => this.selectNewProfilePicture(),
        },
        {
          text: 'Imagem',
          handler: () => this.showZoomedImage(),
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  selectNewProfilePicture() {
    // Abre o input de arquivos para selecionar uma nova imagem
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  handleImageChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result;
        localStorage.setItem('userProfilePicture', this.profilePicture || '');
      };
      reader.readAsDataURL(file);
    }
  }

  showZoomedImage() {
    if (this.profilePicture) {
      this.isZoomedImageModalOpen = true;
    }
  }

  closeZoomedImage() {
    this.isZoomedImageModalOpen = false;
  }

  changeUserData() {
    if (this.validateForm()) {
      try {
        // Formatar os dados antes de salvar
        this.formatDate();
        this.formatPhone();

        localStorage.setItem('fullName', this.name || '');
        localStorage.setItem('userEmail', this.email || '');
        localStorage.setItem('userProfilePicture', this.profilePicture || '');
        localStorage.setItem('userCellphone', this.cellphone || '');
        localStorage.setItem('userBirthDate', this.birthDate || '');
  
        this.loadUserProfile();
        this.isDataUpdated = true;
        setTimeout(() => {
          this.isDataUpdated = false;
          this.router.navigate(['/tabs/tab3']);
        }, 3000);
      } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        this.isErrorOccurred = true;
        setTimeout(() => {
          this.isErrorOccurred = false;
        }, 3000);
      }
    } else {
      console.log('Formulário inválido');
      this.isErrorOccurred = true;
    }
  }

  validateForm(): boolean {
    if (!this.name || !this.cellphone || !this.email) {
      return false;
    }
    return true;
  }

  formatDate() {
    if (this.birthDate) {
      let dateOnlyDigits = this.birthDate.replace(/\D/g, '');
      if (dateOnlyDigits.length > 8) {
        dateOnlyDigits = dateOnlyDigits.slice(0, 8);
      }

      if (dateOnlyDigits.length >= 5) {
        this.birthDate = dateOnlyDigits.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
      } else if (dateOnlyDigits.length >= 3) {
        this.birthDate = dateOnlyDigits.replace(/(\d{2})(\d+)/, '$1/$2');
      } else {
        this.birthDate = dateOnlyDigits;
      }

      if (this.birthDate.length > 10) {
        this.birthDate = this.birthDate.slice(0, 10);
      }
    }
  }

  formatPhone() {
    if (this.cellphone) {
      let formattedPhone = this.cellphone.replace(/\D/g, '');
  
      if (formattedPhone.length > 10) {
        formattedPhone = formattedPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (formattedPhone.length > 6) {
        formattedPhone = formattedPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else if (formattedPhone.length > 2) {
        formattedPhone = formattedPhone.replace(/(\d{2})(\d+)/, '($1) $2');
      }
  
      this.cellphone = formattedPhone;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
