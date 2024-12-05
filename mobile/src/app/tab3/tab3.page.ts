import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  profilePicture: string | undefined;
  name: string | undefined;
  cellphone: string | undefined;
  email: string | undefined;
  birthDate: string | undefined;
  isZoomedImageModalOpen = false;
  isDataUpdated = false;  // Variável para controlar a exibição da mensagem de dados atualizados

  constructor(
    private actionSheetController: ActionSheetController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const storedName = localStorage.getItem('userFullName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedProfilePicture = localStorage.getItem('userProfilePicture');
    const storedCellphone = localStorage.getItem('userCellphone');
    const storedBirthDate = localStorage.getItem('userBirthDate');
    
    this.name = storedName || '';
    this.email = storedEmail || '';
    this.profilePicture = storedProfilePicture || '';
    this.cellphone = storedCellphone || '';
    this.birthDate = storedBirthDate || '';
  
    this.formatDate();
    this.formatPhone();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Ver Imagem',
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

  selectNewProfilePicture(event?: Event) {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.profilePicture = event.target.result;
            localStorage.setItem('userProfilePicture', this.profilePicture || '');
            this.showUpdatedMessage();  // Chama a função para exibir a mensagem de dados atualizados
          };
          reader.readAsDataURL(file);
        }
      };
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
      } else if (formattedPhone.length > 5) {
        formattedPhone = formattedPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else if (formattedPhone.length > 2) {
        formattedPhone = formattedPhone.replace(/(\d{2})(\d{0,4})/, '($1) $2');
      }

      this.cellphone = formattedPhone;
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Usuário deslogado com sucesso');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro ao deslogar:', error);
      }
    });
  }
  

  // Função para exibir a mensagem de dados atualizados
  showUpdatedMessage() {
    this.isDataUpdated = true;
    setTimeout(() => {
      this.isDataUpdated = false;  // Oculta a mensagem após 3 segundos
    }, 3000);
  }
}
