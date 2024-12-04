import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

declare var google: any; // Declara o objeto global do Google Maps

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements AfterViewInit {
  salonLocation = {
    lat: -22.911616868134058,
    lng: -43.54839930978883,
  };

  map: any;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.loadMap(); // Carrega o mapa após o elemento estar disponível na tela
  }

  // Método para carregar o mapa centrado nas coordenadas do salão
  loadMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, {
        center: this.salonLocation,
        zoom: 16, // Nível de zoom
      });

      // Adiciona marcador nas coordenadas do salão
      new google.maps.Marker({
        position: this.salonLocation,
        map: this.map,
        title: 'Casa de Festas Jardim do Lago',
      });
    }
  }

  // Método para abrir o Waze usando a API do Waze
  navigateToSalonUsingWazeAPI() {
    const { lat, lng } = this.salonLocation;

    // Monta o URL para a API do Waze
    const wazeApiUrl = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;

    // Abre a URL no app do Waze ou no navegador
    window.open(wazeApiUrl, '_blank');
  }

  // Método para voltar à página anterior
  goBack() {
    this.router.navigate(['/tabs/tab1']);
  }
}
