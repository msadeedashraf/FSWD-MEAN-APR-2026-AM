# Level 4 — Moving Shared State into an Angular Service

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By the end of Stage 5, the app was split into smaller components.

We now have components like:

```txt
Navbar
Hero
ProductList
CartSummary
Footer
```

That was a big improvement.

The app no longer has one giant HTML file.

But there is still a problem.

Even though the UI is split into components, the main `App` component still owns almost all the data and logic.

---

# 1. What Problem Are We Solving in Level 4?

In Stage 5, the app structure improved.

But the state is still sitting in `app.ts`.

That means `App` still owns:

```txt
products
cart
searchText
selectedCategory
orderMessage
totalItems
cartTotal
addToCart()
increaseQuantity()
decreaseQuantity()
removeFromCart()
clearCart()
placeOrder()
```

So even after splitting the UI, `App` is still doing too much.

This is called a **fat parent component** problem.

---

# 2. Stage 5 vs Level 4

This is the most important difference.

## Stage 5

Stage 5 split the **UI** into components.

```txt
App
├── Navbar
├── Hero
├── ProductList
├── CartSummary
└── Footer
```

Focus:

```txt
How the screen is divided
```

---

## Level 4

Level 4 moves the **state and business logic** into a service.

```txt
StoreService
├── products
├── cart
├── searchText
├── selectedCategory
├── computed totals
└── cart methods
```

Focus:

```txt
Where the data lives
```

---

# 3. Simple Explanation

Think of the app like a store.

## Stage 5

We created departments:

```txt
front desk
product shelves
checkout counter
footer information board
```

## Level 4

We create the store manager's office.

The manager's office knows:

```txt
what products exist
what is in the cart
what the total is
what the current search is
what happens when someone buys something
```

That manager's office is the service.

---

# 4. Level 4 Goal

By the end of Level 4, students should understand:

- what an Angular service is
- why shared state should move out of `App`
- how `StoreService` becomes a shared data layer
- how to use `inject()`
- how components can read from a service
- how components can call service methods
- why this reduces parent-child wiring
- why services must be used carefully

---

# 5. What Will Change?

## Before Level 4

The parent component passes data down and receives events up.

```txt
App owns state
↓
passes data to children with @Input()
↑
receives events from children with @Output()
```

This is correct, but it becomes noisy as the app grows.

---

## After Level 4

The service owns the state.

Components inject the service directly.

```txt
StoreService owns state
↓
components read from service
↑
components call service methods
```

This removes a lot of repetitive `@Input()` and `@Output()` wiring.

---

# 6. Important Warning

A service is powerful.

But if students misuse it, it can become a giant global dumping ground.

Teach this rule:

> Shared app state belongs in a service. Small local UI state can stay inside a component.

---

## Good service state

These belong in `StoreService`:

```txt
products
cart
searchText
selectedCategory
totalItems
cartTotal
addToCart()
clearCart()
placeOrder()
```

Because multiple components need them.

---

## Local component state

These can stay inside a component:

```txt
isDropdownOpen
isModalOpen
showPassword
temporaryInput
hoveredCard
```

Because only one component cares about them.

---

# 7. Updated Folder Structure

We will add two new folders:

```txt
services
models
```

Final structure:

```txt
src/app/
├── app.ts
├── app.html
├── app.css
├── services/
│   └── store.service.ts
├── models/
│   └── store.models.ts
├── components/
│   ├── navbar/
│   ├── hero/
│   ├── product-list/
│   ├── cart-summary/
│   └── footer/
```

---

# 8. Step 1 — Create the Models File

A model file stores TypeScript types.

Create:

```txt
src/app/models/store.models.ts
```

---

## `store.models.ts`

```ts
/*
  Product describes one item in the store.
*/
export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;
};

/*
  CartItem describes a product after it is added to the cart.

  It includes quantity because the cart needs to know
  how many units of the product were added.
*/
export type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;
};

/*
  NavLink describes one navigation link in the navbar.
*/
export type NavLink = {
  label: string;
  href: string;
};

/*
  FooterColumn describes one section in the footer.
*/
export type FooterColumn = {
  title: string;
  links: string[];
};
```

---

# 9. Why Move Types into a Models File?

Before Level 4, types may have been exported from `app.ts`.

That works, but it is not ideal.

Bad long-term pattern:

```ts
import { Product } from '../../app';
```

Why?

Because child components should not depend on `app.ts` just to get a type.

Better pattern:

```ts
import { Product } from '../../models/store.models';
```

This is cleaner.

Models are now in one neutral place.

---

# 10. Step 2 — Generate the Service

Run:

```bash
ng generate service services/store
```

Angular will create something like:

```txt
src/app/services/store.service.ts
```

A service is a class that can be shared across components.

---

# 11. What Is `providedIn: 'root'`?

The generated service usually has:

```ts
@Injectable({
  providedIn: 'root'
})
```

This means:

> Angular creates one shared instance of this service for the whole app.

That is exactly what we want.

One store.

One cart.

One source of truth.

---

# 12. Step 3 — Create `StoreService`

Open:

```txt
src/app/services/store.service.ts
```

Replace it with this.

---

## `store.service.ts`

```ts
import { Injectable, computed, signal } from '@angular/core';
import { CartItem, FooterColumn, NavLink, Product } from '../models/store.models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  /*
    Basic store information.
    These are simple values because they do not currently change.
  */
  storeName = 'Mini Tech Store';
  location = 'Deliver to Hamilton';

  /*
    Hero content.
  */
  heroTitle = 'Tech Essentials for Everyday Use';
  heroText = 'Browse featured products, compare prices, and build your order.';

  /*
    Categories used by the search/category filter in the navbar.
  */
  categories = ['All', 'Audio', 'Accessories', 'Displays', 'Cameras'];

  /*
    Navigation links shown in the navbar.
  */
  navLinks: NavLink[] = [
    { label: 'All', href: '#products' },
    { label: "Today's Deals", href: '#products' },
    { label: 'Audio', href: '#products' },
    { label: 'Accessories', href: '#products' },
    { label: 'Monitors', href: '#products' },
    { label: 'Cameras', href: '#products' },
    { label: 'Best Sellers', href: '#products' }
  ];

  /*
    Footer data.
  */
  footerColumns: FooterColumn[] = [
    { title: 'Get to Know Us', links: ['About', 'Careers', 'Blog', 'Store Info'] },
    { title: 'Shop With Us', links: ['Audio', 'Accessories', 'Displays', 'Cameras'] },
    { title: 'Support', links: ['Your Account', 'Orders', 'Returns', 'Help Center'] },
    { title: 'Teaching Demo', links: ['Angular Services', 'Shared State', 'Signals', 'Dependency Injection'] }
  ];

  /*
    Signals hold values that can change over time.
  */
  selectedCategory = signal('All');
  searchText = signal('');
  cart = signal<CartItem[]>([]);
  orderPlaced = signal(false);
  orderMessage = signal('');

  /*
    Product data is also stored as a signal.
    This keeps the service reactive.
  */
  products = signal<Product[]>([
    { id: 1, name: 'Wireless Headphones', category: 'Audio', price: 99, stock: 5, rating: '★★★★☆' },
    { id: 2, name: 'Mechanical Keyboard', category: 'Accessories', price: 75, stock: 4, rating: '★★★★★' },
    { id: 3, name: 'Gaming Mouse', category: 'Accessories', price: 40, stock: 6, rating: '★★★★☆' },
    { id: 4, name: '24" Monitor', category: 'Displays', price: 220, stock: 3, rating: '★★★★☆' },
    { id: 5, name: 'HD Webcam', category: 'Cameras', price: 60, stock: 7, rating: '★★★★☆' },
    { id: 6, name: 'Bluetooth Speaker', category: 'Audio', price: 120, stock: 2, rating: '★★★★☆' }
  ]);

  /*
    filteredProducts is computed from:
    - products
    - searchText
    - selectedCategory

    When searchText or selectedCategory changes,
    Angular recalculates this automatically.
  */
  filteredProducts = computed(() => {
    const term = this.searchText().toLowerCase().trim();
    const category = this.selectedCategory();

    return this.products().filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      const matchesCategory =
        category === 'All' || product.category === category;

      return matchesSearch && matchesCategory;
    });
  });

  /*
    totalItems is derived from cart.
    We do not manually store this as a separate number.
  */
  totalItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  /*
    cartTotal is also derived from cart.
  */
  cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  /*
    Updates the search text signal.
    Called by the navbar.
  */
  updateSearchText(value: string) {
    this.searchText.set(value);
  }

  /*
    Updates the selected category signal.
    Called by the navbar.
  */
  updateSelectedCategory(value: string) {
    this.selectedCategory.set(value);
  }

  /*
    Returns how many of a product are already in the cart.
  */
  cartQuantityForProduct(productId: number) {
    const item = this.cart().find(cartItem => cartItem.id === productId);
    return item ? item.quantity : 0;
  }

  /*
    Returns true if the cart already contains the maximum allowed stock.
  */
  isProductMaxed(product: Product) {
    return this.cartQuantityForProduct(product.id) >= product.stock;
  }

  /*
    Adds a product to the cart.

    If the product is not already in the cart:
    - add it with quantity 1

    If it already exists:
    - increase the quantity
    - but never go above stock
  */
  addToCart(product: Product) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items => {
      const existingItem = items.find(item => item.id === product.id);

      if (!existingItem) {
        return [
          ...items,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: 1,
            stock: product.stock
          }
        ];
      }

      return items.map(item =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity < item.stock ? item.quantity + 1 : item.quantity
            }
          : item
      );
    });
  }

  /*
    Increases quantity for one cart item.
  */
  increaseQuantity(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items =>
      items.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity < item.stock ? item.quantity + 1 : item.quantity
            }
          : item
      )
    );
  }

  /*
    Decreases quantity for one cart item.

    If the quantity becomes 0, the item is removed from the cart.
  */
  decreaseQuantity(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items =>
      items
        .map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  /*
    Removes one item from the cart.
  */
  removeFromCart(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items => items.filter(item => item.id !== itemId));
  }

  /*
    Clears the entire cart.
  */
  clearCart() {
    this.cart.set([]);
    this.orderPlaced.set(false);
    this.orderMessage.set('');
  }

  /*
    Simulates placing an order.
  */
  placeOrder() {
    if (this.cart().length === 0) {
      this.orderPlaced.set(false);
      this.orderMessage.set('Your cart is empty. Please add products before placing the order.');
      return;
    }

    this.orderPlaced.set(true);
    this.orderMessage.set('Order placed successfully!');
  }
}
```

---

# 13. What Moved from `App` to `StoreService`?

Almost everything related to data moved.

## Moved into service

```txt
storeName
location
heroTitle
heroText
categories
navLinks
footerColumns
products
cart
searchText
selectedCategory
orderPlaced
orderMessage
filteredProducts
totalItems
cartTotal
all cart methods
```

## Left in App

Almost nothing.

The App component becomes a shell.

That is good.

---

# 14. Step 4 — Clean `app.ts`

Before Level 4, `app.ts` was large.

After Level 4, it becomes small.

## `app.ts`

```ts
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
```

---

# 15. Why Is `App` Now Empty?

Because `App` is no longer responsible for store logic.

Its job is now:

```txt
Place the main layout components on the page.
```

That is enough.

An empty-looking `App` is not a problem.

It is a sign that responsibilities moved to the correct place.

---

# 16. Step 5 — Clean `app.html`

Before Level 4, `app.html` had many inputs and outputs.

It looked like this:

```html
<app-navbar
  [storeName]="storeName"
  [location]="location"
  ...
  (searchTextChange)="updateSearchText($event)"
/>
```

After Level 4, components access the service directly.

## `app.html`

```html
<app-navbar />

<app-hero />

<main class="page-content">
  <app-product-list />
  <app-cart-summary />
</main>

<app-footer />
```

This is much cleaner.

---

# 17. Step 6 — Keep `app.css` for Layout

## `app.css`

```css
/*
  App-level CSS only controls the page layout.
*/
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

# 18. Step 7 — Update Navbar Component

The navbar no longer needs many `@Input()` and `@Output()` properties.

Instead, it injects `StoreService`.

---

## `navbar.ts`

```ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-navbar',

  /*
    FormsModule is required because navbar uses ngModel.
  */
  imports: [FormsModule],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  /*
    inject(StoreService) gives this component access to the shared store.

    Now the navbar can read:
    - store.storeName
    - store.location
    - store.searchText()
    - store.selectedCategory()
    - store.totalItems()

    And it can call:
    - store.updateSearchText()
    - store.updateSelectedCategory()
  */
  store = inject(StoreService);
}
```

---

## `navbar.html`

```html
<header class="topbar">
  <div class="topbar-left">
    <div class="logo">mini<span>store</span></div>
    <div class="location">{{ store.location }}</div>
  </div>

  <div class="search-area">
    <!--
      Read selected category from the service.
      Update the service when the dropdown changes.
    -->
    <select
      class="search-category"
      [ngModel]="store.selectedCategory()"
      (ngModelChange)="store.updateSelectedCategory($event)"
    >
      @for (category of store.categories; track category) {
        <option [value]="category">{{ category }}</option>
      }
    </select>

    <!--
      Read search text from the service.
      Update the service when the user types.
    -->
    <input
      type="text"
      [ngModel]="store.searchText()"
      (ngModelChange)="store.updateSearchText($event)"
      placeholder="Search {{ store.storeName }}"
    />

    <button class="search-btn">Search</button>
  </div>

  <div class="topbar-right">
    <div class="nav-box">
      <small>Hello, Sign in</small>
      <strong>Account</strong>
    </div>

    <div class="nav-box">
      <small>Returns</small>
      <strong>& Orders</strong>
    </div>

    <!--
      Cart count comes from the service.
      When cart changes, this updates automatically.
    -->
    <div class="cart-box">
      🛒 <strong>Cart ({{ store.totalItems() }})</strong>
    </div>
  </div>
</header>

<nav class="subnav">
  @for (link of store.navLinks; track link.label) {
    <a [href]="link.href">{{ link.label }}</a>
  }
</nav>
```

---

# 19. What Changed in Navbar?

## Before Level 4

Navbar received data like this:

```ts
@Input() storeName = '';
@Input() totalItems = 0;

@Output() searchTextChange = new EventEmitter<string>();
```

## After Level 4

Navbar uses:

```ts
store = inject(StoreService);
```

This removes the input/output wiring for shared store state.

---

# 20. Step 8 — Update Hero Component

Hero no longer needs `@Input()`.

It can read title and text directly from the service.

---

## `hero.ts`

```ts
import { Component, inject } from '@angular/core';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  /*
    Hero reads hero text directly from the shared store.
  */
  store = inject(StoreService);
}
```

---

## `hero.html`

```html
<section class="hero">
  <div class="hero-content">
    <h1>{{ store.heroTitle }}</h1>
    <p>{{ store.heroText }}</p>
  </div>
</section>
```

---

# 21. Step 9 — Update Product List Component

ProductList no longer needs `@Input()` or `@Output()`.

It reads products from the service and calls service methods directly.

---

## `product-list.ts`

```ts
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
```

---

## `product-list.html`

```html
<section id="products" class="products-section">
  <div class="section-title-row">
    <div>
      <h2>Featured Products</h2>
      <p>Service-based Angular storefront version</p>
    </div>
  </div>

  <!--
    Product list comes from the service.
  -->
  @if (store.filteredProducts().length === 0) {
    <div class="empty-panel">
      <p>No matching products found.</p>
    </div>
  } @else {
    <div class="products-grid">
      @for (product of store.filteredProducts(); track product.id) {
        <article class="product-card">
          <div class="product-image">Image</div>

          <h3>{{ product.name }}</h3>

          <p class="product-category">Category: {{ product.category }}</p>
          <p class="product-rating">{{ product.rating }}</p>
          <p class="product-price">{{ product.price | currency }}</p>
          <p class="product-stock">Stock: {{ product.stock }}</p>

          <!--
            The service knows how many of this product are in the cart.
          -->
          @if (store.cartQuantityForProduct(product.id) > 0) {
            <p class="in-cart-message">
              In cart: {{ store.cartQuantityForProduct(product.id) }} / {{ product.stock }}
            </p>
          }

          <!--
            ProductList directly calls the service method.
          -->
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
        </article>
      }
    </div>
  }
</section>
```

---

# 22. What Changed in ProductList?

## Before Level 4

ProductList had:

```ts
@Input() products: Product[] = [];
@Input() cart: CartItem[] = [];

@Output() addProduct = new EventEmitter<Product>();
```

## After Level 4

ProductList only has:

```ts
store = inject(StoreService);
```

That is cleaner because product and cart state are shared app state.

---

# 23. Step 10 — Update Cart Summary Component

CartSummary also reads and updates cart state through the service.

---

## `cart-summary.ts`

```ts
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
```

---

## `cart-summary.html`

```html
<aside class="summary-section">
  <div class="summary-card">
    <h2>Order Summary</h2>

    <p><strong>Items:</strong> {{ store.totalItems() }}</p>
    <p><strong>Total:</strong> {{ store.cartTotal() | currency }}</p>

    @if (store.cart().length > 0) {
      <button class="buy-btn" (click)="store.placeOrder()">
        Proceed to Checkout
      </button>

      <button class="clear-btn" (click)="store.clearCart()">
        Clear Cart
      </button>
    } @else {
      <p class="empty-message">Add items to see your summary.</p>
    }

    @if (store.orderMessage()) {
      <div
        class="status-box"
        [class.success]="store.orderPlaced()"
        [class.error]="!store.orderPlaced()"
      >
        {{ store.orderMessage() }}
      </div>
    }
  </div>

  <div class="cart-preview">
    <h3>Your Cart</h3>

    @if (store.cart().length === 0) {
      <p class="empty-message">Your cart is empty.</p>
    } @else {
      @for (item of store.cart(); track item.id) {
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>{{ item.name }}</strong>
            <p>{{ item.price | currency }} x {{ item.quantity }}</p>
            <p class="line-total">
              Subtotal: {{ item.price * item.quantity | currency }}
            </p>

            @if (item.quantity === item.stock) {
              <p class="warning-text">Maximum stock reached</p>
            }
          </div>

          <div class="cart-controls">
            <button
              class="qty-btn"
              (click)="store.increaseQuantity(item.id)"
              [disabled]="item.quantity === item.stock"
            >
              +
            </button>

            <button
              class="qty-btn"
              (click)="store.decreaseQuantity(item.id)"
            >
              -
            </button>

            <button
              class="remove-btn"
              (click)="store.removeFromCart(item.id)"
            >
              Remove
            </button>
          </div>
        </div>
      }
    }
  </div>
</aside>
```

---

# 24. What Changed in CartSummary?

## Before Level 4

CartSummary had many inputs and outputs:

```ts
@Input() cart: CartItem[] = [];
@Input() totalItems = 0;
@Input() cartTotal = 0;

@Output() increase = new EventEmitter<number>();
@Output() decrease = new EventEmitter<number>();
@Output() remove = new EventEmitter<number>();
@Output() clear = new EventEmitter<void>();
@Output() placeOrder = new EventEmitter<void>();
```

## After Level 4

CartSummary only needs:

```ts
store = inject(StoreService);
```

The service now provides both the data and the methods.

---

# 25. Step 11 — Update Footer Component

Footer reads data from the service.

---

## `footer.ts`

```ts
import { Component, inject } from '@angular/core';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  /*
    Footer reads store name and footer columns from service.
  */
  store = inject(StoreService);
}
```

---

## `footer.html`

```html
<footer class="footer">
  <div class="footer-backtop">
    <a href="#">Back to top</a>
  </div>

  <div class="footer-main">
    @for (column of store.footerColumns; track column.title) {
      <div class="footer-column">
        <h4>{{ column.title }}</h4>

        @for (link of column.links; track link) {
          <a href="#">{{ link }}</a>
        }
      </div>
    }
  </div>

  <div class="footer-bottom">
    <p>© 2026 {{ store.storeName }}. Built as an Angular storefront demo.</p>
  </div>
</footer>
```

---

# 26. What Changed in Footer?

## Before Level 4

Footer received data from App:

```ts
@Input() storeName = '';
@Input() footerColumns: FooterColumn[] = [];
```

## After Level 4

Footer gets data from the service:

```ts
store = inject(StoreService);
```

---

# 27. CSS Files

Most CSS files do not need major changes from Stage 5.

The purpose of Level 4 is architecture, not visual design.

Keep:

```txt
navbar.css
hero.css
product-list.css
cart-summary.css
footer.css
app.css
styles.css
```

as they were.

If something breaks visually, compare with your Stage 5 CSS.

---

# 28. Level 4 Data Flow

Now the data flow looks like this:

```txt
Navbar
  ↓ updates
StoreService.searchText
  ↓ triggers
StoreService.filteredProducts
  ↓ read by
ProductList
```

```txt
ProductList button click
  ↓ calls
StoreService.addToCart(product)
  ↓ updates
StoreService.cart
  ↓ triggers
StoreService.totalItems and StoreService.cartTotal
  ↓ read by
Navbar and CartSummary
```

```txt
CartSummary + button
  ↓ calls
StoreService.increaseQuantity(itemId)
  ↓ updates
StoreService.cart
  ↓ UI updates everywhere
```

---

# 29. Why This Is Cleaner

Before:

```txt
ProductList → emit event → App → update cart → pass cart back down
```

After:

```txt
ProductList → StoreService.addToCart()
```

Before:

```txt
Navbar needed many @Input and @Output properties
```

After:

```txt
Navbar injects StoreService
```

Before:

```txt
App was crowded
```

After:

```txt
App is clean
```

---

# 30. But Is This Always Better?

Not always.

For very small components, `@Input()` and `@Output()` are still good.

A service is best when data is shared by multiple parts of the app.

In this project, cart data is shared by:

```txt
Navbar
ProductList
CartSummary
Footer later maybe
Checkout later
```

So a service makes sense.

---

# 31. Common Errors and Fixes

## Error: Cannot find module `../models/store.models`

Check your folder path.

From:

```txt
src/app/services/store.service.ts
```

the model import should be:

```ts
import { Product } from '../models/store.models';
```

From a component like:

```txt
src/app/components/product-list/product-list.ts
```

the service import should be:

```ts
import { StoreService } from '../../services/store.service';
```

---

## Error: `inject` is not found

Make sure you imported it:

```ts
import { Component, inject } from '@angular/core';
```

---

## Error: `store.filteredProducts` does not update

Make sure you call signals with parentheses:

Correct:

```html
store.filteredProducts()
```

Wrong:

```html
store.filteredProducts
```

Signals and computed signals are functions when read in templates.

---

## Error: `store.cart.length` does not work

`cart` is a signal, so you must call it.

Correct:

```html
store.cart().length
```

Wrong:

```html
store.cart.length
```

---

## Error: Currency pipe not found

Any component using:

```html
{{ value | currency }}
```

needs:

```ts
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe]
})
```

---

## Error: ngModel not working

Any component using:

```html
[ngModel]
(ngModelChange)
```

needs:

```ts
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule]
})
```

---

## Error: Old imports from `../../app`

After moving types to `models/store.models.ts`, remove imports like:

```ts
import { Product } from '../../app';
```

Use:

```ts
import { Product } from '../../models/store.models';
```

Only import types if the component still needs them.

In Level 4, many components do not need product/cart types anymore because they use the service directly.

---

# 32. Classroom Checkpoints

Use these checkpoints while teaching.

## Checkpoint 1

Create the models file.

The app should still compile.

---

## Checkpoint 2

Create the service and move product/cart data into it.

The app may not fully work yet, but there should be no syntax errors.

---

## Checkpoint 3

Clean `app.ts`.

App should become much smaller.

---

## Checkpoint 4

Clean `app.html`.

It should only show:

```html
<app-navbar />
<app-hero />
<app-product-list />
<app-cart-summary />
<app-footer />
```

---

## Checkpoint 5

Update Navbar.

Search and category filter should work again.

---

## Checkpoint 6

Update ProductList.

Products should display again and Add to Cart should work.

---

## Checkpoint 7

Update CartSummary.

Cart items, totals, +, -, remove, clear, and order should work.

---

## Checkpoint 8

Update Footer.

Footer should display data from the service.

---

# 33. Questions Students Should Be Able to Answer

At the end of Level 4, students should answer:

## What is a service?

A shared class used to hold data and logic that multiple components need.

---

## Why did we create `StoreService`?

Because many components need access to products, cart, search, totals, and order logic.

---

## Why did `App` become smaller?

Because state and business logic moved into the service.

---

## What does `inject(StoreService)` do?

It gives a component access to the shared `StoreService`.

---

## Why do we still use signals?

Because signals make the UI react automatically when data changes.

---

## Why does the navbar cart count update?

Because it reads:

```html
store.totalItems()
```

and `totalItems` is computed from the cart signal.

---

# 34. Teacher Explanation Script

Use this in class:

> In Stage 5, we split the screen into components.  
> But the App component was still the brain.  
> In Level 4, we move the brain into a service.  
> Now the components are more like workers.  
> They ask the service for data and call service methods when something happens.

---

# 35. The Main Mental Model

```txt
StoreService = shared brain
Components = UI pieces
Signals = reactive memory
Computed = automatic calculations
Methods = actions users can trigger
```

---

# 36. Final Architecture

```txt
StoreService
├── storeName
├── products
├── cart
├── searchText
├── selectedCategory
├── filteredProducts
├── totalItems
├── cartTotal
├── addToCart()
├── increaseQuantity()
├── decreaseQuantity()
├── removeFromCart()
├── clearCart()
└── placeOrder()
```

Components:

```txt
Navbar → reads search/category/cart count from service
Hero → reads hero text from service
ProductList → reads products and calls addToCart
CartSummary → reads cart and calls cart methods
Footer → reads footer data from service
```

---

# 37. What Comes Next?

After Level 4, the next step is Level 5:

```txt
Routing + Pages
```

That means instead of one page, we create:

```txt
/products
/cart
/checkout
```

The service will become even more useful because cart state will survive while moving between pages.

---

# 38. Final Summary

Level 4 is about moving from:

```txt
Component-owned state
```

to:

```txt
Service-owned shared state
```

This makes the app more professional and easier to grow.

Remember:

> Stage 5 organized the UI.  
> Level 4 organizes the state.

That is the difference.

