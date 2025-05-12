import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminIndexPageComponent } from './admin-page/admin-index-page/admin-index-page.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [AdminIndexPageComponent],
  imports: [CommonModule, RouterModule, HttpClientModule],
})
export class AdminPageModule {}
