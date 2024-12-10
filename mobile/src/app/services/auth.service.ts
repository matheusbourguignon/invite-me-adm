import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service'; // Importe o serviço do Firebase

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3333'; // URL do backend para autenticação

  constructor(
    private http: HttpClient,
    private firebaseAuth: FirebaseAuthService // Injete o serviço do Firebase
  ) {}

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

  /**
   * Método para login com Google usando Firebase
   */
  loginWithGoogle(): Observable<any> {
    return new Observable((observer) => {
      this.firebaseAuth.signInWithGoogle().then(
        (userCredential) => {
          // Supondo que você obtenha um token JWT do Firebase
          const token = userCredential.user?.getIdToken();
          if (token) {
            observer.next({ token });
            observer.complete();
          } else {
            observer.error('Google login failed, no token found');
          }
        },
        (error) => {
          observer.error(error);
        }
      );
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

  // Método para obter os dados do usuário com base no accountId
  getUserAccount(accountId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/account/${accountId}`);
  }

  // Método para logout
  logout(): Observable<any> {
    // Lógica para limpar informações de autenticação (e.g., limpar token)
    localStorage.removeItem('userToken'); // Exemplo de remoção de token

    // Retorna um Observable (você pode adaptar conforme a necessidade)
    return of({ message: 'Logged out successfully' });
  }
}
