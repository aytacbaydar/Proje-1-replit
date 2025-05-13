export const serverRoutes = {
  // Prerendering olmayan statik yollar için varsayılan olarak SSR kullanılır
  defaultRenderMode: 'ssr',
  routes: [
    // SSR ile render edilmesini istediğiniz yollar
    { path: '/', renderMode: 'ssr' },
    { path: '/login', renderMode: 'ssr' },
    { path: '/register', renderMode: 'ssr' },

    // Tamamen statik olarak sunucuda render edilmesini istediğiniz yollar
    { path: '/admin', renderMode: 'ssr' },
    { path: '/admin/students', renderMode: 'ssr' },
    { path: 'admin/students/edit/:id', renderMode: 'ssr' },
  ],
};