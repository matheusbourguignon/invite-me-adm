import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.page.html',
  styleUrls: ['./update-account.page.scss'],
})
export class UpdateAccountPage implements OnInit {
  updateAccountForm: FormGroup;
  showSuccessMessage: boolean = false;
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService  ) {
    this.updateAccountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    // Recuperar dados do localStorage, incluindo senha (mas não exibi-la diretamente)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    // Verificar se os dados existem no localStorage
    if (userData) {
      // Preencher o formulário com os dados do localStorage, incluindo a senha
      this.updateAccountForm.patchValue({
        name: userData.name,
        email: userData.email,
        birthdate: userData.birthdate,
        cellphone: userData.cellphone,
        password: userData.password || '', // Não manipula ou expõe a senha diretamente
      });
    }
  }

  ionViewWillEnter() {
    // Limpar a mensagem de sucesso ao voltar para a página
    this.showSuccessMessage = false;
  }

  onSubmit() {
    if (this.updateAccountForm.valid) {
      const formData = this.updateAccountForm.value;
      const userId = '46b68fa0-da5f-4c1c-80c4-2c4ca8cedb58'; // Aqui você vai passar o ID do usuário correto
  
      // Remover a senha do objeto que será armazenado no localStorage
      const { password, ...dataToStore } = formData;

      console.log('Sending data to backend:', { ...formData, userId });  // Log para verificar os dados
  
      this.authService.updateAccount({ ...formData, userId }).subscribe(
        (response) => {
          console.log('Account updated:', response);
          this.showSuccessMessage = true; // Exibe a mensagem de sucesso
          
          // Armazenar os dados no localStorage (exceto a senha)
          localStorage.setItem('userData', JSON.stringify(dataToStore));

          setTimeout(() => {
            this.router.navigate(['/tab3']); // Navega para a página de perfil após a atualização
          }, 3000); // Espera 3 segundos para a navegação
        },
        (error) => {
          console.error('Error updating account:', error);
          alert(error.error.message || 'Failed to update account.');
        }
      );
    }
  }
}
