import { Component } from '@angular/core';

import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',

  /*
    App still imports the components it displays.
    But it no longer owns the storefront state.
  */
  imports:  [ RouterOutlet, Navbar, Footer],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}