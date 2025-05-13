
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminStudentsPageComponent } from './admin-students-page.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AdminStudentsPageComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AdminStudentsPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule
  ]
})
export class AdminStudentsPageModule { }
