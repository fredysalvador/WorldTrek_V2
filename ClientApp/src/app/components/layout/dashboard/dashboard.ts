import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Countries } from '../../pages/countries/countries';
import { Settings } from '../../pages/settings/settings';
import { Trips } from '../../pages/trips/trips';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Countries, Settings, Trips],  
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  mostrarViajes = false;
  mostrarAjustes = false;
  mostrarPaises = false;

  alternar(seccion: string) {
    this.mostrarViajes = seccion === 'viajes';
    this.mostrarAjustes = seccion === 'ajustes';
    this.mostrarPaises = seccion === 'paises';
  }
}
