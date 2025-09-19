import { Component } from '@angular/core';
import { Dashboard } from './components/layout/dashboard/dashboard';

@Component({
  selector: 'app-root',
  imports: [Dashboard],
  template: `<app-dashboard></app-dashboard>`,
  styleUrls: ['./app.css']
})
export class App {}
