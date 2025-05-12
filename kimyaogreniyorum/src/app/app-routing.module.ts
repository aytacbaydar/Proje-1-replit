import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent() {
      return import('./components/general-page/login/login.component').then(
        (m) => m.LoginComponent
      );
    },
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent() {
      return import(
        './components/general-page/register/register.component'
      ).then((m) => m.RegisterComponent);
    },
  },
  {
    path: 'confirmation',
    loadComponent() {
      return import(
        './components/general-page/confirmation/confirmation.component'
      ).then((m) => m.ConfirmationComponent);
    },
  },
  {
    path: 'admin',
    loadComponent() {
      return import(
        './components/admin-page/admin-index-page/admin-index-page.component'
      ).then((m) => m.AdminIndexPageComponent);
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
