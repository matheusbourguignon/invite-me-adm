import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3333'; // URL do backend para autenticação

  constructor(private http: HttpClient) {}

  // Método para criação de conta
  createAccount(data: {
    name: string;
    email: string;
    birthdate: string;
    cellphone: string;
    password: string;
  }): Observable<{ accountId: string }> {
    return this.http.post<{ accountId: string }>(
      `${this.apiUrl}/create-account`,
      data
    );
  }

  // Método para login
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body);
  }

  // Método de logout
  logout(): Observable<void> {
    // Aqui você pode limpar o token ou dados relacionados ao login
    localStorage.removeItem('userToken');  // Exemplo de remoção do token do localStorage
    return of();  // Retorna um Observable vazio (sem valor)
  }

  // Método para login com Google (exemplo básico)
  loginWithGoogle(): Observable<any> {
    // Aqui você pode integrar a lógica de login com Google OAuth, por exemplo
    return new Observable((observer) => {
      // Lógica do login com Google (exemplo fictício)
      observer.next({ user: 'googleUser' });  // Retorno fictício
      observer.complete();
    });
  }
}
