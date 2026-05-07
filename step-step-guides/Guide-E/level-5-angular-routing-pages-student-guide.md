# Level 5 — Angular Routing and Pages

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By the end of Level 4, the app already has a much better architecture.

We have:

- components
- `StoreService`
- shared cart state
- shared product state
- shared search state
- shared computed totals
- a cleaner `App` component

The important change in Level 4 was:

```txt
The app brain moved into StoreService.
```

Now components can read from the service and call service methods.

That prepares us perfectly for Level 5.

---

# 1. What Is Level 5 For?

Level 5 is for turning the app from **one page** into **multiple pages**.

Before Level 5, the app is still mostly one long screen.

After Level 5, the app will have routes like:

```txt
/products
/cart
/checkout
```

This makes the project feel more like a real website.

---

# 2. Level 5 Main Goal

By the end of Level 5, students should understand:

- what routing is
- why real apps use multiple pages
- what `RouterOutlet` does
- what `routerLink` does
- why `routerLink` is better than normal `href` for Angular navigation
- how to create page components
- how to define routes
- how the cart can stay shared between pages because of `StoreService`

---

# 3. Stage 5 vs Level 5

This is important.

## Stage 5

Stage 5 split the UI into smaller components.

```txt
Navbar
Hero
ProductList
CartSummary
Footer
```

Focus:

```txt
How the page is built
```

---

## Level 5

Level 5 splits the app into pages.

```txt
/products
/cart
/checkout
```

Focus:

```txt
Where the user can go
```

---

# 4. Simple Explanation

In Stage 5, we organized the page.

In Level 4, we moved the brain into a service.

In Level 5, we create actual pages.

The app now becomes more like this:

```txt
Navbar
  ↓
Products Page
  ↓
Cart Page
  ↓
Checkout Page
  ↓
Footer
```

---

# 5. Why Routing Comes After Services

This order matters.

If we added routing before moving cart state into a service, we could easily run into this problem:

```txt
Go to products page
Add product to cart
Go to cart page
Cart data is missing or duplicated
```

But because the cart now lives in `StoreService`, all pages can share the same cart.

That is why Level 4 comes before Level 5.

---

# 6. Level 5 Mental Model

Think of the app like a shopping mall.

## Before Level 5

Everything is in one big room.

```txt
Products + Cart + Checkout all together
```

## After Level 5

The store has separate areas.

```txt
/products  → product shelves
/cart      → cart review area
/checkout  → final order area
```

The customer can move between areas.

Angular Router controls that movement.

---

# 7. What We Are Building

In Level 5, we will create:

```txt
ProductsPage
CartPage
CheckoutPage
```

And we will update the app so the main layout becomes:

```txt
Navbar
Current route page
Footer
```

The changing part is handled by:

```html
<router-outlet />
```

---

# 8. Updated Folder Structure

After Level 5, your structure should look like this:

```txt
src/app/
├── components/
│   ├── navbar/
│   ├── hero/
│   ├── product-list/
│   ├── cart-summary/
│   └── footer/
├── pages/
│   ├── products-page/
│   │   ├── products-page.ts
│   │   ├── products-page.html
│   │   └── products-page.css
│   ├── cart-page/
│   │   ├── cart-page.ts
│   │   ├── cart-page.html
│   │   └── cart-page.css
│   └── checkout-page/
│       ├── checkout-page.ts
│       ├── checkout-page.html
│       └── checkout-page.css
├── services/
│   └── store.service.ts
├── models/
│   └── store.models.ts
├── app.routes.ts
├── app.ts
├── app.html
└── app.css
```

---

# 9. Step 1 — Generate Page Components

Run these commands:

```bash
ng generate component pages/products-page
ng generate component pages/cart-page
ng generate component pages/checkout-page
```

These are page components.

A page component represents a full screen or major route.

---

# 10. Components vs Pages

This distinction matters.

## Components

Reusable pieces of UI:

```txt
Navbar
ProductList
CartSummary
Footer
```

## Pages

Full route screens:

```txt
ProductsPage
CartPage
CheckoutPage
```

A page usually uses multiple smaller components.

Example:

```txt
ProductsPage
├── Hero
├── ProductList
└── CartSummary
```

---

# 11. Step 2 — Update `app.routes.ts`

Open:

```txt
src/app/app.routes.ts
```

Use this code.

## `app.routes.ts`

```ts
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
```

---

# 12. What Is `Routes`?

This:

```ts
export const routes: Routes = [...]
```

is the route table.

It tells Angular:

```txt
When the URL looks like this, show this component.
```

Example:

```ts
{
  path: 'cart',
  component: CartPage
}
```

Means:

```txt
When the user goes to /cart, show CartPage.
```

---

# 13. What Is `pathMatch: 'full'`?

This route:

```ts
{
  path: '',
  redirectTo: 'products',
  pathMatch: 'full'
}
```

means:

> Only redirect when the full path is empty.

So if the user visits:

```txt
/
```

Angular redirects to:

```txt
/products
```

---

# 14. What Is the Wildcard Route?

This route:

```ts
{
  path: '**',
  redirectTo: 'products'
}
```

means:

> If no other route matches, send the user to products.

Example:

```txt
/random-page
/hello
/wrong-url
```

All redirect to:

```txt
/products
```

This prevents the user from landing on a blank or broken screen.

---

# 15. Step 3 — Update `app.ts`

Open:

```txt
src/app/app.ts
```

Since routing will now control the changing page content, `App` only needs:

- Navbar
- RouterOutlet
- Footer

## `app.ts`

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',

  /*
    RouterOutlet is required because app.html uses:
    <router-outlet />
  */
  imports: [RouterOutlet, Navbar, Footer],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
```

---

# 16. Why Did We Remove ProductList and CartSummary from `app.ts`?

Before routing, `App` directly displayed everything.

After routing, page components decide what should be displayed.

So `App` should not directly import:

```txt
Hero
ProductList
CartSummary
```

Those belong inside specific pages now.

---

# 17. Step 4 — Update `app.html`

Open:

```txt
src/app/app.html
```

Replace it with:

```html
<!--
  Navbar appears on every page.
-->
<app-navbar />

<!--
  Router outlet is where Angular displays the current page.

  If URL is /products → ProductsPage appears here.
  If URL is /cart → CartPage appears here.
  If URL is /checkout → CheckoutPage appears here.
-->
<router-outlet />

<!--
  Footer appears on every page.
-->
<app-footer />
```

---

# 18. What Is `<router-outlet />`?

`<router-outlet />` is a placeholder.

Angular uses it to display the component that matches the current URL.

Example:

```txt
URL: /products
```

Angular displays:

```txt
ProductsPage
```

inside:

```html
<router-outlet />
```

---

# 19. Step 5 — Keep `app.css` Simple

`app.css` may now be empty or very small.

Since pages will control their own layouts, you can keep `app.css` simple.

## `app.css`

```css
/*
  App is now only the shell:
  Navbar + current page + footer.

  Page-specific layout belongs in each page CSS file.
*/
```

If you still need global styles, keep them in:

```txt
src/styles.css
```

---

# 20. Step 6 — Update Navbar Links in the Service

Open:

```txt
src/app/services/store.service.ts
```

Update `navLinks`.

## `store.service.ts`

```ts
navLinks: NavLink[] = [
  { label: 'Products', href: '/products' },
  { label: 'Cart', href: '/cart' },
  { label: 'Checkout', href: '/checkout' },
  { label: 'Audio', href: '/products' },
  { label: 'Accessories', href: '/products' },
  { label: 'Displays', href: '/products' },
  { label: 'Cameras', href: '/products' }
];
```

---

# 21. Why Change the Nav Links?

Before routing, links pointed to sections:

```txt
#products
```

Now the app has real routes:

```txt
/products
/cart
/checkout
```

So navbar links should navigate to routes.

---

# 22. Step 7 — Update Navbar to Use `RouterLink`

Open:

```txt
src/app/components/navbar/navbar.ts
```

Update it.

## `navbar.ts`

```ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-navbar',

  /*
    FormsModule is needed for ngModel.
    RouterLink is needed for Angular navigation.
  */
  imports: [FormsModule, RouterLink],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  store = inject(StoreService);
}
```

---

# 23. Why Import `RouterLink`?

Because we will use:

```html
<a [routerLink]="link.href">
```

instead of:

```html
<a [href]="link.href">
```

Angular needs `RouterLink` imported to understand that directive.

---

# 24. Step 8 — Update Navbar HTML Links

Open:

```txt
src/app/components/navbar/navbar.html
```

Find the nav links.

Replace this:

```html
<a [href]="link.href">{{ link.label }}</a>
```

with this:

```html
<a [routerLink]="link.href">{{ link.label }}</a>
```

---

# 25. Update Cart Box Link

Also change the cart box so clicking it opens the cart page.

Replace:

```html
<div class="cart-box">
  🛒 <strong>Cart ({{ store.totalItems() }})</strong>
</div>
```

with:

```html
<a routerLink="/cart" class="cart-box">
  🛒 <strong>Cart ({{ store.totalItems() }})</strong>
</a>
```

---

# 26. `routerLink` vs `href`

This is one of the most important Level 5 lessons.

## Normal `href`

```html
<a href="/cart">
```

This tells the browser:

```txt
Reload the page and go to /cart.
```

That can restart the Angular app.

---

## Angular `routerLink`

```html
<a routerLink="/cart">
```

This tells Angular:

```txt
Change the route inside the app without reloading the whole page.
```

That is what we want in a single-page Angular app.

---

# 27. Step 9 — Products Page

Open:

```txt
src/app/pages/products-page/products-page.ts
```

Use this.

## `products-page.ts`

```ts
import { Component } from '@angular/core';

import { Hero } from '../../components/hero/hero';
import { ProductList } from '../../components/product-list/product-list';
import { CartSummary } from '../../components/cart-summary/cart-summary';

@Component({
  selector: 'app-products-page',

  /*
    ProductsPage uses existing components.
    It does not own product/cart state.
    The components still use StoreService.
  */
  imports: [Hero, ProductList, CartSummary],

  templateUrl: './products-page.html',
  styleUrl: './products-page.css'
})
export class ProductsPage {}
```

---

# 28. Products Page HTML

Open:

```txt
src/app/pages/products-page/products-page.html
```

Use this.

## `products-page.html`

```html
<!--
  Hero introduces the products page.
-->
<app-hero />

<!--
  Products page layout:
  Left side = product list
  Right side = cart summary
-->
<main class="page-content">
  <app-product-list />
  <app-cart-summary />
</main>
```

---

# 29. Products Page CSS

Open:

```txt
src/app/pages/products-page/products-page.css
```

Use this.

## `products-page.css`

```css
.page-content {
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 16px 32px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

@media (max-width: 1100px) {
  .page-content {
    grid-template-columns: 1fr;
  }
}
```

---

# 30. What Is ProductsPage Doing?

ProductsPage does not contain much logic.

It simply decides which components belong on the products route.

```txt
/products
├── Hero
├── ProductList
└── CartSummary
```

That is clean.

---

# 31. Step 10 — Cart Page

Open:

```txt
src/app/pages/cart-page/cart-page.ts
```

Use this.

## `cart-page.ts`

```ts
import { Component } from '@angular/core';

import { CartSummary } from '../../components/cart-summary/cart-summary';

@Component({
  selector: 'app-cart-page',

  /*
    CartPage only needs CartSummary for now.
  */
  imports: [CartSummary],

  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage {}
```

---

# 32. Cart Page HTML

Open:

```txt
src/app/pages/cart-page/cart-page.html
```

Use this.

## `cart-page.html`

```html
<main class="cart-page">
  <section class="page-header">
    <h1>Your Shopping Cart</h1>
    <p>Review your selected products before checkout.</p>
  </section>

  <app-cart-summary />
</main>
```

---

# 33. Cart Page CSS

Open:

```txt
src/app/pages/cart-page/cart-page.css
```

Use this.

## `cart-page.css`

```css
.cart-page {
  max-width: 900px;
  margin: 32px auto;
  padding: 0 16px 40px;
}

.page-header {
  background: white;
  border: 1px solid #dcdfe3;
  border-radius: 6px;
  padding: 24px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 8px;
}

.page-header p {
  margin: 0;
  color: #555;
}
```

---

# 34. Important CartSummary CSS Adjustment

In earlier stages, `CartSummary` may have sticky behavior:

```css
.summary-section {
  position: sticky;
  top: 24px;
  align-self: start;
}
```

That is useful on the products page.

But on the cart page, sticky may feel strange.

For Level 5, change it to:

```css
.summary-section {
  align-self: start;
}
```

This makes `CartSummary` easier to reuse across pages.

---

# 35. Why Did We Reuse CartSummary?

This is the power of components.

The same component can be used in:

```txt
/products
/cart
```

It still works because it reads data from:

```txt
StoreService
```

That is the payoff from Level 4.

---

# 36. Step 11 — Checkout Page

Open:

```txt
src/app/pages/checkout-page/checkout-page.ts
```

Use this.

## `checkout-page.ts`

```ts
import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-checkout-page',

  /*
    CurrencyPipe formats totals.
    RouterLink lets us link back to products.
  */
  imports: [CurrencyPipe, RouterLink],

  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css'
})
export class CheckoutPage {
  /*
    Checkout page needs cart data and order methods.
  */
  store = inject(StoreService);
}
```

---

# 37. Checkout Page HTML

Open:

```txt
src/app/pages/checkout-page/checkout-page.html
```

Use this.

## `checkout-page.html`

```html
<main class="checkout-page">
  <section class="checkout-card">
    <h1>Checkout</h1>

    <!--
      If cart is empty, show a friendly message.
    -->
    @if (store.cart().length === 0) {
      <p>Your cart is empty.</p>

      <a routerLink="/products" class="continue-btn">
        Continue Shopping
      </a>
    } @else {
      <!--
        Show each item in the cart.
      -->
      <div class="checkout-list">
        @for (item of store.cart(); track item.id) {
          <div class="checkout-item">
            <div>
              <strong>{{ item.name }}</strong>
              <p>{{ item.price | currency }} x {{ item.quantity }}</p>
            </div>

            <span>{{ item.price * item.quantity | currency }}</span>
          </div>
        }
      </div>

      <div class="checkout-total">
        <strong>Total:</strong>
        <strong>{{ store.cartTotal() | currency }}</strong>
      </div>

      <button
        class="place-order-btn"
        (click)="store.placeOrder()"
      >
        Place Order
      </button>

      @if (store.orderMessage()) {
        <div
          class="status-box"
          [class.success]="store.orderPlaced()"
          [class.error]="!store.orderPlaced()"
        >
          {{ store.orderMessage() }}
        </div>
      }
    }
  </section>
</main>
```

---

# 38. Checkout Page CSS

Open:

```txt
src/app/pages/checkout-page/checkout-page.css
```

Use this.

## `checkout-page.css`

```css
.checkout-page {
  max-width: 800px;
  margin: 32px auto;
  padding: 0 16px 40px;
}

.checkout-card {
  background: white;
  border: 1px solid #dcdfe3;
  border-radius: 6px;
  padding: 24px;
}

.checkout-card h1 {
  margin-top: 0;
}

.checkout-list {
  display: grid;
  gap: 12px;
  margin: 20px 0;
}

.checkout-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

.checkout-item p {
  margin: 4px 0 0;
  color: #666;
}

.checkout-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  border-top: 2px solid #111827;
  padding-top: 16px;
  margin-top: 16px;
}

.place-order-btn,
.continue-btn {
  display: inline-block;
  margin-top: 20px;
  border: 1px solid #d1a000;
  background: #ffd814;
  color: #111;
  padding: 11px 18px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}

.place-order-btn:hover,
.continue-btn:hover {
  background: #f7ca00;
}

.status-box {
  margin-top: 16px;
  padding: 14px;
  border-radius: 6px;
  font-weight: 700;
}

.status-box.success {
  background: #dcfce7;
  color: #166534;
}

.status-box.error {
  background: #fee2e2;
  color: #991b1b;
}
```

---

# 39. What Makes CheckoutPage Different?

Unlike ProductsPage and CartPage, CheckoutPage directly injects `StoreService`.

Why?

Because CheckoutPage has its own page-specific layout.

It needs to display:

- cart items
- total
- order button
- order message

It does not need to reuse the full `CartSummary`.

So it reads from the service directly.

---

# 40. Step 12 — Test the App

Run:

```bash
ng serve
```

Test these URLs:

```txt
/products
/cart
/checkout
/random
```

Expected behavior:

## `/products`

Shows:

```txt
Hero
ProductList
CartSummary
```

## `/cart`

Shows:

```txt
Shopping cart page
CartSummary
```

## `/checkout`

Shows:

```txt
Checkout page
```

## `/random`

Redirects to:

```txt
/products
```

---

# 41. Test Cart Across Pages

This is the most important Level 5 test.

1. Go to `/products`
2. Add Wireless Headphones to cart
3. Click Cart in navbar
4. Cart should still contain the item
5. Go to `/checkout`
6. Checkout should show the same cart item

If this works, your service architecture is doing its job.

---

# 42. Why Cart Still Works Across Pages

Because the cart lives in:

```txt
StoreService
```

not inside one page.

If cart lived inside `ProductsPage`, then `CartPage` would not automatically have it.

Shared state belongs in a shared service.

That is the key Level 4 + Level 5 connection.

---

# 43. Level 5 Data Flow

## Route navigation

```txt
User clicks Cart link
        ↓
Angular Router changes URL to /cart
        ↓
router-outlet displays CartPage
        ↓
CartPage shows CartSummary
        ↓
CartSummary reads cart from StoreService
```

---

## Checkout flow

```txt
User adds product on /products
        ↓
StoreService.cart updates
        ↓
User navigates to /checkout
        ↓
CheckoutPage reads StoreService.cart
        ↓
Checkout shows the selected products
```

---

# 44. Important Teaching Point

Routing changes which page the user sees.

Routing does not automatically manage your data.

That is why we still need:

```txt
StoreService
```

The router controls screens.

The service controls shared state.

---

# 45. Common Errors and Fixes

## Error: `router-outlet` is not a known element

Fix:

Import `RouterOutlet` in `app.ts`.

```ts
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, Navbar, Footer]
})
```

---

## Error: Can't bind to `routerLink`

Fix:

Import `RouterLink` in the component using it.

Example:

```ts
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink]
})
```

For navbar:

```ts
imports: [FormsModule, RouterLink]
```

---

## Error: Route does not open page

Check `app.routes.ts`.

Make sure the route exists:

```ts
{
  path: 'cart',
  component: CartPage
}
```

---

## Error: Page component not found

Check the import path.

Example:

```ts
import { CartPage } from './pages/cart-page/cart-page';
```

The file path must match your generated folder.

---

## Error: Cart disappears between pages

This means cart state may still be inside a component.

Cart should live in:

```ts
StoreService
```

and components should use:

```ts
store = inject(StoreService);
```

---

## Error: Clicking link reloads the whole app

You may be using:

```html
href="/cart"
```

Instead use:

```html
routerLink="/cart"
```

or:

```html
[routerLink]="link.href"
```

---

# 46. Classroom Checkpoints

Use these checkpoints while teaching.

## Checkpoint 1

Page components are generated.

The app still compiles.

---

## Checkpoint 2

Routes are added to `app.routes.ts`.

Typing `/products` opens ProductsPage.

---

## Checkpoint 3

`app.html` uses `<router-outlet />`.

The correct page appears inside it.

---

## Checkpoint 4

Navbar uses `routerLink`.

Clicking Cart changes the route without a full reload.

---

## Checkpoint 5

ProductsPage displays the hero, product list, and cart summary.

---

## Checkpoint 6

CartPage displays the cart summary.

---

## Checkpoint 7

CheckoutPage displays cart items and total.

---

## Checkpoint 8

Cart state stays available across `/products`, `/cart`, and `/checkout`.

---

# 47. What Students Should Be Able to Explain

At the end of Level 5, students should explain:

- what Angular routing is
- what a route table is
- what `router-outlet` does
- what `routerLink` does
- why `href` is not ideal for Angular navigation
- what a page component is
- how page components are different from reusable UI components
- why the cart survives between pages
- why `StoreService` is important for routing

---

# 48. Teacher Explanation Script

Use this in class:

> In the last level, we moved the app brain into a service.  
> Now we can safely split the app into pages.  
> The router decides which page to show.  
> The service keeps the cart and product state alive while users move between pages.  
> This is how we move from a one-page demo to a real app structure.

---

# 49. Brutal Warning

Do not confuse routing with state management.

Routing answers:

```txt
Which page should the user see?
```

State management answers:

```txt
What data should the app remember?
```

They are related, but they are not the same.

---

# 50. Level 5 Summary

Level 5 adds:

- Angular routes
- `ProductsPage`
- `CartPage`
- `CheckoutPage`
- `RouterOutlet`
- `RouterLink`
- page-based layout
- route fallback
- shared cart across pages

The app now feels like a real multi-page Angular application.

---

# 51. What Comes Next?

After Level 5, the next step is Stage 6.

Stage 6 adds:

```txt
/products/:id
```

That means:

```txt
Product details pages
```

Level 5 teaches basic pages.

Stage 6 teaches dynamic pages.

---

# 52. Final Mental Model

```txt
Level 4 → StoreService owns shared state
Level 5 → Router controls pages
Stage 6 → Route parameters control page data
```

Or even simpler:

```txt
Service = memory
Router = navigation
Page = screen
Component = reusable part
```

