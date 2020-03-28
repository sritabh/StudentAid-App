import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserManagerPageRoutingModule } from './user-manager-routing.module';

import { UserManagerPage } from './user-manager.page';
import { OrderByPipe } from '../order-by.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserManagerPageRoutingModule
  ],
  declarations: [
    UserManagerPage,
    OrderByPipe,
  
  ]
})
export class UserManagerPageModule {}
