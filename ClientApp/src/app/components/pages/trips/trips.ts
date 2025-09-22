import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trips.html',
  styleUrls: ['./trips.css']
})
export class Trips {
  @Input() paisesDisponibles: string[] = []; // lista de países desde Dashboard

  trips: { destination: string; date: string; notes: string }[] = [];

  showForm = false;

  nuevo = {
    destino: '',
    fechaSalida: '',
    fechaRetorno: '',
    titulo: '',
    notas: ''
  };

  nuevoViaje() {
    this.showForm = true;
  }

  agregarViaje() {
    if (!this.nuevo.destino || !this.nuevo.fechaSalida || !this.nuevo.fechaRetorno || !this.nuevo.titulo) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.trips.push({
      destination: this.nuevo.destino,
      date: `${this.nuevo.fechaSalida} - ${this.nuevo.fechaRetorno}`,
      notes: this.nuevo.notas
    });

    this.nuevo = { destino: '', fechaSalida: '', fechaRetorno: '', titulo: '', notas: '' };
    this.showForm = false;
  }
}
