import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-cart-summary',

  /*
    CurrencyPipe is needed for cart totals.
  */
  imports: [CurrencyPipe],

  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.css'
})
export class CartSummary {
  /*
    CartSummary now uses the shared store directly.
  */
  store = inject(StoreService);
}