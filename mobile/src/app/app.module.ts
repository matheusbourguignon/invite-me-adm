import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';  // Importa o AngularFireModule
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  // Importa o módulo de autenticação do Firebase
import { environment } from '../environments/environment';  // Configuração do Firebase

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Inicializa o Firebase
    AngularFireAuthModule,  // Módulo de autenticação do Firebase
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
