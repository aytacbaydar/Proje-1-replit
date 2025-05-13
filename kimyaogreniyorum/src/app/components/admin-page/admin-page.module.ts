
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminIndexPageComponent } from './admin-index-page/admin-index-page.component';
import { AdminStudentEditPageComponent } from './admin-student-edit-page/admin-student-edit-page.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AdminStudentEditPageComponent
  }
];

@NgModule({
  declarations: [
    AdminIndexPageComponent,
    AdminStudentEditPageComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class AdminPageModule {}
