import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './countries.html',
  styleUrl: './countries.css'
})
export class Countries implements OnInit {
  paises: Country[] = [];
  filtrados: Country[] = [];
  favoritos: Set<string> = new Set();
  search = '';
  onlyFavs = false;
  private LS_KEY = 'favoritos_countries';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarFavoritos();
    this.http
      .get<Country[]>('https://restcountries.com/v3.1/all?fields=name,cca3,flags,region,population,capital')
      .subscribe({
        next: (data) => {
          this.paises = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
          this.filtrar();
        },
        error: (err) => console.error('Error al cargar países', err)
      });
  }

  filtrar() {
    const q = this.search.toLowerCase().trim();
    this.filtrados = this.paises.filter((p) => {
      const match = p.name.common.toLowerCase().includes(q);
      const fav = !this.onlyFavs || this.favoritos.has(p.cca3);
      return match && fav;
    });
  }

  toggleFavorito(code: string) {
    this.favoritos.has(code) ? this.favoritos.delete(code) : this.favoritos.add(code);
    this.guardarFavoritos();
    this.filtrar();
  }

  esFavorito(code: string) {
    return this.favoritos.has(code);
  }

  private cargarFavoritos() {
    try {
      const raw = localStorage.getItem(this.LS_KEY);
      if (raw) this.favoritos = new Set(JSON.parse(raw));
    } catch {
      this.favoritos = new Set();
    }
  }

  private guardarFavoritos() {
    localStorage.setItem(this.LS_KEY, JSON.stringify([...this.favoritos]));
  }
  dropActivo: string | null = null;

toggleDrop(code: string) {
  this.dropActivo = this.dropActivo === code ? null : code;
}

}
