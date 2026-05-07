# Stage 5 — Splitting the Angular Storefront into Components

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By the end of Stage 4, the storefront was working, but everything was still mostly controlled from one main file.

The app already had:

- product data
- search filtering
- category filtering
- cart state
- add to cart
- increase quantity
- decrease quantity
- remove item
- clear cart
- order summary
- order message
- footer
- Amazon-style visual layout

That is good progress.

But there is a problem.

The app is becoming too large for one component.

---

# 1. What Problem Are We Solving in Stage 5?

In Stage 4, the project works, but the code is starting to become crowded.

The main `App` component is doing too much:

```txt
App component
├── navbar layout
├── search box
├── product list
├── product card UI
├── cart summary
├── cart controls
├── footer
├── all product data
├── all cart logic
└── all event handling
```

That works for a beginner project, but it does not scale.

In real Angular apps, we split large screens into smaller components.

That is the goal of Stage 5.

---

# 2. Stage 5 Learning Goal

By the end of Stage 5, students should understand:

- what a component is
- why we split large pages into components
- how parent and child components communicate
- how to use `@Input()`
- how to use `@Output()`
- how to use `EventEmitter`
- how to keep state in the parent
- how to send user actions back to the parent

---

# 3. The Big Idea

In Stage 5, we do **not** change the app features.

The storefront should still behave the same.

We only improve the structure.

This is called **refactoring**.

## What is refactoring?

Refactoring means:

> Improving the structure of the code without changing what the app does.

So after Stage 5:

- the app should look the same
- the app should work the same
- but the code should be cleaner and easier to manage

---

# 4. Before and After

## Before Stage 5

Everything is mostly inside `app.ts`, `app.html`, and `app.css`.

```txt
app/
├── app.ts
├── app.html
└── app.css
```

## After Stage 5

The app is split into smaller pieces.

```txt
app/
├── app.ts
├── app.html
├── app.css
├── components/
│   ├── navbar/
│   │   ├── navbar.ts
│   │   ├── navbar.html
│   │   └── navbar.css
│   ├── hero/
│   │   ├── hero.ts
│   │   ├── hero.html
│   │   └── hero.css
│   ├── product-list/
│   │   ├── product-list.ts
│   │   ├── product-list.html
│   │   └── product-list.css
│   ├── cart-summary/
│   │   ├── cart-summary.ts
│   │   ├── cart-summary.html
│   │   └── cart-summary.css
│   └── footer/
│       ├── footer.ts
│       ├── footer.html
│       └── footer.css
```

---

# 5. Important Rule for Stage 5

This rule matters a lot:

> The parent component owns the data. Child components display data and send events back.

In this project:

```txt
App component owns:
├── products
├── cart
├── searchText
├── selectedCategory
├── totalItems
├── cartTotal
└── cart methods
```

Child components receive data using `@Input()`.

Child components send events back using `@Output()`.

---

# 6. Why Not Put Cart Logic Inside the Cart Component?

This is a common beginner mistake.

Students may ask:

> If the cart UI is inside `CartSummary`, why not put the cart logic there too?

Because the cart affects more than one part of the app.

The cart affects:

- navbar cart count
- product card stock status
- cart summary
- checkout behavior later

So cart state should stay in the parent for Stage 5.

Later, in Level 4, we can move shared state into a service.

But for Stage 5, the clean teaching pattern is:

```txt
Parent owns state.
Children receive data.
Children emit events.
```

---

# 7. Create the Components

Run these Angular CLI commands:

```bash
ng generate component components/navbar
ng generate component components/hero
ng generate component components/product-list
ng generate component components/cart-summary
ng generate component components/footer
```

These commands create folders and files automatically.

Each component usually gets:

```txt
component-name.ts
component-name.html
component-name.css
```

---

# 8. Update Global Styles

Some styles belong to the whole app, not one component.

Put these in `src/styles.css`.

## `styles.css`

```css
/* 
  Global reset.
  This makes width and height calculations easier.
*/
* {
  box-sizing: border-box;
}

/*
  Smooth scrolling allows navbar links like #products
  to move smoothly instead of jumping suddenly.
*/
html {
  scroll-behavior: smooth;
}

/*
  Body styles apply to the whole website.
  These should stay global because every component sits inside body.
*/
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #eaeef2;
  color: #111;
}
```

## Why this belongs in `styles.css`

These styles affect the whole page.

If we put them inside one component, other components may not inherit them properly.

---

# 9. Update `app.ts`

The `App` component now becomes the parent container.

It still owns the state and logic.

## `app.ts`

```ts
import { Component, computed, signal } from '@angular/core';

/*
  These are child components.
  App will use them inside app.html.
*/
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { ProductList } from './components/product-list/product-list';
import { CartSummary } from './components/cart-summary/cart-summary';
import { Footer } from './components/footer/footer';

/*
  Product describes one item in the store.
  We export it because child components need to know this type.
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
  CartItem describes one item after it has been added to the cart.
  It includes quantity because cart items can have multiple units.
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
  NavLink describes one link in the navbar.
*/
export type NavLink = {
  label: string;
  href: string;
};

/*
  FooterColumn describes one footer section.
*/
export type FooterColumn = {
  title: string;
  links: string[];
};

@Component({
  selector: 'app-root',

  /*
    Because this is a standalone component,
    every child component used in app.html must be imported here.
  */
  imports: [Navbar, Hero, ProductList, CartSummary, Footer],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /*
    Basic store information used by different components.
  */
  storeName = 'Mini Tech Store';
  location = 'Deliver to Hamilton';

  /*
    Hero section text.
  */
  heroTitle = 'Tech Essentials for Everyday Use';
  heroText = 'Browse featured products, compare prices, and build your order.';

  /*
    Navbar links.
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
    { title: 'Teaching Demo', links: ['Angular Components', 'Inputs', 'Outputs', 'Signals'] }
  ];

  /*
    Categories are used by the navbar search filter.
  */
  categories = ['All', 'Audio', 'Accessories', 'Displays', 'Cameras'];

  /*
    Signals hold values that can change.
  */
  selectedCategory = signal('All');
  searchText = signal('');
  cart = signal<CartItem[]>([]);
  orderPlaced = signal(false);
  orderMessage = signal('');

  /*
    Product list is also a signal.
    This allows the app to react if product data changes later.
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
    computed() creates a value from other signals.

    filteredProducts depends on:
    - searchText
    - selectedCategory
    - products

    If any of those change, Angular recalculates the filtered list.
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
    totalItems is calculated from cart.
    We do not store this manually because it can be derived.
  */
  totalItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  /*
    cartTotal is also calculated from cart.
  */
  cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  /*
    Called when the navbar search input changes.
  */
  updateSearchText(value: string) {
    this.searchText.set(value);
  }

  /*
    Called when the navbar category dropdown changes.
  */
  updateSelectedCategory(value: string) {
    this.selectedCategory.set(value);
  }

  /*
    Finds how many of a specific product are already in the cart.
  */
  cartQuantityForProduct(productId: number) {
    const item = this.cart().find(cartItem => cartItem.id === productId);
    return item ? item.quantity : 0;
  }

  /*
    Checks whether a product has reached maximum stock in the cart.
  */
  isProductMaxed(product: Product) {
    return this.cartQuantityForProduct(product.id) >= product.stock;
  }

  /*
    Adds a product to the cart.

    If the product is not in the cart:
    - create a new cart item

    If the product already exists:
    - increase quantity, but do not go above stock
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
    Increases cart quantity by one.
    It also respects the stock limit.
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
    Decreases cart quantity by one.
    If quantity reaches 0, the item is removed.
  */
  decreaseQuantity(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items =>
      items
        .map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  /*
    Removes one item from the cart completely.
  */
  removeFromCart(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items => items.filter(item => item.id !== itemId));
  }

  /*
    Clears the whole cart.
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

# 10. Update `app.html`

Now `app.html` becomes much cleaner.

It no longer contains all the detailed markup.

It only places child components on the page and connects data/events.

## `app.html`

```html
<!--
  Navbar receives:
  - store name
  - location
  - links
  - categories
  - current search text
  - selected category
  - total cart items

  Navbar sends back:
  - search text changes
  - category changes
-->
<app-navbar
  [storeName]="storeName"
  [location]="location"
  [navLinks]="navLinks"
  [categories]="categories"
  [selectedCategory]="selectedCategory()"
  [searchText]="searchText()"
  [totalItems]="totalItems()"
  (searchTextChange)="updateSearchText($event)"
  (selectedCategoryChange)="updateSelectedCategory($event)"
/>

<!--
  Hero is simple.
  It only needs title and text.
-->
<app-hero
  [title]="heroTitle"
  [text]="heroText"
/>

<!--
  Main shopping layout.
-->
<main class="page-content">
  <!--
    Product list receives:
    - filtered products
    - cart data

    Product list sends back:
    - product selected for add to cart
  -->
  <app-product-list
    [products]="filteredProducts()"
    [cart]="cart()"
    (addProduct)="addToCart($event)"
  />

  <!--
    Cart summary receives:
    - cart
    - totals
    - order message state

    Cart summary sends back:
    - increase item
    - decrease item
    - remove item
    - clear cart
    - place order
  -->
  <app-cart-summary
    [cart]="cart()"
    [totalItems]="totalItems()"
    [cartTotal]="cartTotal()"
    [orderPlaced]="orderPlaced()"
    [orderMessage]="orderMessage()"
    (increase)="increaseQuantity($event)"
    (decrease)="decreaseQuantity($event)"
    (remove)="removeFromCart($event)"
    (clear)="clearCart()"
    (placeOrder)="placeOrder()"
  />
</main>

<!--
  Footer receives store name and footer data.
-->
<app-footer
  [storeName]="storeName"
  [footerColumns]="footerColumns"
/>
```

---

# 11. Update `app.css`

`app.css` now only handles the main layout.

## `app.css`

```css
/*
  App-level CSS should only handle page layout.
  Detailed styling belongs inside each component CSS file.
*/
.page-content {
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 16px 32px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

/*
  On smaller screens, products and cart stack vertically.
*/
@media (max-width: 1100px) {
  .page-content {
    grid-template-columns: 1fr;
  }
}
```

---

# 12. Navbar Component

The navbar has:

- logo
- location
- category dropdown
- search input
- account area
- cart count
- secondary nav links

It does not own the search state.

It receives search data from the parent and emits changes back.

---

## `navbar.ts`

```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavLink } from '../../app';

@Component({
  selector: 'app-navbar',

  /*
    FormsModule is required because this component uses ngModel.
  */
  imports: [FormsModule],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  /*
    Inputs are data coming from the parent component.
  */
  @Input() storeName = '';
  @Input() location = '';
  @Input() navLinks: NavLink[] = [];
  @Input() categories: string[] = [];
  @Input() selectedCategory = 'All';
  @Input() searchText = '';
  @Input() totalItems = 0;

  /*
    Outputs are events sent back to the parent component.
  */
  @Output() searchTextChange = new EventEmitter<string>();
  @Output() selectedCategoryChange = new EventEmitter<string>();
}
```

---

## `navbar.html`

```html
<header class="topbar">
  <div class="topbar-left">
    <div class="logo">mini<span>store</span></div>
    <div class="location">{{ location }}</div>
  </div>

  <div class="search-area">
    <!--
      The dropdown shows the current selectedCategory.
      When the user changes it, we emit the new value to the parent.
    -->
    <select
      class="search-category"
      [ngModel]="selectedCategory"
      (ngModelChange)="selectedCategoryChange.emit($event)"
    >
      @for (category of categories; track category) {
        <option [value]="category">{{ category }}</option>
      }
    </select>

    <!--
      The input shows the current searchText.
      When the user types, we emit the new value to the parent.
    -->
    <input
      type="text"
      [ngModel]="searchText"
      (ngModelChange)="searchTextChange.emit($event)"
      placeholder="Search {{ storeName }}"
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

    <div class="cart-box">
      🛒 <strong>Cart ({{ totalItems }})</strong>
    </div>
  </div>
</header>

<nav class="subnav">
  @for (link of navLinks; track link.label) {
    <a [href]="link.href">{{ link.label }}</a>
  }
</nav>
```

---

## `navbar.css`

```css
.topbar {
  background: #131921;
  color: white;
  display: grid;
  grid-template-columns: 220px 1fr 320px;
  gap: 16px;
  align-items: center;
  padding: 12px 20px;
}

.logo {
  font-size: 1.6rem;
  font-weight: 700;
}

.logo span {
  color: #f59e0b;
}

.location {
  font-size: 0.85rem;
  color: #d1d5db;
}

.search-area {
  display: flex;
  height: 42px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.search-category {
  border: none;
  background: #e5e7eb;
  padding: 0 12px;
  min-width: 120px;
}

.search-area input {
  flex: 1;
  border: none;
  padding: 0 14px;
  font-size: 1rem;
  outline: none;
}

.search-btn {
  border: none;
  background: #f59e0b;
  padding: 0 18px;
  font-weight: 700;
  cursor: pointer;
}

.topbar-right {
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  align-items: center;
}

.nav-box {
  display: flex;
  flex-direction: column;
}

.nav-box small {
  color: #d1d5db;
  font-size: 0.75rem;
}

.cart-box {
  white-space: nowrap;
}

.subnav {
  background: #232f3e;
  color: white;
  display: flex;
  gap: 18px;
  padding: 10px 20px;
  flex-wrap: wrap;
  font-size: 0.92rem;
}

.subnav a {
  color: white;
  text-decoration: none;
}

@media (max-width: 1100px) {
  .topbar {
    grid-template-columns: 1fr;
  }

  .topbar-right {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
```

---

# 13. Hero Component

The hero component is simple.

It only displays title and text.

---

## `hero.ts`

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  /*
    These values come from App.
  */
  @Input() title = '';
  @Input() text = '';
}
```

---

## `hero.html`

```html
<section class="hero">
  <div class="hero-content">
    <h1>{{ title }}</h1>
    <p>{{ text }}</p>
  </div>
</section>
```

---

## `hero.css`

```css
.hero {
  background: linear-gradient(to right, #dbeafe, #f8fafc);
  padding: 36px 24px;
  border-bottom: 1px solid #d1d5db;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.hero h1 {
  margin: 0 0 8px;
  font-size: 2rem;
}

.hero p {
  margin: 0;
  color: #374151;
}
```

---

# 14. Product List Component

The product list receives products and cart data.

It displays product cards.

It does not directly update the parent cart.

Instead, when the user clicks Add to Cart, it emits the selected product to the parent.

---

## `product-list.ts`

```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem, Product } from '../../app';

@Component({
  selector: 'app-product-list',

  /*
    CurrencyPipe is required because this component uses:
    {{ product.price | currency }}
  */
  imports: [CurrencyPipe],

  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  /*
    Products come from the parent.
  */
  @Input() products: Product[] = [];

  /*
    Cart is also passed in so product cards can show:
    - how many are already in cart
    - whether max stock is reached
  */
  @Input() cart: CartItem[] = [];

  /*
    This event sends the selected product back to the parent.
  */
  @Output() addProduct = new EventEmitter<Product>();

  /*
    Finds how many of this product are already in the cart.
  */
  cartQuantityForProduct(productId: number) {
    const item = this.cart.find(cartItem => cartItem.id === productId);
    return item ? item.quantity : 0;
  }

  /*
    Checks if the product has reached maximum stock.
  */
  isProductMaxed(product: Product) {
    return this.cartQuantityForProduct(product.id) >= product.stock;
  }
}
```

---

## `product-list.html`

```html
<section id="products" class="products-section">
  <div class="section-title-row">
    <div>
      <h2>Featured Products</h2>
      <p>Component-based Angular storefront version</p>
    </div>
  </div>

  <!--
    If the filtered product list is empty, show a friendly message.
  -->
  @if (products.length === 0) {
    <div class="empty-panel">
      <p>No matching products found.</p>
    </div>
  } @else {
    <div class="products-grid">
      @for (product of products; track product.id) {
        <article class="product-card">
          <div class="product-image">Image</div>

          <h3>{{ product.name }}</h3>

          <p class="product-category">Category: {{ product.category }}</p>
          <p class="product-rating">{{ product.rating }}</p>
          <p class="product-price">{{ product.price | currency }}</p>
          <p class="product-stock">Stock: {{ product.stock }}</p>

          <!--
            Show this only if the product is already in the cart.
          -->
          @if (cartQuantityForProduct(product.id) > 0) {
            <p class="in-cart-message">
              In cart: {{ cartQuantityForProduct(product.id) }} / {{ product.stock }}
            </p>
          }

          <!--
            The child component does not call addToCart directly.
            It emits the product to the parent.
          -->
          <button
            class="cart-btn"
            (click)="addProduct.emit(product)"
            [disabled]="isProductMaxed(product)"
          >
            @if (isProductMaxed(product)) {
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

## `product-list.css`

```css
.section-title-row {
  background: white;
  padding: 18px 20px;
  margin-bottom: 18px;
  border-radius: 6px;
  border: 1px solid #dcdfe3;
}

.section-title-row h2 {
  margin: 0 0 4px;
  font-size: 1.5rem;
}

.section-title-row p {
  margin: 0;
  color: #555;
}

.empty-panel {
  background: white;
  border: 1px solid #dcdfe3;
  border-radius: 6px;
  padding: 20px;
  color: #555;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

.product-card {
  background: white;
  border: 1px solid #dcdfe3;
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 360px;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.1);
}

.product-image {
  height: 170px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  color: #6b7280;
  font-weight: 700;
}

.product-card h3 {
  margin: 0 0 8px;
  font-size: 1rem;
}

.product-category,
.product-stock {
  margin: 4px 0;
  font-size: 0.9rem;
  color: #555;
}

.product-rating {
  margin: 6px 0;
  color: #f59e0b;
}

.product-price {
  margin: 8px 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.in-cart-message {
  background: #ecfdf3;
  color: #166534;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 0.85rem;
  font-weight: 700;
  margin: 8px 0;
}

.cart-btn {
  margin-top: auto;
  border: 1px solid #d1a000;
  background: #ffd814;
  color: #111;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}

.cart-btn:hover {
  background: #f7ca00;
}

.cart-btn:disabled {
  background: #e5e7eb;
  border-color: #cbd5e1;
  color: #6b7280;
  cursor: not-allowed;
}
```

---

# 15. Cart Summary Component

The cart summary receives cart data and totals.

It sends events back to the parent when the user clicks:

- +
- -
- Remove
- Clear Cart
- Proceed to Checkout

---

## `cart-summary.ts`

```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '../../app';

@Component({
  selector: 'app-cart-summary',

  /*
    Needed for currency formatting in this component.
  */
  imports: [CurrencyPipe],

  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.css'
})
export class CartSummary {
  /*
    Data received from parent.
  */
  @Input() cart: CartItem[] = [];
  @Input() totalItems = 0;
  @Input() cartTotal = 0;
  @Input() orderPlaced = false;
  @Input() orderMessage = '';

  /*
    Events sent back to parent.
  */
  @Output() increase = new EventEmitter<number>();
  @Output() decrease = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();
  @Output() clear = new EventEmitter<void>();
  @Output() placeOrder = new EventEmitter<void>();
}
```

---

## `cart-summary.html`

```html
<aside class="summary-section">
  <div class="summary-card">
    <h2>Order Summary</h2>

    <p><strong>Items:</strong> {{ totalItems }}</p>
    <p><strong>Total:</strong> {{ cartTotal | currency }}</p>

    <!--
      Only show action buttons if cart has items.
    -->
    @if (cart.length > 0) {
      <button class="buy-btn" (click)="placeOrder.emit()">
        Proceed to Checkout
      </button>

      <button class="clear-btn" (click)="clear.emit()">
        Clear Cart
      </button>
    } @else {
      <p class="empty-message">Add items to see your summary.</p>
    }

    <!--
      Show order success/error message only when there is a message.
    -->
    @if (orderMessage) {
      <div class="status-box" [class.success]="orderPlaced" [class.error]="!orderPlaced">
        {{ orderMessage }}
      </div>
    }
  </div>

  <div class="cart-preview">
    <h3>Your Cart</h3>

    @if (cart.length === 0) {
      <p class="empty-message">Your cart is empty.</p>
    } @else {
      @for (item of cart; track item.id) {
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
            <!--
              Sends item id to parent.
            -->
            <button
              class="qty-btn"
              (click)="increase.emit(item.id)"
              [disabled]="item.quantity === item.stock"
            >
              +
            </button>

            <button
              class="qty-btn"
              (click)="decrease.emit(item.id)"
            >
              -
            </button>

            <button
              class="remove-btn"
              (click)="remove.emit(item.id)"
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

## `cart-summary.css`

```css
.summary-section {
  position: sticky;
  top: 24px;
  align-self: start;
}

.summary-card,
.cart-preview {
  background: white;
  border: 1px solid #dcdfe3;
  border-radius: 6px;
  padding: 18px;
  margin-bottom: 18px;
}

.summary-card h2,
.cart-preview h3 {
  margin-top: 0;
}

.buy-btn,
.clear-btn,
.qty-btn,
.remove-btn {
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.buy-btn,
.clear-btn {
  width: 100%;
  padding: 11px 14px;
  border-radius: 999px;
  margin-top: 10px;
}

.buy-btn {
  background: #ffd814;
  color: #111;
  border: 1px solid #d1a000;
}

.clear-btn {
  background: #eaecf0;
  color: #111827;
}

.empty-message {
  color: #666;
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

.cart-preview {
  max-height: 520px;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #e5e7eb;
  padding: 12px 0;
}

.cart-item:first-of-type {
  border-top: none;
  padding-top: 0;
}

.cart-item-info p {
  margin: 4px 0 0;
  color: #666;
  font-size: 0.9rem;
}

.line-total {
  font-weight: 700;
  color: #111827;
}

.warning-text {
  color: #b45309 !important;
  font-weight: 700;
}

.cart-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.qty-btn {
  background: #f3f4f6;
  color: #111827;
  padding: 8px 12px;
  border-radius: 8px;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-btn {
  background: #b91c1c;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
}

@media (max-width: 1100px) {
  .summary-section {
    position: static;
  }
}
```

---

# 16. Footer Component

The footer receives data and displays it.

---

## `footer.ts`

```ts
import { Component, Input } from '@angular/core';
import { FooterColumn } from '../../app';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  @Input() storeName = '';
  @Input() footerColumns: FooterColumn[] = [];
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
    @for (column of footerColumns; track column.title) {
      <div class="footer-column">
        <h4>{{ column.title }}</h4>

        @for (link of column.links; track link) {
          <a href="#">{{ link }}</a>
        }
      </div>
    }
  </div>

  <div class="footer-bottom">
    <p>© 2026 {{ storeName }}. Built as an Angular storefront demo.</p>
  </div>
</footer>
```

---

## `footer.css`

```css
.footer {
  margin-top: 24px;
}

.footer-backtop {
  background: #37475a;
  text-align: center;
  padding: 14px 20px;
}

.footer-backtop a {
  color: white;
  font-weight: 600;
  text-decoration: none;
}

.footer-main {
  background: #232f3e;
  color: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 36px 24px;
}

.footer-column h4 {
  margin-top: 0;
  margin-bottom: 14px;
}

.footer-column a {
  display: block;
  color: #d1d5db;
  margin-bottom: 10px;
  font-size: 0.92rem;
  text-decoration: none;
}

.footer-column a:hover {
  text-decoration: underline;
}

.footer-bottom {
  background: #131a22;
  color: #d1d5db;
  text-align: center;
  padding: 16px 20px;
  font-size: 0.9rem;
}

@media (max-width: 1100px) {
  .footer-main {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .footer-main {
    grid-template-columns: 1fr;
  }
}
```

---

# 17. How Data Flows in Stage 5

This is the most important concept.

## Parent to child: `@Input()`

Example:

```html
<app-product-list
  [products]="filteredProducts()"
  [cart]="cart()"
/>
```

This means:

> App sends products and cart data into ProductList.

---

## Child to parent: `@Output()`

Example:

```html
<app-product-list
  (addProduct)="addToCart($event)"
/>
```

This means:

> ProductList tells App that the user clicked Add to Cart.

---

## Inside child component

```ts
@Output() addProduct = new EventEmitter<Product>();
```

This creates the event.

Then in the template:

```html
<button (click)="addProduct.emit(product)">
  Add to Cart
</button>
```

This sends the product back to the parent.

---

# 18. Final Stage 5 Data Flow Diagram

```txt
User types in Navbar
        ↓
Navbar emits searchTextChange
        ↓
App updates searchText signal
        ↓
filteredProducts recalculates
        ↓
ProductList receives new product list
        ↓
UI updates
```

```txt
User clicks Add to Cart
        ↓
ProductList emits addProduct
        ↓
App runs addToCart(product)
        ↓
cart signal updates
        ↓
totalItems and cartTotal recompute
        ↓
Navbar and CartSummary update
```

```txt
User clicks + in cart
        ↓
CartSummary emits increase
        ↓
App runs increaseQuantity(itemId)
        ↓
cart signal updates
        ↓
UI updates everywhere
```

---

# 19. Common Errors and Fixes

## Error: Component not known

Example:

```txt
'app-navbar' is not a known element
```

Fix:

Make sure the component is imported in `app.ts`.

```ts
imports: [Navbar, Hero, ProductList, CartSummary, Footer]
```

---

## Error: No pipe found with name currency

Fix:

Any component using `| currency` needs:

```ts
import { CurrencyPipe } from '@angular/common';
```

And:

```ts
imports: [CurrencyPipe]
```

---

## Error: Can't bind to ngModel

Fix:

Any component using `ngModel` needs:

```ts
import { FormsModule } from '@angular/forms';
```

And:

```ts
imports: [FormsModule]
```

---

## Error: Cannot find type Product or CartItem

Fix:

If using:

```ts
import { Product } from '../../app';
```

Make sure `Product` is exported in `app.ts`:

```ts
export type Product = { ... };
```

---

## Error: Button click does nothing

Check three places:

### 1. Child has Output

```ts
@Output() addProduct = new EventEmitter<Product>();
```

### 2. Child emits event

```html
(click)="addProduct.emit(product)"
```

### 3. Parent listens to event

```html
(addProduct)="addToCart($event)"
```

All three are required.

---

# 20. Classroom Checkpoints

Use these checkpoints while building.

## Checkpoint 1

After creating components, the app should compile.

Even if components are empty, the app should run.

---

## Checkpoint 2

After moving navbar code, the navbar should appear.

Search may not work yet.

---

## Checkpoint 3

After adding inputs and outputs to navbar, search and category filter should work again.

---

## Checkpoint 4

After moving product list, product cards should appear.

Add to Cart may not work yet.

---

## Checkpoint 5

After adding `@Output()` to product list, Add to Cart should work again.

---

## Checkpoint 6

After moving cart summary, the cart should display correctly.

---

## Checkpoint 7

After adding cart summary outputs, the +, -, Remove, Clear Cart, and Proceed buttons should work.

---

## Checkpoint 8

After moving footer, the page should feel complete again.

---

# 21. What Students Should Be Able to Explain

At the end of Stage 5, students should be able to explain:

- why we split components
- what `@Input()` does
- what `@Output()` does
- what `EventEmitter` does
- why App still owns the cart
- why child components should not directly mutate parent state
- how product data moves down
- how button clicks move back up

---

# 22. Teacher Notes

Do not rush this stage.

Students often understand the code mechanically but miss the architecture.

Emphasize this sentence repeatedly:

> Data goes down. Events go up.

This is the core lesson of Stage 5.

---

# 23. What Comes Next

After Stage 5, the app is ready for Level 4.

Level 4 moves shared state into a service.

That will simplify parent-child passing and introduce dependency injection.

But do not jump there until students can explain this version.

If they cannot explain `@Input()` and `@Output()`, they are not ready for services.

---

# 24. Final Mental Model

Think of the app like a store manager and workers.

## App component

The manager.

It knows:

- all products
- cart contents
- total price
- order status

## Navbar

The front desk.

It lets users search and see cart count.

## ProductList

The shelves.

It displays products and tells the manager when someone wants to buy.

## CartSummary

The checkout counter.

It displays the cart and tells the manager when quantities change.

## Footer

The store information board.

It displays extra links and information.

---

# 25. Summary

Stage 5 is not about adding new features.

Stage 5 is about making the project professional.

Before:

```txt
One large component doing everything.
```

After:

```txt
Several focused components working together.
```

This is how Angular projects grow safely.

