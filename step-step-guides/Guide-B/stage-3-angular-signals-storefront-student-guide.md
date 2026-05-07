# Stage 3 Student Guide — Angular Signals Storefront

## Project Theme

We are building a small online store called **Mini Tech Store**.

In Stage 1, we built a hardcoded HTML/CSS storefront skeleton.

In Stage 2, we converted the static page into an Angular template using TypeScript data and `@for` loops.

In **Stage 3**, we make the app interactive.

This is the Stage where the project starts behaving like a real frontend app.

---

# What You Will Build in Stage 3

By the end of this Stage, your app will have:

- a product list
- a working search box
- an add-to-cart button
- a cart preview
- quantity increase and decrease buttons
- remove from cart button
- clear cart button
- live total item count
- live total price
- order success message
- empty cart warning
- stock limit protection

---

# Big Idea of Stage 3

In Stage 2, the page displayed data.

In Stage 3, the page reacts to user actions.

That means we need to manage **state**.

State means data that can change while the app is running.

Examples:

```ts
searchText = signal('');
cart = signal<CartItem[]>([]);
orderMessage = signal('');
```

These values can change when the user types, clicks, adds products, removes products, or places an order.

---

# What Is a Signal?

A signal is Angular's way of storing reactive data.

Reactive means:

> When the data changes, the screen updates automatically.

Example:

```ts
searchText = signal('');
```

This creates a value that starts as an empty string.

To read the value:

```ts
this.searchText()
```

To update the value:

```ts
this.searchText.set('keyboard');
```

This is different from a normal variable.

A normal variable changes quietly.
A signal tells Angular, “This value changed. Update the screen.”

---

# What Is a Computed Value?

A computed value is a value that is calculated from other values.

Example:

```ts
totalItems = computed(() =>
  this.cart().reduce((sum, item) => sum + item.quantity, 0)
);
```

This means:

- look at the cart
- add up all quantities
- return the total number of items

We do not manually update `totalItems`.

Angular calculates it automatically whenever the cart changes.

This is very important.

Good apps avoid storing duplicate data when it can be calculated.

---

# Stage 3 Project Flow

The app now works like this:

```txt
User searches
    ↓
searchText signal changes
    ↓
filteredProducts computed value updates
    ↓
Product list on screen changes
```

And:

```txt
User clicks Add to Cart
    ↓
cart signal changes
    ↓
totalItems and cartTotal update
    ↓
Cart preview and summary update
```

That is the core frontend idea.

Data changes → UI updates.

---

# Files Used in Stage 3

At this Stage, we are still keeping everything in one Angular component.

You will work with:

```txt
src/app/app.ts
src/app/app.html
src/app/app.css
```

Do not split into components yet.

That comes later.

For now, the goal is to understand state and behavior first.

---

# Step 1 — Update `app.ts`

The TypeScript file controls the data and behavior of the app.

Replace your `app.ts` with this version.

```ts
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

// Product describes one item available in the store.
// This is the data shown in the product cards.
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;
};

// NavLink describes one navigation link in the top menu.
type NavLink = {
  label: string;
  href: string;
};

// FooterColumn describes one footer section.
type FooterColumn = {
  title: string;
  links: string[];
};

// CartItem describes one product after it has been added to the cart.
// Notice that CartItem has quantity, because cart items can increase or decrease.
type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;
};

@Component({
  selector: 'app-root',

  // FormsModule is needed for ngModel.
  // CurrencyPipe is needed for the currency pipe in the HTML.
  imports: [FormsModule, CurrencyPipe],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Basic store information used in the page.
  storeName = 'Mini Tech Store';
  location = 'Deliver to Hamilton';

  // Hero section text.
  heroTitle = 'Tech Essentials for Everyday Use';
  heroText = 'Browse featured products, compare prices, and build your order.';

  // Navigation links shown in the second navigation bar.
  navLinks: NavLink[] = [
    { label: 'All', href: '#' },
    { label: "Today's Deals", href: '#products' },
    { label: 'Audio', href: '#products' },
    { label: 'Accessories', href: '#products' },
    { label: 'Monitors', href: '#products' },
    { label: 'Cameras', href: '#products' },
    { label: 'Best Sellers', href: '#products' }
  ];

  // Footer columns shown at the bottom of the page.
  footerColumns: FooterColumn[] = [
    {
      title: 'Get to Know Us',
      links: ['About', 'Careers', 'Blog', 'Store Info']
    },
    {
      title: 'Shop With Us',
      links: ['Audio', 'Accessories', 'Displays', 'Cameras']
    },
    {
      title: 'Support',
      links: ['Your Account', 'Orders', 'Returns', 'Help Center']
    },
    {
      title: 'Teaching Demo',
      links: ['Angular Signals', 'Computed Values', 'Cart State', 'One Page Storefront']
    }
  ];

  // The product list is a signal because later it could change.
  // For now, it starts with hardcoded products.
  products = signal<Product[]>([
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Audio',
      price: 99,
      stock: 5,
      rating: '★★★★☆'
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      price: 75,
      stock: 4,
      rating: '★★★★★'
    },
    {
      id: 3,
      name: 'Gaming Mouse',
      category: 'Accessories',
      price: 40,
      stock: 6,
      rating: '★★★★☆'
    },
    {
      id: 4,
      name: '24" Monitor',
      category: 'Displays',
      price: 220,
      stock: 3,
      rating: '★★★★☆'
    },
    {
      id: 5,
      name: 'HD Webcam',
      category: 'Cameras',
      price: 60,
      stock: 7,
      rating: '★★★★☆'
    },
    {
      id: 6,
      name: 'Bluetooth Speaker',
      category: 'Audio',
      price: 120,
      stock: 2,
      rating: '★★★★☆'
    }
  ]);

  // searchText stores what the user types into the search box.
  searchText = signal('');

  // cart stores the products the user has added.
  // It starts as an empty array.
  cart = signal<CartItem[]>([]);

  // orderPlaced tells us whether the latest order action was successful.
  orderPlaced = signal(false);

  // orderMessage stores the success or error message shown to the user.
  orderMessage = signal('');

  // filteredProducts is calculated from products and searchText.
  // When searchText changes, this value updates automatically.
  filteredProducts = computed(() => {
    const term = this.searchText().toLowerCase().trim();

    if (!term) {
      return this.products();
    }

    return this.products().filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  });

  // totalItems is calculated from the cart.
  // We do not manually store this number.
  totalItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  // cartTotal is calculated from the cart.
  // For each item, multiply price by quantity.
  cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  // This method adds a product to the cart.
  addToCart(product: Product) {
    // Clear any previous order message because the user is editing the cart again.
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items => {
      // Check if this product is already inside the cart.
      const existingItem = items.find(item => item.id === product.id);

      // If the product is not in the cart, add it with quantity 1.
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

      // If the product is already in the cart, increase its quantity.
      // But do not allow quantity to go above available stock.
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

  // Increase quantity of one cart item.
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

  // Decrease quantity of one cart item.
  // If quantity becomes 0, remove the item from the cart.
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

  // Remove one product completely from the cart.
  removeFromCart(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items => items.filter(item => item.id !== itemId));
  }

  // Empty the whole cart.
  clearCart() {
    this.cart.set([]);
    this.orderPlaced.set(false);
    this.orderMessage.set('');
  }

  // Place the order.
  // If the cart is empty, show an error message.
  // If the cart has items, show a success message.
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

# Step 2 — Understand the TypeScript Changes

## We added this import

```ts
import { Component, computed, signal } from '@angular/core';
```

Why?

Because Stage 3 uses Angular signals.

- `signal()` stores reactive data
- `computed()` calculates reactive values

---

## We added FormsModule

```ts
import { FormsModule } from '@angular/forms';
```

Why?

Because the search input uses `ngModel`.

In Angular standalone components, if you use `ngModel`, you must import `FormsModule`.

---

## We added CurrencyPipe

```ts
import { CurrencyPipe } from '@angular/common';
```

Why?

Because the HTML uses:

```html
{{ product.price | currency }}
```

The currency pipe formats numbers as money.

Example:

```txt
99 → $99.00
```

---

# Step 3 — Update `app.html`

The HTML file controls what the user sees.

Replace your `app.html` with this version.

```html
<header class="topbar">
  <div class="topbar-left">
    <div class="logo">mini<span>store</span></div>
    <div class="location">{{ location }}</div>
  </div>

  <div class="search-area">
    <select class="search-category">
      <option>All</option>
      <option>Audio</option>
      <option>Accessories</option>
      <option>Displays</option>
      <option>Cameras</option>
    </select>

    <input
      type="text"
      [ngModel]="searchText()"
      (ngModelChange)="searchText.set($event)"
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
      🛒 <strong>Cart ({{ totalItems() }})</strong>
    </div>
  </div>
</header>

<nav class="subnav">
  @for (link of navLinks; track link.label) {
    <a [href]="link.href">{{ link.label }}</a>
  }
</nav>

<section class="hero">
  <div class="hero-content">
    <h1>{{ heroTitle }}</h1>
    <p>{{ heroText }}</p>
  </div>
</section>

<main class="page-content">
  <section id="products" class="products-section">
    <div class="section-title-row">
      <div>
        <h2>Featured Products</h2>
        <p>Angular signals storefront version</p>
      </div>
    </div>

    @if (filteredProducts().length === 0) {
      <div class="empty-panel">
        <p>No matching products found.</p>
      </div>
    } @else {
      <div class="products-grid">
        @for (product of filteredProducts(); track product.id) {
          <article class="product-card">
            <div class="product-image">Image</div>
            <h3>{{ product.name }}</h3>
            <p class="product-category">Category: {{ product.category }}</p>
            <p class="product-rating">{{ product.rating }}</p>
            <p class="product-price">{{ product.price | currency }}</p>
            <p class="product-stock">Stock: {{ product.stock }}</p>
            <button class="cart-btn" (click)="addToCart(product)">Add to Cart</button>
          </article>
        }
      </div>
    }
  </section>

  <aside class="summary-section">
    <div class="summary-card">
      <h2>Order Summary</h2>
      <p><strong>Items:</strong> {{ totalItems() }}</p>
      <p><strong>Total:</strong> {{ cartTotal() | currency }}</p>

      @if (cart().length > 0) {
        <button class="buy-btn" (click)="placeOrder()">Proceed to Checkout</button>
        <button class="clear-btn" (click)="clearCart()">Clear Cart</button>
      } @else {
        <p class="empty-message">Add items to see your summary.</p>
      }

      @if (orderMessage()) {
        <div class="status-box" [class.success]="orderPlaced()" [class.error]="!orderPlaced()">
          {{ orderMessage() }}
        </div>
      }
    </div>

    <div class="cart-preview">
      <h3>Your Cart</h3>

      @if (cart().length === 0) {
        <p class="empty-message">Your cart is empty.</p>
      } @else {
        @for (item of cart(); track item.id) {
          <div class="cart-item">
            <div class="cart-item-info">
              <strong>{{ item.name }}</strong>
              <p>{{ item.price | currency }} x {{ item.quantity }}</p>
              <p class="line-total">Subtotal: {{ item.price * item.quantity | currency }}</p>

              @if (item.quantity === item.stock) {
                <p class="warning-text">Maximum stock reached</p>
              }
            </div>

            <div class="cart-controls">
              <button class="qty-btn" (click)="increaseQuantity(item.id)" [disabled]="item.quantity === item.stock">+</button>
              <button class="qty-btn" (click)="decreaseQuantity(item.id)">-</button>
              <button class="remove-btn" (click)="removeFromCart(item.id)">Remove</button>
            </div>
          </div>
        }
      }
    </div>
  </aside>
</main>

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

# Step 4 — Understand the HTML Changes

## Search input

```html
<input
  type="text"
  [ngModel]="searchText()"
  (ngModelChange)="searchText.set($event)"
  placeholder="Search {{ storeName }}"
/>
```

This connects the input box to the `searchText` signal.

This part reads the current value:

```html
[ngModel]="searchText()"
```

This part updates the signal when the user types:

```html
(ngModelChange)="searchText.set($event)"
```

`$event` means the new value coming from the input.

---

## Cart count

```html
Cart ({{ totalItems() }})
```

This shows the computed total number of items in the cart.

When cart changes, this updates automatically.

---

## Product filtering

```html
@if (filteredProducts().length === 0) {
  <div class="empty-panel">
    <p>No matching products found.</p>
  </div>
}
```

This shows a message when no products match the search.

---

## Product loop

```html
@for (product of filteredProducts(); track product.id) {
```

This loops through the filtered products, not the full products list.

That means search affects what appears on the screen.

---

## Add to cart button

```html
<button class="cart-btn" (click)="addToCart(product)">Add to Cart</button>
```

When clicked, this sends the selected product to the `addToCart()` method.

---

## Conditional cart display

```html
@if (cart().length === 0) {
  <p class="empty-message">Your cart is empty.</p>
} @else {
  ...
}
```

This is a common UI pattern.

If there is no data, show an empty message.
If there is data, show the list.

---

# Step 5 — Update `app.css`

The CSS controls the storefront look.

Use this Stage 3 CSS.

```css
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #eaeef2;
  color: #111;
}

a {
  text-decoration: none;
  color: inherit;
}

/* Top Bar */
.topbar {
  background: #131921;
  color: white;
  display: grid;
  grid-template-columns: 220px 1fr 320px;
  gap: 16px;
  align-items: center;
  padding: 12px 20px;
}

.topbar-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.3px;
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
  font-size: 0.95rem;
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
  color: #111;
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
  line-height: 1.2;
}

.nav-box small {
  color: #d1d5db;
  font-size: 0.75rem;
}

.nav-box strong {
  font-size: 0.9rem;
}

.cart-box {
  font-size: 1rem;
  white-space: nowrap;
}

/* Subnav */
.subnav {
  background: #232f3e;
  color: white;
  display: flex;
  gap: 18px;
  padding: 10px 20px;
  flex-wrap: wrap;
  font-size: 0.92rem;
}

/* Hero */
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
  font-size: 1rem;
}

/* Layout */
.page-content {
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 16px 32px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.products-section,
.summary-section {
  min-width: 0;
}

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

/* Products */
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
  line-height: 1.4;
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
  font-size: 0.95rem;
}

.product-price {
  margin: 8px 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #111827;
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

/* Summary */
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

.buy-btn:hover {
  background: #f7ca00;
}

.clear-btn {
  background: #eaecf0;
  color: #111827;
}

.empty-message {
  color: #666;
  margin-top: 12px;
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

/* Cart */
.cart-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #e5e7eb;
  padding: 12px 0;
  align-items: flex-start;
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

/* Footer */
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
  font-size: 0.95rem;
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
  font-size: 1rem;
}

.footer-column a {
  display: block;
  color: #d1d5db;
  margin-bottom: 10px;
  font-size: 0.92rem;
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

/* Responsive */
@media (max-width: 1100px) {
  .topbar {
    grid-template-columns: 1fr;
  }

  .topbar-right {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .page-content {
    grid-template-columns: 1fr;
  }

  .footer-main {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .search-area {
    flex-direction: column;
    height: auto;
    border-radius: 8px;
    overflow: visible;
    gap: 8px;
    background: transparent;
  }

  .search-category,
  .search-area input,
  .search-btn {
    height: 42px;
    border-radius: 8px;
  }

  .search-area input {
    border: none;
  }

  .footer-main {
    grid-template-columns: 1fr;
  }

  .cart-item {
    flex-direction: column;
  }
}
```

---

# Step 6 — Run the App

Run:

```bash
ng serve
```

Then open the browser at:

```txt
http://localhost:4200
```

Test these actions:

1. Search for `mouse`
2. Search for `audio`
3. Click **Add to Cart**
4. Increase quantity
5. Decrease quantity
6. Remove an item
7. Clear the cart
8. Place an order
9. Try placing an order when the cart is empty

---

# Step 7 — Common Errors and Fixes

## Error: No pipe found with name `currency`

Cause:

You used:

```html
{{ product.price | currency }}
```

but forgot to import `CurrencyPipe`.

Fix:

```ts
import { CurrencyPipe } from '@angular/common';
```

And inside the component:

```ts
imports: [FormsModule, CurrencyPipe]
```

---

## Error: Can't bind to `ngModel`

Cause:

You used `ngModel` but forgot `FormsModule`.

Fix:

```ts
import { FormsModule } from '@angular/forms';
```

And:

```ts
imports: [FormsModule, CurrencyPipe]
```

---

## Error: Signal value not showing correctly

Wrong:

```html
{{ totalItems }}
```

Correct:

```html
{{ totalItems() }}
```

Signals and computed values must be called like functions when reading them.

---

## Error: Cart does not update

Check whether you used:

```ts
this.cart.update(...)
```

Do not directly mutate the cart array.

Avoid this:

```ts
this.cart().push(newItem);
```

That is a bad habit.

Use signal update instead.

---

# Step 8 — Key Concepts to Remember

## `signal()`

Stores data that can change.

```ts
cart = signal<CartItem[]>([]);
```

---

## `computed()`

Calculates data from signals.

```ts
cartTotal = computed(() =>
  this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
);
```

---

## `@for`

Repeats HTML for every item in an array.

```html
@for (product of filteredProducts(); track product.id) {
  ...
}
```

---

## `@if`

Shows or hides HTML based on a condition.

```html
@if (cart().length === 0) {
  <p>Your cart is empty.</p>
}
```

---

## Event binding

Runs code when the user does something.

```html
<button (click)="addToCart(product)">Add to Cart</button>
```

---

## Property binding

Sets an HTML property from TypeScript.

```html
<button [disabled]="item.quantity === item.stock">+</button>
```

---

# Step 9 — Why This Stage Matters

Stage 3 is the first Stage where the app has real behavior.

This Stage teaches the foundation of frontend development:

```txt
State → Template → User Action → State Update → UI Update
```

That cycle is everywhere in modern frontend development.

React, Angular, Vue, Svelte, and many other frameworks all use some version of this idea.

---

# Step 10 — What Not to Do Yet

Do not add components yet.

Do not add routing yet.

Do not add backend yet.

Do not add localStorage yet.

Do not add services yet.

Why?

Because students first need to understand how state works in one place.

If you split the app too early, students may memorize file movement without understanding the actual logic.

---

# Stage 3 Summary

In this Stage, you upgraded the storefront from a static Angular template into an interactive app.

You learned:

- how to use `signal()`
- how to use `computed()`
- how to connect input fields using `ngModel`
- how to filter products
- how to add items to a cart
- how to update quantities
- how to remove items
- how to calculate totals
- how to show success and error messages
- how to use `@if` and `@for` with real app state

This is the real turning point of the project.

Stage 1 was structure.
Stage 2 was Angular data display.
Stage 3 is interactive state.

Next Stage: polish the behavior, category filtering, stock indicators, and better cart UX.
