import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { environment } from '../../environments/environment'; // Importa o arquivo de configuração do Firebase

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor() {
    // Inicializando o Firebase (se não estiver inicializado ainda)
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);  // Inicialize o Firebase com a configuração
    }
  }

  // Método para login com o Google usando Firebase
  signInWithGoogle(): Promise<firebase.auth.UserCredential> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider); // Abre uma janela popup para o login
  }
}
