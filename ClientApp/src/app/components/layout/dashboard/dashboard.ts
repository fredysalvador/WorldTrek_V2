import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../pages/user/user';
import { Countries } from '../../pages/countries/countries';
import { Settings } from '../../pages/settings/settings';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, User, Countries, Settings],  
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  showUser = false;
  showSettings = false;
  showCountries = false;

  toggle(component: string) {
    this.showUser = component === 'user';
    this.showSettings = component === 'settings';
    this.showCountries = component === 'countries';
  }
}
