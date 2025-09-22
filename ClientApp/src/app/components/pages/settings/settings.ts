import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';   // 👈 importar esto

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],   // 👈 agregar FormsModule aquí
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit {
  userId: string = '';
  user: any = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.userId = parsed.id;  // <- importante: el id del usuario
      this.user.name = parsed.name;
      this.user.email = parsed.email;
    }
  }

  guardarCambios() {
    if (!this.userId) {
      alert("No se encontró el ID del usuario ❌");
      return;
    }

    const payload = {
      id: this.userId,
      email: this.user.email,
      name: this.user.name,
      passwordHash: this.user.password // ⚠️ el backend debe hashearla
    };

    this.http.put(`/api/user/${this.userId}`, payload).subscribe(() => {
      alert("Perfil actualizado con éxito ✅");
      this.user.password = '';

      // también actualizamos en localStorage el nuevo nombre/email
      localStorage.setItem('userData', JSON.stringify({
        ...payload,
        passwordHash: undefined // no guardamos la contraseña
      }));
    });
  }
}
