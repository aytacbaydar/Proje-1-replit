import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminIndexPageComponent } from './admin-index-page/admin-index-page.component';
import { AdminStudentsPageComponent } from './admin-students-page/admin-students-page.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AdminIndexPageComponent,
    AdminStudentsPageComponent
  ],
  imports: [
    CommonModule, 
    RouterModule,
    HttpClientModule
  ],
})
export class AdminPageModule {}
