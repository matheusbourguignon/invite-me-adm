import { HttpClient } from '@angular/common/http'; // Importar HttpClient para requisições HTTP
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar o Router para navegação
import { calendar } from 'ionicons/icons'; // Importar o ícone

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  invites: any[] = []; // Lista de convites
  selectedInvite: any = null; // Variável para armazenar o convite selecionado
  calendar = calendar; // Definindo a variável do ícone aqui

  constructor(private router: Router, private http: HttpClient) {} // Injetar o Router e HttpClient

  ngOnInit() {
    this.loadInvites(); // Carregar os convites ao iniciar o componente
  }

  // Método para carregar os convites (por exemplo, de uma API)
  loadInvites() {
    this.http.get<any[]>('/api/convites') // Supondo que a API retorne uma lista de convites
      .subscribe(response => {
        this.invites = response; // Atribuindo a lista de convites recebida
      }, error => {
        console.error('Erro ao carregar os convites:', error);
      });
  }

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
