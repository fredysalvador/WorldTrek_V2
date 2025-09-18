import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Viajes } from './viajes/viajes';
import { Accesos } from './accesos/accesos';
import { Favoritos } from './favoritos/favoritos';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'viajes', component: Viajes },
  { path: 'accesos', component: Accesos },
  { path: 'favoritos', component: Favoritos },
];
