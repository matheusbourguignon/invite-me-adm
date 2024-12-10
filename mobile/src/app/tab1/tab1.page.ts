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
    {
      title: 'Ana Julia',
      date: '2024-12-15',
      time: '18:00',
      description: 'Casa de festas Jardim do Logo',
      location: { lat: -22.911799161144373, lng: -43.54831824589244 }, // Coordenadas atualizadas
    },
    {
      title: 'Bruno e Luiza',
      date: '2024-12-20',
      time: '15:00',
      description: 'Sonhos da Prata',
      location: { lat: -22.909701214168084, lng: -43.52427007472754 }, // Coordenadas atualizadas
    },
  ];

  selectedInvite: any = null; // Variável para armazenar o convite selecionado
  calendar = calendar; // Ícone

  constructor(private router: Router) {} // Injetar o Router no construtor

  // Método para selecionar e alternar entre convites
  selectInvite(invite: any) {
    if (this.selectedInvite === invite) {
      this.selectedInvite = null; // Se o mesmo convite for clicado, desmarque-o
    } else {
      this.selectedInvite = invite; // Caso contrário, defina o convite selecionado
    }
  }

  // Método para abrir o Google Maps com a localização do convite
  goToMaps() {
    if (this.selectedInvite?.location) {
      const { lat, lng } = this.selectedInvite.location;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(url, '_system'); // Abre o Google Maps
    } else {
      console.warn('Localização não disponível para este convite.'); // Aviso caso não tenha localização
    }
  }
}
