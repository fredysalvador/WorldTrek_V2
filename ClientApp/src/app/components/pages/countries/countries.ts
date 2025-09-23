import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Country {
  name: { common: string };
  cca3: string;
  flags: { svg: string };
  region?: string;
  population?: number;
  capital?: string[];
}

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, DecimalPipe],
  templateUrl: './countries.html',
  styleUrls: ['./countries.css']
})
export class CountriesComponent implements OnInit {
  paises: Country[] = [];
  filtrados: Country[] = [];
  favoritos: Set<string> = new Set();
  search = '';
  onlyFavs = false;
  userId: string = '';
  dropActivo: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.userId = parsed.id || parsed.Id;
    }

    // Traer países
    this.http.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,cca3,flags,region,population,capital')
      .subscribe({
        next: (data) => {
          this.paises = data.sort((a, b) => a.name.common.localeCompare(b.name.common));

          // Traer favoritos del backend
          this.http.get<string[]>(`https://localhost:7236/api/favorites/countries/${this.userId}`)
            .subscribe({
              next: (favs) => {
                this.favoritos = new Set(favs || []);
                this.filtrar();
              },
              error: (err) => console.error('Error al cargar favoritos', err)
            });
        },
        error: (err) => console.error('Error al cargar países', err)
      });
  }

  filtrar() {
    const q = this.search.toLowerCase().trim();
    this.filtrados = this.paises.filter(p => {
      const match = p.name.common.toLowerCase().includes(q);
      const fav = !this.onlyFavs || this.favoritos.has(p.cca3);
      return match && fav;
    });
  }

  toggleFavorito(code: string) {
    if (this.favoritos.has(code)) this.favoritos.delete(code);
    else this.favoritos.add(code);

    // Guardar en backend
this.http.post(`https://localhost:7236/api/favorites/countries/${this.userId}`, [...this.favoritos])
    .subscribe({ error: err => console.error('Error guardando favoritos', err) });

    this.filtrar();
  }

  esFavorito(code: string) {
    return this.favoritos.has(code);
  }

  toggleDrop(code: string) {
    this.dropActivo = this.dropActivo === code ? null : code;
  }
}
