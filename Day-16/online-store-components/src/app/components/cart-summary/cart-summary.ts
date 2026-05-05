import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '../../app';

@Component({
  selector: 'app-cart-summary',
  imports: [CurrencyPipe],
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.css',
})
export class CartSummary {

 @Input() cart: CartItem[] = [];
  @Input() totalItems = 0;
  @Input() cartTotal = 0;
  @Input() orderPlaced = false;
  @Input() orderMessage = '';

  @Output() increase = new EventEmitter<number>();
  @Output() decrease = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();
  @Output() clear = new EventEmitter<void>();
  @Output() placeOrder = new EventEmitter<void>();

}
