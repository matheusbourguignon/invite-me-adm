import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importação do ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { CreateAccountPageRoutingModule } from './create-account-routing.module';
import { CreateAccountPage } from './create-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // Adicionar ReactiveFormsModule
    IonicModule,
    CreateAccountPageRoutingModule
  ],
  declarations: [CreateAccountPage]
})
export class CreateAccountPageModule {}
