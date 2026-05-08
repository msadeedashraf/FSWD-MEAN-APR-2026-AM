import { Routes } from '@angular/router';

import { ProductsPage } from './pages/products-page/products-page';
import { CartPage } from './pages/cart-page/cart-page';
import { CheckoutPage } from './pages/checkout-page/checkout-page';

export const routes: Routes = [
  /*
    Default route.

    If the user visits:
    /

    Angular redirects them to:
    /products
  */
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },

  /*
    Products page route.

    URL:
    /products
  */
  {
    path: 'products',
    component: ProductsPage
  },

  /*
    Cart page route.

    URL:
    /cart
  */
  {
    path: 'cart',
    component: CartPage
  },

  /*
    Checkout page route.

    URL:
    /checkout
  */
  {
    path: 'checkout',
    component: CheckoutPage
  },

  /*
    Wildcard route.

    If the user enters an unknown URL,
    send them back to products.
  */
  {
    path: '**',
    redirectTo: 'products'
  }
];