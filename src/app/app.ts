import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertBox } from './components/alert-box/alert-box';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertBox],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ManagerFrontend-Web');
}
