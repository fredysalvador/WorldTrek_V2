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
  cargando = false;

  /** Alterna las secciones visibles con un pequeño delay para el spinner */
  alternar(seccion: string) {
    this.cargando = true;
    setTimeout(() => {
      this.mostrarViajes = seccion === 'viajes';
      this.mostrarAjustes = seccion === 'ajustes';
      this.mostrarPaises = seccion === 'paises';
      this.cargando = false;
    }, 600);
  }

  /** Cierra sesión y redirige a login.html */
  cerrarSesion() {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    window.location.href = window.location.origin + '/login.html';
  }
}
