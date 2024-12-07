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
  name: string | undefined;
  cellphone: string | undefined;
  email: string | undefined;
  birthDate: string | undefined;
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
    const accountId = '46b68fa0-da5f-4c1c-80c4-2c4ca8cedb58'; // Substitua com o ID real do usuário, pode ser retirado do token ou storage

    // Chama o serviço para obter os dados do usuário
    this.authService.getUserAccount(accountId).subscribe({
      next: (data) => {
        this.name = data.name;
        this.email = data.email;
        this.cellphone = data.cellphone;
        this.birthDate = data.birthdate;
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
      }
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
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

  // Função para exibir a mensagem de dados atualizados
  showUpdatedMessage() {
    this.isDataUpdated = true;
    setTimeout(() => {
      this.isDataUpdated = false;  // Oculta a mensagem após 3 segundos
    }, 3000);
  }
}
