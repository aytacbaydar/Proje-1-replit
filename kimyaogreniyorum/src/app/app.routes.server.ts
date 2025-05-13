
import { ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // SSR ile render edilmesini istediğiniz yollar
  { path: '/', renderMode: 'ssr' },
  { path: '/login', renderMode: 'ssr' },
  { path: '/register', renderMode: 'ssr' },
  { path: '/admin', renderMode: 'ssr' },
  { path: '/admin/students', renderMode: 'ssr' },
  { path: 'admin/students/edit/:id', renderMode: 'ssr' },
];
