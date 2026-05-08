import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { ProductList } from '../../components/product-list/product-list';
import { CartSummary } from '../../components/cart-summary/cart-summary';

@Component({
  selector: 'app-products-page',
  imports: [Hero, ProductList, CartSummary],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage {}
