import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-product-list',

  /*
    CurrencyPipe is needed for product prices.
  */
  imports: [CurrencyPipe],

  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  /*
    ProductList now talks directly to the shared store.
  */
  store = inject(StoreService);
}