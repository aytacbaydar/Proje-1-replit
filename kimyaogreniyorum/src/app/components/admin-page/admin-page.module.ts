import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminIndexPageComponent } from './admin-index-page/admin-index-page.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminStudentsPageComponent } from './admin-students-page/admin-students-page.component';
import { AdminStudentEditPageComponent } from './admin-student-edit-page/admin-student-edit-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminIndexPageComponent,
    children: [
      {
        path: 'students',
        component: AdminStudentsPageComponent
      },
      {
        path: 'students/edit/:id',
        component: AdminStudentEditPageComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AdminIndexPageComponent,
    AdminStudentsPageComponent,
    AdminStudentEditPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    AdminIndexPageComponent,
    AdminStudentsPageComponent,
    AdminStudentEditPageComponent
  ]
})
export class AdminPageModule {}