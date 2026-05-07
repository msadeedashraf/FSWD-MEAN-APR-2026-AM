import { Component } from '@angular/core';

import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { ProductList } from './components/product-list/product-list';
import { CartSummary } from './components/cart-summary/cart-summary';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',

  /*
    App still imports the components it displays.
    But it no longer owns the storefront state.
  */
  imports: [Navbar, Hero, ProductList, CartSummary, Footer],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}