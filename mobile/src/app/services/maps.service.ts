// src/app/services/maps.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private apiKey = 'AIzaSyDyKZlji_mdKjNcIH_LCdSdg1AR4OPBBxY'; // Sua chave da API
  private baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {}

  getGeocode(address: string): Observable<any> {
    const url = `${this.baseUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    return this.http.get<any>(url); // Faz a requisição GET para a API
  }
}
