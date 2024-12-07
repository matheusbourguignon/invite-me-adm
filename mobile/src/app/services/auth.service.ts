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

  // Método para login com Google (exemplo básico)
  loginWithGoogle(): Observable<any> {
    // Aqui você pode integrar a lógica de login com Google OAuth, por exemplo
    return new Observable((observer) => {
      // Lógica do login com Google (exemplo fictício)
      observer.next({ user: 'googleUser' });  // Retorno fictício
      observer.complete();
    });
  }

   // Método para atualizar os dados do usuário
   updateAccount(data: {
    name: string;
    email: string;
    birthdate: string;
    cellphone: string;
    password?: string;  // A senha é opcional para a atualização
  }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-account`, data);
  }


  logout(): Observable<any> {
    // Lógica para limpar informações de autenticação (e.g., limpar token)
    localStorage.removeItem('userToken'); // Exemplo de remoção de token

    // Retorna um Observable (você pode adaptar conforme a necessidade)
    return of({ message: 'Logged out successfully' });
  }

}
