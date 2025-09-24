import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesComponent } from '../../pages/countries/countries';
import { SettingsComponent } from '../../pages/settings/settings';
import { TripsComponent } from '../../pages/trips/trips';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CountriesComponent, SettingsComponent, TripsComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  mostrarViajes = false;
  mostrarAjustes = false;
  mostrarPaises = false;

  /** Alterna las secciones visibles dentro del dashboard */
  alternar(seccion: string) {
    this.mostrarViajes = seccion === 'viajes';
    this.mostrarAjustes = seccion === 'ajustes';
    this.mostrarPaises = seccion === 'paises';
  }

  /** Cierra la sesión y redirige a login.html en wwwroot */
  cerrarSesion() {
  // Limpiar datos de sesión
  localStorage.removeItem('userData');
  localStorage.removeItem('userToken');

  // Redirección absoluta correcta
  window.location.href = window.location.origin + '/login.html';
}

}
