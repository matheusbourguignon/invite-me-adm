import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importe o Router

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.page.html',
  styleUrls: ['./presentation.page.scss'],
})
export class PresentationPage implements OnInit {

  constructor(private router: Router) { } // Injete o Router

  ngOnInit() {
    this.redirectToLogin();
  }

  redirectToLogin() {
    // Redireciona para a página de login após 5 segundos
    setTimeout(() => {
      this.router.navigate(['/login']); 
    }, 5000); // 5000 milissegundos = 5 segundos
  }
}
