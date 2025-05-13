import { NgModule } from '@angular/core';
import { RouterModule, Routes, withComponentInputBinding } from '@angular/router';
import { AdminIndexPageComponent } from './components/admin-page/admin-index-page/admin-index-page.component';
import { AdminStudentEditPageComponent } from './components/admin-page/admin-student-edit-page/admin-student-edit-page.component';

const routes: Routes = [
  // Admin routes
  {
    path: 'admin',
    component: AdminIndexPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'students',
        pathMatch: 'full'
      },
      {
        path: 'students',
        loadChildren: () => import('./components/admin-page/admin-students-page/admin-students-page.module').then(m => m.AdminStudentsPageModule)
      },
      {
        path: 'students/edit/:id',
        loadComponent: () => import('./components/admin-page/admin-student-edit-page/admin-student-edit-page.component').then(m => m.AdminStudentEditPageComponent)
      }
    ]
  },

  // Ana güzergahlar
  {
    path: '',
    loadChildren: () => import('./components/general-page/general-page.module').then(m => m.GeneralPageModule)
  },

  // Bilinmeyen güzergahlar için çözüm
  { 
    path: '**', 
    redirectTo: '/'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      initialNavigation: 'enabledBlocking',
      bindToComponentInputs: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }