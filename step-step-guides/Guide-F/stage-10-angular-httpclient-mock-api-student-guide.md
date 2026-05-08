# Stage 10 — Loading Products from a Mock API with HttpClient

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By Stage 9, the storefront has become much more realistic.

The app already has:

- product listing page
- product details page
- cart page
- checkout page
- checkout form
- validation
- shared `StoreService`
- cart persistence with `localStorage`
- routing
- dynamic routing
- product details using route parameters
- cart state shared across pages

This is already a strong Angular project.

But there is still one major weakness.

The product data is still hardcoded inside the service.

Example:

```ts
products = signal<Product[]>([
  { id: 1, name: 'Wireless Headphones', ... },
  { id: 2, name: 'Mechanical Keyboard', ... }
]);
```

That works for learning, but real applications do not usually keep product data hardcoded in TypeScript.

Stage 10 fixes that.

---

# 1. What Is Stage 10 For?

Stage 10 introduces **API-style data loading**.

Instead of hardcoding products directly inside `StoreService`, we will load product data from a JSON file.

This teaches the foundation of real frontend development:

```txt
Angular app
    ↓
loads data from a source
    ↓
stores it in state
    ↓
UI updates automatically
```

For now, the source will be a local JSON file.

Later, it can become a real backend API.

---

# 2. What Problem Are We Solving?

Before Stage 10:

```txt
Products live inside TypeScript code.
```

That means if we want to change products, we must edit the Angular service.

That is not realistic.

After Stage 10:

```txt
Products live in a JSON file.
Angular loads them using HttpClient.
```

This is closer to real apps.

---

# 3. Stage 10 Learning Goals

By the end of Stage 10, students should understand:

- why hardcoded data is limited
- what a mock API is
- what `HttpClient` is
- how Angular loads data from a JSON file
- why async data needs loading states
- why apps need error states
- how API data goes into a signal
- how computed signals still work after data is loaded
- how product details continue to work with loaded data

---

# 4. Stage 10 Mental Model

The project has grown like this:

```txt
Stage 1  → Static HTML/CSS
Stage 2  → Angular template
Stage 3  → Signals
Stage 4  → UX polish
Stage 5  → Components
Level 4  → Service
Level 5  → Routing
Stage 6  → Dynamic routing
Stage 7  → localStorage cart persistence
Stage 8  → Product polish
Stage 9  → Checkout form and validation
Stage 10 → Load product data from mock API
```

Stage 10 changes where the product data comes from.

---

# 5. What Is a Mock API?

A mock API is fake API data used during development.

Instead of building a full backend immediately, we use a JSON file like:

```txt
public/data/products.json
```

Angular can load this file using HTTP.

This lets students learn the frontend API pattern before building a backend.

---

# 6. Why Use a JSON File?

A JSON file is simple and beginner-friendly.

It looks like real API data.

Example:

```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "category": "Audio",
    "price": 99,
    "stock": 5
  }
]
```

This is easy to understand.

Later, this JSON file can be replaced with a real API endpoint.

---

# 7. Before and After

## Before Stage 10

```txt
StoreService contains product array directly.
```

```ts
products = signal<Product[]>([
  { id: 1, name: 'Wireless Headphones', ... }
]);
```

## After Stage 10

```txt
products.json contains product data.
StoreService loads products using HttpClient.
```

```ts
this.http.get<Product[]>('/data/products.json')
```

---

# 8. Important Architecture Rule

The product data should still end up in the service.

Do not load products separately inside every component.

Bad:

```txt
ProductList loads products
ProductDetailsPage loads products again
Checkout loads products again
```

Good:

```txt
StoreService loads products once
Components read products from StoreService
```

The service remains the shared data layer.

---

# 9. Step 1 — Update the Product Model

Open:

```txt
src/app/models/store.models.ts
```

By Stage 8 or Stage 9, your product model may already include image and description fields.

Use this final version.

## `store.models.ts`

```ts
export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;

  /*
    Product image shown on product cards and details page.
  */
  imageUrl: string;

  /*
    Short description shown on cards or details page.
  */
  description: string;

  /*
    Optional extra product details.
  */
  deliveryText: string;
  ratingCount: number;
};

export type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;

  /*
    Optional but useful so cart can show small product image later.
  */
  imageUrl?: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: string[];
};
```

---

# 10. Why Update the Product Model?

Because real product data usually includes more than:

```txt
name
price
stock
```

A real product needs:

```txt
image
description
rating count
delivery info
```

The model tells Angular and TypeScript what a product should look like.

---

# 11. Step 2 — Create the JSON Data File

Create this folder:

```txt
public/data/
```

Then create this file:

```txt
public/data/products.json
```

## `public/data/products.json`

```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "category": "Audio",
    "price": 99,
    "stock": 5,
    "rating": "★★★★☆",
    "ratingCount": 128,
    "imageUrl": "https://placehold.co/600x400?text=Headphones",
    "description": "Comfortable wireless headphones with clear sound and long battery life.",
    "deliveryText": "Free delivery available by tomorrow."
  },
  {
    "id": 2,
    "name": "Mechanical Keyboard",
    "category": "Accessories",
    "price": 75,
    "stock": 4,
    "rating": "★★★★★",
    "ratingCount": 94,
    "imageUrl": "https://placehold.co/600x400?text=Keyboard",
    "description": "Responsive mechanical keyboard designed for typing, gaming, and productivity.",
    "deliveryText": "Ships within 24 hours."
  },
  {
    "id": 3,
    "name": "Gaming Mouse",
    "category": "Accessories",
    "price": 40,
    "stock": 6,
    "rating": "★★★★☆",
    "ratingCount": 211,
    "imageUrl": "https://placehold.co/600x400?text=Mouse",
    "description": "Lightweight gaming mouse with accurate tracking and ergonomic grip.",
    "deliveryText": "Free delivery on orders over $50."
  },
  {
    "id": 4,
    "name": "24 Inch Monitor",
    "category": "Displays",
    "price": 220,
    "stock": 3,
    "rating": "★★★★☆",
    "ratingCount": 67,
    "imageUrl": "https://placehold.co/600x400?text=Monitor",
    "description": "Full HD monitor for work, study, streaming, and everyday productivity.",
    "deliveryText": "Delivery available this week."
  },
  {
    "id": 5,
    "name": "HD Webcam",
    "category": "Cameras",
    "price": 60,
    "stock": 7,
    "rating": "★★★★☆",
    "ratingCount": 143,
    "imageUrl": "https://placehold.co/600x400?text=Webcam",
    "description": "HD webcam for online classes, video meetings, and content creation.",
    "deliveryText": "Usually ships in 1 to 2 days."
  },
  {
    "id": 6,
    "name": "Bluetooth Speaker",
    "category": "Audio",
    "price": 120,
    "stock": 2,
    "rating": "★★★★☆",
    "ratingCount": 76,
    "imageUrl": "https://placehold.co/600x400?text=Speaker",
    "description": "Portable Bluetooth speaker with strong sound and rechargeable battery.",
    "deliveryText": "Only a few left. Order soon."
  }
]
```

---

# 12. Why Put JSON in `public/data`?

Angular serves files from the `public` folder.

That means this file can be accessed in the browser using:

```txt
/data/products.json
```

So the app can load it with:

```ts
this.http.get<Product[]>('/data/products.json')
```

---

# 13. Step 3 — Enable HttpClient

Angular needs `HttpClient` to make HTTP requests.

In newer standalone Angular apps, open:

```txt
src/app/app.config.ts
```

Make sure it includes `provideHttpClient`.

## `app.config.ts`

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    /*
      This makes HttpClient available in the app.
    */
    provideHttpClient()
  ]
};
```

---

# 14. Common Problem: HttpClient Not Provided

If you forget:

```ts
provideHttpClient()
```

you may get an error saying Angular cannot provide `HttpClient`.

That means the app does not know how to create the HTTP service.

The fix is to add:

```ts
provideHttpClient()
```

in `app.config.ts`.

---

# 15. Step 4 — Update StoreService Imports

Open:

```txt
src/app/services/store.service.ts
```

Update the imports.

## Add `HttpClient`

```ts
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem, FooterColumn, NavLink, Product } from '../models/store.models';
```

## Why?

We need:

```ts
HttpClient
```

to load the product JSON file.

We need:

```ts
inject
```

to inject `HttpClient` into the service.

---

# 16. Step 5 — Inject HttpClient in StoreService

Inside the `StoreService` class, add:

```ts
private http = inject(HttpClient);
```

## Why private?

Only the service should use `http` internally.

Components should not call:

```ts
store.http.get(...)
```

That would expose too much.

The service should provide clean methods like:

```ts
loadProducts()
```

---

# 17. Step 6 — Add Loading and Error Signals

Inside `StoreService`, add:

```ts
productsLoading = signal(false);
productsError = signal('');
```

## Why?

HTTP data is not instant.

When the app requests products, three things can happen:

```txt
loading
success
error
```

The UI should be able to show those states.

---

# 18. Step 7 — Change Products Signal to Start Empty

Before Stage 10, products were hardcoded:

```ts
products = signal<Product[]>([
  ...
]);
```

Now change it to:

```ts
products = signal<Product[]>([]);
```

## Why?

The products will come from the JSON file.

At the beginning, the list is empty.

After HTTP loads data, the signal will be filled.

---

# 19. Step 8 — Add `loadProducts()` Method

Inside `StoreService`, add:

```ts
loadProducts() {
  this.productsLoading.set(true);
  this.productsError.set('');

  this.http.get<Product[]>('/data/products.json').subscribe({
    next: products => {
      this.products.set(products);
      this.productsLoading.set(false);
    },
    error: () => {
      this.productsError.set('Could not load products. Please try again later.');
      this.productsLoading.set(false);
    }
  });
}
```

---

# 20. How `loadProducts()` Works

```ts
this.productsLoading.set(true);
```

The app is now loading.

```ts
this.productsError.set('');
```

Clear old errors.

```ts
this.http.get<Product[]>('/data/products.json')
```

Request the JSON file.

```ts
next: products => { ... }
```

Runs if loading succeeds.

```ts
error: () => { ... }
```

Runs if loading fails.

---

# 21. What Is `subscribe()`?

HTTP requests are asynchronous.

That means Angular asks for data, but the data comes back later.

`subscribe()` tells Angular:

```txt
When the data comes back, run this code.
```

In this stage:

```ts
next
```

means success.

```ts
error
```

means failure.

---

# 22. Step 9 — Call `loadProducts()` in the Constructor

Your constructor currently loads cart from localStorage.

Update it:

```ts
constructor() {
  this.loadCartFromStorage();
  this.loadProducts();
}
```

## Why?

When the service starts, we want to:

```txt
restore cart
load products
```

So the app is ready.

---

# 23. Step 10 — Update `addToCart()` to Include imageUrl

Since `CartItem` now can store `imageUrl`, update the new cart item.

Inside `addToCart()`, change the new item object to:

```ts
{
  id: product.id,
  name: product.name,
  category: product.category,
  price: product.price,
  quantity: 1,
  stock: product.stock,
  imageUrl: product.imageUrl
}
```

## Why?

This lets the cart display product images later.

It is optional, but useful.

---

# 24. Full Important StoreService Changes

Your `StoreService` should now include these key parts:

```ts
private http = inject(HttpClient);

productsLoading = signal(false);
productsError = signal('');

products = signal<Product[]>([]);

constructor() {
  this.loadCartFromStorage();
  this.loadProducts();
}

loadProducts() {
  this.productsLoading.set(true);
  this.productsError.set('');

  this.http.get<Product[]>('/data/products.json').subscribe({
    next: products => {
      this.products.set(products);
      this.productsLoading.set(false);
    },
    error: () => {
      this.productsError.set('Could not load products. Please try again later.');
      this.productsLoading.set(false);
    }
  });
}
```

Do not delete your existing cart methods.

You are only changing where products come from.

---

# 25. Step 11 — Update ProductList Loading UI

Open:

```txt
src/app/components/product-list/product-list.html
```

Before showing products, check loading and error states.

Use this structure:

```html
<section id="products" class="products-section">
  <div class="section-title-row">
    <div>
      <h2>Featured Products</h2>
      <p>Products loaded from a mock JSON API</p>
    </div>
  </div>

  @if (store.productsLoading()) {
    <div class="empty-panel">
      <p>Loading products...</p>
    </div>
  } @else if (store.productsError()) {
    <div class="empty-panel error-panel">
      <p>{{ store.productsError() }}</p>
      <button class="retry-btn" (click)="store.loadProducts()">
        Try Again
      </button>
    </div>
  } @else if (store.filteredProducts().length === 0) {
    <div class="empty-panel">
      <p>No matching products found.</p>
    </div>
  } @else {
    <div class="products-grid">
      @for (product of store.filteredProducts(); track product.id) {
        <article class="product-card">
          <img
            class="product-image"
            [src]="product.imageUrl"
            [alt]="product.name"
          />

          <h3>{{ product.name }}</h3>

          <p class="product-category">Category: {{ product.category }}</p>
          <p class="product-rating">
            {{ product.rating }} <span>({{ product.ratingCount }})</span>
          </p>
          <p class="product-price">{{ product.price | currency }}</p>
          <p class="product-stock">Stock: {{ product.stock }}</p>
          <p class="product-description">{{ product.description }}</p>

          @if (store.cartQuantityForProduct(product.id) > 0) {
            <p class="in-cart-message">
              In cart: {{ store.cartQuantityForProduct(product.id) }} / {{ product.stock }}
            </p>
          }

          <div class="product-actions">
            <a
              class="details-link"
              [routerLink]="['/products', product.id]"
            >
              View Details
            </a>

            <button
              class="cart-btn"
              (click)="store.addToCart(product)"
              [disabled]="store.isProductMaxed(product)"
            >
              @if (store.isProductMaxed(product)) {
                Max Stock Reached
              } @else {
                Add to Cart
              }
            </button>
          </div>
        </article>
      }
    </div>
  }
</section>
```

---

# 26. Important ProductList Imports

If `ProductList` uses `routerLink`, make sure it imports `RouterLink`.

Open:

```txt
src/app/components/product-list/product-list.ts
```

Use:

```ts
import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  store = inject(StoreService);
}
```

---

# 27. Step 12 — Update ProductList CSS for Images

Open:

```txt
src/app/components/product-list/product-list.css
```

If you previously used a div for image placeholders, update the image styles.

```css
.product-image {
  width: 100%;
  height: 170px;
  object-fit: cover;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  margin-bottom: 14px;
}

.product-description {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.4;
}

.error-panel {
  border-color: #fecaca;
  background: #fef2f2;
  color: #991b1b;
}

.retry-btn {
  margin-top: 12px;
  border: 1px solid #991b1b;
  background: white;
  color: #991b1b;
  padding: 9px 14px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}
```

---

# 28. Step 13 — Update Product Details Page

The details page should also handle loading and error states.

Open:

```txt
src/app/pages/product-details-page/product-details-page.html
```

Use this structure:

```html
<main class="details-page">
  @if (store.productsLoading()) {
    <section class="not-found-card">
      <h1>Loading product...</h1>
      <p>Please wait while we load the product details.</p>
    </section>
  } @else if (store.productsError()) {
    <section class="not-found-card">
      <h1>Could Not Load Product</h1>
      <p>{{ store.productsError() }}</p>
      <button class="cart-btn" (click)="store.loadProducts()">Try Again</button>
    </section>
  } @else if (product()) {
    <section class="details-card">
      <img
        class="details-image"
        [src]="product()!.imageUrl"
        [alt]="product()!.name"
      />

      <div class="details-info">
        <a routerLink="/products" class="back-link">
          ← Back to Products
        </a>

        <p class="category">
          {{ product()!.category }}
        </p>

        <h1>
          {{ product()!.name }}
        </h1>

        <p class="rating">
          {{ product()!.rating }} ({{ product()!.ratingCount }} reviews)
        </p>

        <p class="price">
          {{ product()!.price | currency }}
        </p>

        <p class="description">
          {{ product()!.description }}
        </p>

        <p class="delivery">
          {{ product()!.deliveryText }}
        </p>

        <p class="stock">
          Stock Available: {{ product()!.stock }}
        </p>

        @if (quantityInCart() > 0) {
          <p class="in-cart-message">
            In cart: {{ quantityInCart() }} / {{ product()!.stock }}
          </p>
        }

        <div class="actions">
          <button
            class="cart-btn"
            (click)="store.addToCart(product()!)"
            [disabled]="isMaxed()"
          >
            @if (isMaxed()) {
              Max Stock Reached
            } @else {
              Add to Cart
            }
          </button>

          <a routerLink="/cart" class="cart-link">
            View Cart
          </a>
        </div>
      </div>
    </section>
  } @else {
    <section class="not-found-card">
      <h1>Product Not Found</h1>
      <p>The product you are looking for does not exist.</p>
      <a routerLink="/products" class="cart-link">
        Back to Products
      </a>
    </section>
  }
</main>
```

---

# 29. Why Product Details Needs Loading State

Before Stage 10, products existed immediately because they were hardcoded.

After Stage 10, products load asynchronously.

That means this can happen:

```txt
User opens /products/3
        ↓
Details page appears
        ↓
Products are still loading
        ↓
Product is not available yet
```

Without a loading state, the page might incorrectly show:

```txt
Product Not Found
```

even though the product is just not loaded yet.

That is why loading state matters.

---

# 30. Step 14 — Update Product Details CSS for Image

Open:

```txt
src/app/pages/product-details-page/product-details-page.css
```

Update `.details-image`:

```css
.details-image {
  width: 100%;
  min-height: 420px;
  object-fit: cover;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
}

.description {
  color: #374151;
  line-height: 1.6;
  margin: 0 0 14px;
}

.delivery {
  color: #166534;
  font-weight: 700;
  margin: 0 0 14px;
}
```

---

# 31. Step 15 — Test the App

Run:

```bash
ng serve
```

Test:

```txt
/products
/products/1
/products/2
/cart
/checkout
```

Expected:

- products load from JSON
- product cards show images
- product details page works
- cart still works
- checkout still works

---

# 32. Step 16 — Test Error State

To test error state, temporarily break the URL:

```ts
this.http.get<Product[]>('/data/wrong-file-name.json')
```

Expected:

```txt
Could not load products. Please try again later.
Try Again button appears.
```

Then fix it back:

```ts
this.http.get<Product[]>('/data/products.json')
```

---

# 33. Common Errors and Fixes

## Error: HttpClient provider missing

Fix:

Add `provideHttpClient()` in `app.config.ts`.

```ts
import { provideHttpClient } from '@angular/common/http';

providers: [
  provideRouter(routes),
  provideHttpClient()
]
```

---

## Error: Products do not load

Check file path:

```txt
public/data/products.json
```

and request path:

```ts
'/data/products.json'
```

---

## Error: Product images do not display

Check that each product has:

```json
"imageUrl": "https://placehold.co/600x400?text=Headphones"
```

and template uses:

```html
[src]="product.imageUrl"
```

---

## Error: Product details says Product Not Found for valid product

Possible reason:

Products are still loading.

Make sure the template checks:

```html
@if (store.productsLoading())
```

before checking:

```html
@else if (product())
```

---

# 34. Stage 10 Data Flow

## Product loading

```txt
App starts
        ↓
StoreService constructor runs
        ↓
loadProducts()
        ↓
HttpClient requests /data/products.json
        ↓
products signal updates
        ↓
filteredProducts recomputes
        ↓
ProductList updates
```

---

## Product details loading

```txt
User opens /products/2
        ↓
ProductDetailsPage reads id = 2
        ↓
StoreService loads products
        ↓
getProductById(2)
        ↓
Page displays matching product
```

---

# 35. What Students Should Be Able to Explain

At the end of Stage 10, students should explain:

- why hardcoded product data is limited
- what a mock API is
- why JSON is useful
- what `HttpClient` does
- what `subscribe()` does
- why loading states matter
- why error states matter
- how loaded data enters a signal
- why `StoreService` still owns product state

---

# 36. Teacher Explanation Script

Use this in class:

> Until now, our products lived directly inside the TypeScript service.  
> That was useful for learning, but real apps usually load data from somewhere.  
> In this stage, we move products into a JSON file and use HttpClient to load them.  
> The service still owns the product state, but the data now comes from an external source.  
> This is the first step toward API-driven Angular applications.

---

# 37. Brutal Mentor Warning

Do not let students think API loading is just changing where the array sits.

The real concept is this:

```txt
Data is no longer guaranteed to exist immediately.
```

That means we need:

```txt
loading states
error states
empty states
```

That is real frontend thinking.

---

# 38. What Stage 10 Should Not Do Yet

Do not add:

```txt
real database
real backend
authentication
admin product editor
checkout API
payment processing
```

Stage 10 is only about:

```txt
mock API and HttpClient
```

Keep the lesson focused.

---

# 39. Classroom Checkpoints

Use these checkpoints.

## Checkpoint 1

Create `products.json`.

Open `/data/products.json` in browser and confirm data appears.

## Checkpoint 2

Add `provideHttpClient()`.

App still compiles.

## Checkpoint 3

Inject `HttpClient`.

App still compiles.

## Checkpoint 4

Replace hardcoded products with empty signal.

Products temporarily disappear.

## Checkpoint 5

Add `loadProducts()`.

Products appear again from JSON.

## Checkpoint 6

Add loading and error UI.

App handles different data states.

## Checkpoint 7

Product details page works with API-loaded data.

---

# 40. What Comes Next?

After Stage 10, good next stages are:

## Stage 11 — Backend API

Replace the local JSON file with a real backend.

Example:

```txt
GET /api/products
POST /api/orders
```

## Stage 12 — Order History

Save completed orders and display them.

## Stage 13 — Authentication

Add user login and user-specific orders.

---

# 41. Final Summary

Stage 10 moves the app from:

```txt
hardcoded frontend data
```

to:

```txt
mock API data loading
```

The key tools are:

```txt
HttpClient
JSON file
signals
loading state
error state
StoreService
```

The biggest mindset shift is:

> Real app data may arrive later, fail, or be empty.  
> Good apps handle all of those states.
