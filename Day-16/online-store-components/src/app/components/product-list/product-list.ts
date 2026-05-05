import { Component, EventEmitter,Input, Output } from '@angular/core';
import { CartItem, Product } from '../../app';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

  @Input() products: Product[] = [];
  @Input() cart: CartItem[] = [];

  @Output() addProduct = new EventEmitter<Product>();


  cartQuantityForProduct(productId: number) {
    const item = this.cart.find(cartItem => cartItem.id === productId);
    return item ? item.quantity : 0;
  }

  isProductMaxed(product: Product) {
    return this.cartQuantityForProduct(product.id) >= product.stock;
  }

}
