import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { MyDataService } from '../services/my-data.service';
import { Router } from '@angular/router';

export const hasRoleGuardGuard: CanActivateFn = (route, state) => {
  const myDataService = inject(MyDataService);
  const router = inject(Router);

  const userRole = myDataService.getUserRole(); // El rol del usuario es un solo string
  const requiredRoles: string[] = route.data?.['roles'] || []; // Lista de roles permitidos

  if (userRole && !requiredRoles.includes(userRole)) {
    router.navigate(['inicio']); // Redirige si el rol no está en la lista
    return false;
  }

  return userRole ? true : false; // Ensure userRole is a valid string, else return false
};
export function canActivateWithRoles(requiredRoles: string[]): boolean {
  const myDataService = inject(MyDataService);
  const userRole = myDataService.getUserRole();

  // Verifica si el rol del usuario no es nulo antes de hacer la comparación
  return userRole !== null && requiredRoles.includes(userRole);
}