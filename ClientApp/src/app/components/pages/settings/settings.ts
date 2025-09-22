import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit {

  user: any = { name: '', email: '', password: '' };
  userId: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Obtener el usuario guardado en localStorage después del login
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.user = {
        name: parsed.name,
        email: parsed.email,
        password: ''
      };
      this.userId = parsed.id || parsed.Id; // Dependiendo de cómo venga el JSON
    }
  }

  guardarCambios() {
    const payload = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password
    };

    this.http.put(`https://localhost:7236/api/auth/user/${this.userId}`, payload)
      .subscribe({
        next: () => {
          alert("Perfil actualizado con éxito ✅");
          this.user.password = '';
          // Actualizar localStorage con nuevos datos
          localStorage.setItem('userData', JSON.stringify({ ...JSON.parse(localStorage.getItem('userData') || '{}'), name: this.user.name, email: this.user.email }));
        },
        error: (err) => {
          console.error(err);
          alert("Ocurrió un error al actualizar el perfil ❌");
        }
      });
  }
}
