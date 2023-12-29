import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from "./shared/auth.service";

export const AuthenticationGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
      return true;
  }

  router.navigate(['/auth/login']);
  return false;
}
