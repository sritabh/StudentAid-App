import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewEventsPageRoutingModule } from './view-events-routing.module';

import { ViewEventsPage } from './view-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewEventsPageRoutingModule
  ],
  declarations: [ViewEventsPage]
})
export class ViewEventsPageModule {}
