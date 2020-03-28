import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagerPage } from './user-manager.page';

const routes: Routes = [
  {
    path: '',
    component: UserManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagerPageRoutingModule {}
