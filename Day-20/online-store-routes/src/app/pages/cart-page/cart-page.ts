import { Component } from '@angular/core';
import { CartSummary } from '../../components/cart-summary/cart-summary';

@Component({
  selector: 'app-cart-page',
  imports: [CartSummary],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {}
