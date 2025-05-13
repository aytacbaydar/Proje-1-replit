
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminIndexPageComponent } from './admin-index-page/admin-index-page.component';
import { AdminStudentEditPageComponent } from './admin-student-edit-page/admin-student-edit-page.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminIndexPageComponent,
    AdminStudentEditPageComponent
  ],
  imports: [
    CommonModule, 
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    AdminIndexPageComponent,
    AdminStudentEditPageComponent
  ]
})
export class AdminPageModule {}
