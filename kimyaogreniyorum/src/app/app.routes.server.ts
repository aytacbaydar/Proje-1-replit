
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/students/edit/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => {
      // Örnek ID'ler döndürülebilir veya veritabanından çekilebilir
      return Promise.resolve([{ id: '1' }]);
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
