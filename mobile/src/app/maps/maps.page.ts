import { Component, AfterViewInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {
  map: any;
  salonLocation = { lat: -23.55052, lng: -46.633308 }; // Coordenadas do salão

  constructor() {}

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      this.map = new google.maps.Map(mapContainer, {
        center: this.salonLocation,
        zoom: 15,
      });

      new google.maps.Marker({
        position: this.salonLocation,
        map: this.map,
        title: 'Local do Salão',
      });
    }
  }

  navigateToSalonUsingWazeAPI() {
    const salonLocation = { lat: -23.55052, lng: -46.633308 };
    const url = `https://waze.com/ul?ll=${salonLocation.lat},${salonLocation.lng}&navigate=yes`;
    Browser.open({ url });
  }
  

  goBack() {
    history.back();
  }
}
