import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewEventsPage } from './view-events.page';

const routes: Routes = [
  {
    path: '',
    component: ViewEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewEventsPageRoutingModule {}
