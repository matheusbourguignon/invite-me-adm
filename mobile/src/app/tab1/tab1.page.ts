import { Component } from '@angular/core';
import { calendar } from 'ionicons/icons'; // Importar o ícone
import { Router } from '@angular/router'; // Importar o Router para navegação

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  invites = [
    { title: 'Convite 1', date: '15-10-2024', time: '18:00', description: 'Descrição do Convite 1' },
    { title: 'Convite 2', date: '20-10-2024', time: '19:30', description: 'Descrição do Convite 2' },
    { title: 'Convite 3', date: '25-10-2024', time: '16:00', description: 'Descrição do Convite 3' },
    // Adicione mais convites conforme necessário
  ];

  selectedInvite: any = null; // Variável para armazenar o convite selecionado (iniciado como null)
  calendar = calendar; // Defina a variável do ícone aqui

  constructor(private router: Router) {} // Injetar o Router no construtor

  // Método para selecionar e alternar entre convites
  selectInvite(invite: any) {
    if (this.selectedInvite === invite) {
      this.selectedInvite = null; // Se o mesmo convite for clicado, desmarque-o
    } else {
      this.selectedInvite = invite; // Caso contrário, defina o convite selecionado
    }
  }

  // Método para navegar para a página de mapas com o endereço do convite
  goToMaps() {
    if (this.selectedInvite) {
      this.router.navigate(['/maps'], {
        state: { address: this.selectedInvite.description } // Passando o endereço para a página de mapas
      });
    } else {
      console.warn('Selecione um convite para ver a localização!'); // Mensagem de aviso caso nenhum convite seja selecionado
    }
  }
}
