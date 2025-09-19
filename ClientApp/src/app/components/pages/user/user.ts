import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Cambiamos el nombre de la interface para evitar conflictos
interface UserModel {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class User{
  searchTerm: string = '';

  users: UserModel[] = [
    { name: 'Juan Pérez', email: 'juan@mail.com', password: '123456' },
    { name: 'María López', email: 'maria@mail.com', password: 'abcdef' },
    { name: 'Carlos Gómez', email: 'carlos@mail.com', password: 'qwerty' }
  ];

  // Filtra usuarios según searchTerm
  filteredUsers() {
    if (!this.searchTerm) return this.users;
    return this.users.filter(u =>
      u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Edita contraseña de un usuario
  editPassword(user: UserModel) {
    const newPassword = prompt(`Ingresa nueva contraseña para ${user.name}:`);
    if (newPassword) {
      user.password = newPassword;
      alert(`Contraseña de ${user.name} actualizada.`);
    }
  }

  // Elimina un usuario
  deleteUser(user: UserModel) {
    if (confirm(`¿Seguro que deseas eliminar a ${user.name}?`)) {
      this.users = this.users.filter(u => u !== user);
    }
  }
}
