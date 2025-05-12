import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-index-page',
  standalone: false,
  templateUrl: './admin-index-page.component.html',
  styleUrl: './admin-index-page.component.scss',
})
export class AdminIndexPageComponent implements OnInit {
  sidebarExpanded = true;
  admin = {
    adi_soyadi: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
  };

  constructor() {}

  ngOnInit(): void {}

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}