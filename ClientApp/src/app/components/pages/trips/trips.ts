import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trips.html',
  styleUrls: ['./trips.css']
})
export class Trips {
  trips = [
    { destination: 'París', date: '2025-10-01', notes: 'Viaje romántico' },
    { destination: 'México', date: '2025-11-15', notes: 'Conferencia de trabajo' }
  ];
}
