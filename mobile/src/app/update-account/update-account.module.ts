import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UpdateAccountPageRoutingModule } from './update-account-routing.module';
import { UpdateAccountPage } from './update-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule, 
    UpdateAccountPageRoutingModule
  ],
  declarations: [UpdateAccountPage]
})
export class UpdateAccountPageModule {}
