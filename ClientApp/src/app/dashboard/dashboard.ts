import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  cerrarSesion() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = '/login.html';
  }
}
