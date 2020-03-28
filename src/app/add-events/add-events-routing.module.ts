import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEventsPage } from './add-events.page';

const routes: Routes = [
  {
    path: '',
    component: AddEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEventsPageRoutingModule {}
