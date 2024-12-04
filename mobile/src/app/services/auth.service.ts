import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private app = initializeApp(environment.firebaseConfig);
  private auth = getAuth(this.app);
  private firestore = getFirestore(this.app);

  constructor() {
    // Monitora mudanças de estado de autenticação
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('Usuário autenticado:', user);

        // Captura o nome completo ou define uma string vazia caso não exista
        const fullName = user.displayName || 'Nome não fornecido';
        
        // Armazena o nome completo no localStorage
        localStorage.setItem('userFullName', fullName);  // Armazenando nome completo
        localStorage.setItem('userEmail', user.email || '');
        localStorage.setItem('userProfilePicture', user.photoURL || '');

        // Carrega os dados do usuário (número de telefone, etc.)
        this.loadUserData(user.uid);
      } else {
        console.log('Usuário não autenticado');
        localStorage.clear(); // Limpa o Local Storage se o usuário não estiver autenticado
      }
    });
  }

  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    const user = result.user;

    // Chama a função para carregar os dados do usuário
    this.loadUserData(user.uid);
    return result;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    localStorage.clear(); // Limpa o Local Storage ao sair
  }

  getUser() {
    return this.auth.currentUser;
  }

  // Função para carregar o número de telefone do Firestore
  private async loadUserData(uid: string) {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Recupera o número de telefone
      const cellphone = userData?.['cellphone'] || '';

      // Armazena no localStorage
      localStorage.setItem('userCellphone', cellphone);
    }
  }

  async getUserData() {
    const user = this.getUser();
    if (user) {
      const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
    }
    return null;
  }

  async setUserData(cellphone: string) {
    const user = this.getUser();
    if (user) {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      try {
        await setDoc(
          userDocRef,
          {
            cellphone: cellphone,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          },
          { merge: true }
        );

        // Atualiza dados no Local Storage
        localStorage.setItem('userCellphone', cellphone);
        console.log('Dados do usuário atualizados com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        throw error;
      }
    }
  }
}
