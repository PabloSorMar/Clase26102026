import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificación de estado reactivo (nutrido desde memoria o Web Storage)[cite: 6]
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado, redirigir atómicamente a la página de login[cite: 6]
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
