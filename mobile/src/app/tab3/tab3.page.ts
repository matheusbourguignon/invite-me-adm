import { DatePipe } from '@angular/common'; // Importe o DatePipe
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
    private router: Router,
    private datePipe: DatePipe  // Injeta o DatePipe aqui
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
        
        // Formata o número de celular
        this.cellphone = this.formatPhoneNumber(data.cellphone);
        
        // Usa o DatePipe para formatar a data no formato dd/MM/yyyy
        this.birthDate = this.datePipe.transform(data.birthdate, 'dd/MM/yyyy')!;
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

  // Função para formatar o celular para o formato (XX) XXXXX-XXXX
  formatPhoneNumber(phone: string): string {
    if (phone) {
      let phoneOnlyDigits = phone.replace(/\D/g, '');  // Remove caracteres não numéricos
      if (phoneOnlyDigits.length === 11) {  // Verifica se tem 11 dígitos
        return phoneOnlyDigits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else {
        return phoneOnlyDigits;  // Retorna o número sem formatação caso não tenha 11 dígitos
      }
    }
    return phone;  // Caso o telefone seja vazio ou indefinido, retorna o valor original
  }

  // Função para exibir a mensagem de dados atualizados
  showUpdatedMessage() {
    this.isDataUpdated = true;
    setTimeout(() => {
      this.isDataUpdated = false;  // Oculta a mensagem após 3 segundos
    }, 3000);
  }
}
