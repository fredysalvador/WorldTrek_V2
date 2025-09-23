import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Country {
  name: { common: string };
  cca3: string;
}

interface Viaje {
  id?: string;
  destino: string;
  fechaSalida: string;
  fechaRetorno: string;
  titulo: string;
  notas: string;
}

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './trips.html',
  styleUrls: ['./trips.css']
})
export class TripsComponent implements OnInit {
  trips: Viaje[] = [];
  paises: Country[] = [];
  favoritosUsuario: Set<string> = new Set();
  paisesDisponibles: Country[] = [];
  showForm = false;

  nuevo: Viaje = {
    destino: '',
    fechaSalida: '',
    fechaRetorno: '',
    titulo: '',
    notas: ''
  };

  userId: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.userId = parsed.id || parsed.Id;
      this.cargarPaisesYFavoritos();
      this.cargarViajes();
    }
  }

  cargarPaisesYFavoritos() {
    this.http.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,cca3')
      .subscribe({
        next: (data) => {
          this.paises = data.sort((a, b) => a.name.common.localeCompare(b.name.common));

          // Traer favoritos del backend
          this.http.get<string[]>(`https://localhost:7236/api/favorites/countries/${this.userId}`)
            .subscribe({
              next: (favs) => {
                this.favoritosUsuario = new Set(favs || []);
                this.ordenarPaises();
              },
              error: (err) => console.error('Error al cargar favoritos', err)
            });
        },
        error: (err) => console.error('Error al cargar países', err)
      });
  }

  ordenarPaises() {
    const favoritos: Country[] = [];
    const noFav: Country[] = [];
    for (const pais of this.paises) {
      if (this.favoritosUsuario.has(pais.cca3)) favoritos.push(pais);
      else noFav.push(pais);
    }
    this.paisesDisponibles = [...favoritos, ...noFav];
  }

  toggleFavorito(code: string) {
    if (this.favoritosUsuario.has(code)) this.favoritosUsuario.delete(code);
    else this.favoritosUsuario.add(code);

    // Guardar favoritos en backend
    this.http.post(`https://localhost:7236/api/favorites/countries/${this.userId}`, [...this.favoritosUsuario])
      .subscribe({ error: err => console.error('Error guardando favoritos', err) });

    this.ordenarPaises();
  }

  nuevoViaje() {
    this.showForm = true;
  }

  agregarViaje() {
    if (!this.nuevo.destino || !this.nuevo.fechaSalida || !this.nuevo.fechaRetorno || !this.nuevo.titulo) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (this.nuevo.fechaSalida > this.nuevo.fechaRetorno) {
      alert('La fecha de salida no puede ser posterior a la fecha de retorno.');
      return;
    }

    // Convertir fechas a ISO para backend
    const viajeParaGuardar = {
      ...this.nuevo,
      fechaSalida: new Date(this.nuevo.fechaSalida).toISOString(),
      fechaRetorno: new Date(this.nuevo.fechaRetorno).toISOString()
    };

    this.http.post<{ id: string }>(`https://localhost:7236/api/trips/${this.userId}`, viajeParaGuardar)
      .subscribe({
        next: (res) => {
          this.trips.push({ id: res.id, ...this.nuevo });
          this.nuevo = { destino: '', fechaSalida: '', fechaRetorno: '', titulo: '', notas: '' };
          this.showForm = false;
        },
        error: (err) => {
          console.error(err);
          alert('Error al guardar el viaje ❌');
        }
      });
  }

  cargarViajes() {
    this.http.get<Viaje[]>(`https://localhost:7236/api/trips/${this.userId}`)
      .subscribe({
        next: (res) => this.trips = res || [],
        error: (err) => console.error('Error al cargar viajes', err)
      });
  }
}
