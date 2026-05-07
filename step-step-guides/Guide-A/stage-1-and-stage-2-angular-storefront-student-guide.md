# Stage 1 and Stage 2 — From Static Storefront to Angular Static Template

## Student-Centric Step-by-Step Guide

---

## 0. Big Picture

In this project, we are building a small online storefront called:

```txt
Mini Tech Store
```

The project will grow step by step.

We are not jumping straight into advanced Angular.

We are building the same way real projects often grow:

```txt
First, make the page visible.
Then, make it data-driven.
Then, make it reactive.
Then, make it organized.
Then, make it scalable.
```

This guide covers the first two stages:

```txt
Stage 1 → Static HTML/CSS storefront
Stage 2 → Angular static template
```

---

# Part 1 — Stage 1: Static HTML/CSS Storefront

---

# 1. What Is Stage 1 For?

Stage 1 is for building the **visual structure** of the app.

At this point, we are not using Angular logic.

We are only using:

```txt
HTML
CSS
```

The goal is to build the page that users can see.

---

# 2. Why Start with HTML/CSS?

Before adding Angular, students should understand the page structure.

A weak Angular app usually starts with weak HTML/CSS.

If the layout is confusing, Angular will only make the confusion worse.

So first, we build a clean storefront skeleton.

---

# 3. What We Are Building in Stage 1

The page will have:

```txt
Top navbar
Search bar
Secondary navigation
Hero section
Product grid
Order summary
Cart preview
Footer
```

This gives us a realistic shopping page layout.

---

# 4. Stage 1 Mental Model

Think of Stage 1 like building the empty store building.

```txt
We are creating:
- the entrance
- the shelves
- the checkout counter
- the information area
```

But nothing is alive yet.

Buttons do not really work.

Search does not really work.

Cart does not really update.

That is okay.

Stage 1 is about structure and design.

---

# 5. Create the Static Files

Create a simple folder for the HTML/CSS version.

Example:

```txt
mini-tech-store-stage-1/
├── index.html
└── style.css
```

---

# 6. Stage 1 `index.html`

Create:

```txt
index.html
```

Paste this code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- The character set tells the browser how to read text. -->
  <meta charset="UTF-8" />

  <!-- Makes the page responsive on phones, tablets, and desktops. -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Mini Tech Store Skeleton</title>

  <!-- Connects the CSS file to this HTML file. -->
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- Topbar: logo, location, search, account area, cart. -->
  <header class="topbar">
    <div class="topbar-left">
      <div class="logo">mini<span>store</span></div>
      <div class="location">Deliver to Hamilton</div>
    </div>

    <!-- In Stage 1 this looks real, but it does not search yet. -->
    <div class="search-area">
      <select class="search-category">
        <option>All</option>
        <option>Audio</option>
        <option>Accessories</option>
        <option>Displays</option>
        <option>Cameras</option>
      </select>

      <input type="text" placeholder="Search Mini Tech Store" />

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
        🛒 <strong>Cart</strong>
      </div>
    </div>
  </header>

  <!-- Secondary navigation gives the page a storefront feel. -->
  <nav class="subnav">
    <a href="#">All</a>
    <a href="#">Today's Deals</a>
    <a href="#">Audio</a>
    <a href="#">Accessories</a>
    <a href="#">Monitors</a>
    <a href="#">Cameras</a>
    <a href="#">Best Sellers</a>
  </nav>

  <!-- Hero section introduces the store. -->
  <section class="hero">
    <div class="hero-content">
      <h1>Tech Essentials for Everyday Use</h1>
      <p>Browse featured products, compare prices, and build your order.</p>
    </div>
  </section>

  <!-- Main page layout: products on left, summary on right. -->
  <main class="page-content">
    <section class="products-section">
      <div class="section-title-row">
        <h2>Featured Products</h2>
        <p>Hardcoded skeleton for HTML/CSS teaching</p>
      </div>

      <div class="products-grid">
        <article class="product-card">
          <div class="product-image">Image</div>
          <h3>Wireless Headphones</h3>
          <p class="product-category">Category: Audio</p>
          <p class="product-rating">★★★★☆</p>
          <p class="product-price">$99.00</p>
          <p class="product-stock">In Stock</p>
          <button class="cart-btn">Add to Cart</button>
        </article>

        <article class="product-card">
          <div class="product-image">Image</div>
          <h3>Mechanical Keyboard</h3>
          <p class="product-category">Category: Accessories</p>
          <p class="product-rating">★★★★★</p>
          <p class="product-price">$75.00</p>
          <p class="product-stock">In Stock</p>
          <button class="cart-btn">Add to Cart</button>
        </article>

        <article class="product-card">
          <div class="product-image">Image</div>
          <h3>Gaming Mouse</h3>
          <p class="product-category">Category: Accessories</p>
          <p class="product-rating">★★★★☆</p>
          <p class="product-price">$40.00</p>
          <p class="product-stock">In Stock</p>
          <button class="cart-btn">Add to Cart</button>
        </article>

        <article class="product-card">
          <div class="product-image">Image</div>
          <h3>24&quot; Monitor</h3>
          <p class="product-category">Category: Displays</p>
          <p class="product-rating">★★★★☆</p>
          <p class="product-price">$220.00</p>
          <p class="product-stock">Limited Stock</p>
          <button class="cart-btn">Add to Cart</button>
        </article>

        <article class="product-card">
          <div class="product-image">Image</div>
          <h3>HD Webcam</h3>
          <p class="product-category">Category: Cameras</p>
          <p class="product-rating">★★★★☆</p>
          <p class="product-price">$60.00</p>
          <p class="product-stock">In Stock</p>
          <button class="cart-btn">Add to Cart</button>
        </article>

        <article class="product-card">
          <div class="product-image">Image</div>
          <h3>Bluetooth Speaker</h3>
          <p class="product-category">Category: Audio</p>
          <p class="product-rating">★★★★☆</p>
          <p class="product-price">$120.00</p>
          <p class="product-stock">Only 2 Left</p>
          <button class="cart-btn">Add to Cart</button>
        </article>
      </div>
    </section>

    <!-- Aside supports the main product area. -->
    <aside class="summary-section">
      <div class="summary-card">
        <h2>Order Summary</h2>
        <p><strong>Items:</strong> 3</p>
        <p><strong>Total:</strong> $214.00</p>
        <button class="buy-btn">Proceed to Checkout</button>
        <button class="clear-btn">Clear Cart</button>
      </div>

      <div class="cart-preview">
        <h3>Your Cart</h3>

        <div class="cart-item">
          <div>
            <strong>Wireless Headphones</strong>
            <p>$99.00 x 1</p>
          </div>
          <span>$99.00</span>
        </div>

        <div class="cart-item">
          <div>
            <strong>Gaming Mouse</strong>
            <p>$40.00 x 2</p>
          </div>
          <span>$80.00</span>
        </div>

        <div class="cart-item">
          <div>
            <strong>HD Webcam</strong>
            <p>$35.00 x 1</p>
          </div>
          <span>$35.00</span>
        </div>
      </div>
    </aside>
  </main>

  <!-- Footer completes the page. -->
  <footer class="footer">
    <div class="footer-backtop">
      <a href="#">Back to top</a>
    </div>

    <div class="footer-main">
      <div class="footer-column">
        <h4>Get to Know Us</h4>
        <a href="#">About</a>
        <a href="#">Careers</a>
        <a href="#">Blog</a>
        <a href="#">Store Info</a>
      </div>

      <div class="footer-column">
        <h4>Shop With Us</h4>
        <a href="#">Audio</a>
        <a href="#">Accessories</a>
        <a href="#">Displays</a>
        <a href="#">Cameras</a>
      </div>

      <div class="footer-column">
        <h4>Support</h4>
        <a href="#">Your Account</a>
        <a href="#">Orders</a>
        <a href="#">Returns</a>
        <a href="#">Help Center</a>
      </div>

      <div class="footer-column">
        <h4>Teaching Demo</h4>
        <p>This footer is part of the HTML/CSS-only storefront skeleton version.</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 Mini Tech Store. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
```

---

# 7. Stage 1 `style.css`

Create:

```txt
style.css
```

Paste this code:

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

.subnav {
  background: #232f3e;
  color: white;
  display: flex;
  gap: 18px;
  padding: 10px 20px;
  flex-wrap: wrap;
  font-size: 0.92rem;
}

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
.clear-btn {
  width: 100%;
  border: none;
  padding: 11px 14px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
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

.cart-item p {
  margin: 4px 0 0;
  color: #666;
  font-size: 0.9rem;
}

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

.footer-column a,
.footer-column p {
  display: block;
  color: #d1d5db;
  margin-bottom: 10px;
  font-size: 0.92rem;
  line-height: 1.5;
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
}
```

---

# 8. Stage 1 Checkpoint

After Stage 1, students should see:

```txt
A complete storefront page
```

It should have:

- top navbar
- search bar
- product cards
- summary panel
- cart preview
- footer
- responsive layout

But nothing is truly dynamic yet.

That is expected.

---

# 9. What Students Should Understand After Stage 1

Students should be able to explain:

- what `header` is used for
- what `nav` is used for
- what `main` is used for
- what `section` is used for
- what `aside` is used for
- what `footer` is used for
- how CSS Grid creates layout
- how product cards repeat visually
- why the footer completes the page

---

# 10. Stage 1 Summary

Stage 1 answers this question:

> What should the app look like?

It does not answer:

> How should the app behave?

That comes next.

---

# Part 2 — Stage 2: Angular Static Template

---

# 11. What Is Stage 2 For?

Stage 2 converts the static HTML/CSS page into an Angular template.

The page will still mostly look the same.

But now data will come from TypeScript instead of being repeated manually in HTML.

---

# 12. Why Stage 2 Matters

In Stage 1, product cards were hardcoded.

That means every product was written manually in HTML.

Example:

```html
<article class="product-card">
  <h3>Wireless Headphones</h3>
</article>

<article class="product-card">
  <h3>Mechanical Keyboard</h3>
</article>
```

That is okay for HTML practice.

But it is not how real apps work.

In Angular, we store data in TypeScript and let the template display it.

---

# 13. Stage 2 Mental Model

Stage 2 moves us from:

```txt
Hardcoded HTML
```

to:

```txt
Data-driven template
```

The UI is still static in behavior, but it is now generated from data.

---

# 14. Angular Project Files

In your Angular app, we mainly use:

```txt
src/app/app.ts
src/app/app.html
src/app/app.css
```

For this stage:

```txt
app.ts → stores the data
app.html → displays the data
app.css → styles the page
```

---

# 15. Update `app.ts`

Open:

```txt
src/app/app.ts
```

Use this code.

## `app.ts`

```ts
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

/* Product describes the shape of one product object. */
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stockText: string;
  rating: string;
};

/* NavLink describes one navbar link. */
type NavLink = {
  label: string;
  href: string;
};

/* FooterColumn describes one footer section. */
type FooterColumn = {
  title: string;
  links: string[];
};

@Component({
  selector: 'app-root',

  /* CurrencyPipe is needed because app.html uses: {{ product.price | currency }} */
  imports: [CurrencyPipe],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  storeName = 'Mini Tech Store';
  location = 'Deliver to Hamilton';

  heroTitle = 'Tech Essentials for Everyday Use';
  heroText = 'Browse featured products, compare prices, and build your order.';

  navLinks: NavLink[] = [
    { label: 'All', href: '#' },
    { label: "Today's Deals", href: '#' },
    { label: 'Audio', href: '#products' },
    { label: 'Accessories', href: '#products' },
    { label: 'Monitors', href: '#products' },
    { label: 'Cameras', href: '#products' },
    { label: 'Best Sellers', href: '#products' }
  ];

  products: Product[] = [
    { id: 1, name: 'Wireless Headphones', category: 'Audio', price: 99, stockText: 'In Stock', rating: '★★★★☆' },
    { id: 2, name: 'Mechanical Keyboard', category: 'Accessories', price: 75, stockText: 'In Stock', rating: '★★★★★' },
    { id: 3, name: 'Gaming Mouse', category: 'Accessories', price: 40, stockText: 'In Stock', rating: '★★★★☆' },
    { id: 4, name: '24" Monitor', category: 'Displays', price: 220, stockText: 'Limited Stock', rating: '★★★★☆' },
    { id: 5, name: 'HD Webcam', category: 'Cameras', price: 60, stockText: 'In Stock', rating: '★★★★☆' },
    { id: 6, name: 'Bluetooth Speaker', category: 'Audio', price: 120, stockText: 'Only 2 Left', rating: '★★★★☆' }
  ];

  footerColumns: FooterColumn[] = [
    { title: 'Get to Know Us', links: ['About', 'Careers', 'Blog', 'Store Info'] },
    { title: 'Shop With Us', links: ['Audio', 'Accessories', 'Displays', 'Cameras'] },
    { title: 'Support', links: ['Your Account', 'Orders', 'Returns', 'Help Center'] },
    { title: 'Teaching Demo', links: ['Angular Template', 'HTML Structure', 'CSS Layout', 'Static Storefront'] }
  ];

  /* Static summary values for Stage 2. These become dynamic in Stage 3. */
  summaryItems = 3;
  summaryTotal = 214;

  /* Static cart preview for Stage 2. This does not update yet. */
  cartPreview = [
    { name: 'Wireless Headphones', details: '$99.00 x 1', total: '$99.00' },
    { name: 'Gaming Mouse', details: '$40.00 x 2', total: '$80.00' },
    { name: 'HD Webcam', details: '$35.00 x 1', total: '$35.00' }
  ];
}
```

---

# 16. What Changed in `app.ts`?

Stage 2 introduces data objects.

Instead of hardcoding all products in HTML, we now have:

```ts
products: Product[] = [...]
```

This means:

> The product information lives in TypeScript.

The HTML will display it.

---

# 17. Update `app.html`

Open:

```txt
src/app/app.html
```

Use this code.

## `app.html`

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

    <!-- Angular replaces {{ storeName }} with the value from app.ts. -->
    <input type="text" placeholder="Search {{ storeName }}" />

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
      🛒 <strong>Cart</strong>
    </div>
  </div>
</header>

<!-- @for loops through navLinks from app.ts. -->
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
      <h2>Featured Products</h2>
      <p>Angular static template version</p>
    </div>

    <!-- One product object creates one product card. -->
    <div class="products-grid">
      @for (product of products; track product.id) {
        <article class="product-card">
          <div class="product-image">Image</div>

          <h3>{{ product.name }}</h3>
          <p class="product-category">Category: {{ product.category }}</p>
          <p class="product-rating">{{ product.rating }}</p>
          <p class="product-price">{{ product.price | currency }}</p>
          <p class="product-stock">{{ product.stockText }}</p>

          <button class="cart-btn">Add to Cart</button>
        </article>
      }
    </div>
  </section>

  <aside class="summary-section">
    <div class="summary-card">
      <h2>Order Summary</h2>
      <p><strong>Items:</strong> {{ summaryItems }}</p>
      <p><strong>Total:</strong> {{ summaryTotal | currency }}</p>

      <button class="buy-btn">Proceed to Checkout</button>
      <button class="clear-btn">Clear Cart</button>
    </div>

    <div class="cart-preview">
      <h3>Your Cart</h3>

      @for (item of cartPreview; track item.name) {
        <div class="cart-item">
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.details }}</p>
          </div>

          <span>{{ item.total }}</span>
        </div>
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

# 18. Stage 2 `app.css`

Use the same CSS from Stage 1.

In Angular, paste the CSS into:

```txt
src/app/app.css
```

The visual design stays the same.

The important change is not CSS.

The important change is:

```txt
HTML repetition → Angular data binding and loops
```

---

# 19. Stage 2 New Angular Concepts

## 1. Interpolation

Example:

```html
{{ storeName }}
```

Meaning:

> Display the value of `storeName` from TypeScript.

---

## 2. Property Binding

Example:

```html
<a [href]="link.href">
```

Meaning:

> Set the href using a value from TypeScript.

---

## 3. `@for`

Example:

```html
@for (product of products; track product.id) {
  ...
}
```

Meaning:

> Repeat this HTML block once for each product.

---

## 4. Pipe

Example:

```html
{{ product.price | currency }}
```

Meaning:

> Format the number as currency.

---

# 20. Why `track product.id`?

This part:

```html
track product.id
```

helps Angular identify each product.

If the list changes later, Angular can update the page more efficiently.

Think of `id` like a student number.

Names can repeat.

IDs should be unique.

---

# 21. Stage 2 Checkpoint

After Stage 2, the app should look almost the same as Stage 1.

But internally, it is better.

The product cards are now created from:

```ts
products: Product[]
```

The footer is created from:

```ts
footerColumns: FooterColumn[]
```

The nav links are created from:

```ts
navLinks: NavLink[]
```

---

# 22. What Stage 2 Does NOT Do Yet

Stage 2 does not yet make the app fully interactive.

At this point:

- search does not filter products
- Add to Cart does not update the cart
- totals do not calculate automatically
- clear cart does not clear anything
- checkout does not place an order

That is okay.

Those come in Stage 3.

---

# 23. Why We Do Not Add Signals Yet

Students may ask:

> Why not make everything dynamic right now?

Because we are building in layers.

Stage 2 is only about:

```txt
Template + data
```

Stage 3 is about:

```txt
Reactive state
```

If we mix everything too early, students will copy code without understanding the purpose.

---

# 24. Stage 1 vs Stage 2

| Question | Stage 1 | Stage 2 |
|---|---|---|
| Main tool | HTML/CSS | Angular template |
| Product cards | Manually repeated | Generated with `@for` |
| Data location | HTML | TypeScript |
| Search works? | No | No |
| Cart works? | No | No |
| Goal | Build the look | Connect the look to data |

---

# 25. Linear Progress So Far

```txt
Stage 1:
Build the visual storefront.

Stage 2:
Move repeated content into TypeScript data and display it with Angular.

Stage 3:
Make the data change and make the UI react.
```

---

# 26. Simple Student Explanation

Use this explanation:

> In Stage 1, we built the page by hand.  
> In Stage 2, we taught Angular how to build repeated parts for us.  
> In Stage 3, we will make the page respond when users interact with it.

---

# 27. Common Errors and Fixes

## Error: No pipe found with name `currency`

Fix:

In `app.ts`, add:

```ts
import { CurrencyPipe } from '@angular/common';
```

And include it in the component:

```ts
imports: [CurrencyPipe]
```

---

## Error: `@for` does not work

Possible causes:

- Angular version is older
- syntax is written incorrectly

Correct syntax:

```html
@for (product of products; track product.id) {
  <p>{{ product.name }}</p>
}
```

---

## Error: Product cards do not show

Check:

```ts
products: Product[] = [...]
```

and:

```html
@for (product of products; track product.id)
```

The names must match.

---

## Error: Page has no styling

Check that CSS is in the right file:

```txt
src/app/app.css
```

And `app.ts` has:

```ts
styleUrl: './app.css'
```

---

## Error: href is not working

In Stage 2, this is okay:

```html
<a [href]="link.href">
```

Later, when we introduce routing, we will use:

```html
routerLink
```

Do not worry about that yet.

---

# 28. Teacher Checkpoints

Use these checkpoints in class.

## Checkpoint 1

Stage 1 HTML/CSS page displays correctly.

## Checkpoint 2

Angular project runs.

```bash
ng serve
```

## Checkpoint 3

Store name displays from TypeScript.

```html
{{ storeName }}
```

## Checkpoint 4

Nav links display using `@for`.

## Checkpoint 5

Products display using `@for`.

## Checkpoint 6

Prices display using `currency`.

## Checkpoint 7

Footer columns display using nested `@for`.

---

# 29. What Students Should Be Able to Explain

After Stage 1 and Stage 2, students should explain:

- why we started with HTML/CSS
- what a storefront skeleton is
- why repeated HTML is a problem
- how TypeScript data can drive HTML
- what interpolation does
- what `@for` does
- what `track` does
- why Stage 2 is not fully interactive yet

---

# 30. The Big Learning Message

Do not rush to functionality.

Good apps are built in layers.

```txt
Look
→ Data
→ Reactivity
→ Components
→ Services
→ Routing
```

Stage 1 and Stage 2 are the foundation.

If the foundation is weak, the rest of the app becomes harder.

---

# 31. Final Summary

## Stage 1

```txt
We built the storefront with static HTML/CSS.
```

Goal:

```txt
Make it visible.
```

---

## Stage 2

```txt
We converted repeated HTML into Angular template-driven data.
```

Goal:

```txt
Make it data-driven.
```

---

## Next Stage

Stage 3 will make it reactive.

That means:

```txt
User actions change data.
Data changes update the UI automatically.
```
