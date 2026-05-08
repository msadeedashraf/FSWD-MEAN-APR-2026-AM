# Stage 8 — Product Images and Product Detail Polish

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By the end of Stage 7, the storefront behaves much more like a real Angular app.

The app already has:

- product listing page
- cart page
- checkout page
- product details page
- dynamic route parameters
- shared `StoreService`
- cart state
- search and category filtering
- add to cart
- remove from cart
- order summary
- checkout flow
- cart persistence with `localStorage`

That is a strong app.

But visually, the product experience still feels like a classroom demo because product cards still use placeholders like:

```txt
Product Image
```

In Stage 8, we make the app feel more like a real online store.

---

# 1. What Is Stage 8 For?

Stage 8 improves the product presentation.

We will add:

- product images
- product descriptions
- rating count
- delivery text
- badge text
- better product cards
- better product details page
- more realistic storefront content

This stage is mainly about:

```txt
Making the product catalog feel real.
```

---

# 2. Why This Stage Matters

A shopping app is not just logic.

A shopping app must help users make buying decisions.

Right now, the app can:

```txt
Add products to cart
Search products
Filter products
Persist cart
Navigate pages
```

But users still cannot see enough product information.

Stage 8 improves that.

---

# 3. Stage 8 Mental Model

Previous stages focused on structure and behavior.

```txt
Stage 3 → Make it work
Stage 4 → Make it smarter
Stage 5 → Make it clean
Level 4 → Move state to service
Level 5 → Add pages
Stage 6 → Add product details route
Stage 7 → Save cart after refresh
```

Stage 8 now asks:

> Can this product catalog feel believable?

---

# 4. What Students Will Learn

By the end of Stage 8, students should understand:

- how to extend a TypeScript model
- how to update product data safely
- how to display images with property binding
- how to use `alt` text for accessibility
- how to improve product cards without breaking logic
- how product details pages can show richer data
- how UI polish supports user trust
- why data shape matters

---

# 5. What Will Change?

We will update the `Product` model.

Before Stage 8:

```ts
export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;
};
```

After Stage 8:

```ts
export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;
  ratingCount: number;
  imageUrl: string;
  description: string;
  deliveryText: string;
  badge: string;
};
```

This gives the UI more data to display.

---

# 6. Important Teaching Point

When the UI needs more information, the data model must support it.

Bad approach:

```html
<p>Fast delivery</p>
```

hardcoded inside every card.

Better approach:

```ts
deliveryText: 'Free delivery tomorrow'
```

and then:

```html
{{ product.deliveryText }}
```

This keeps content in the data layer and display in the template.

---

# 7. Step 1 — Update the Product Model

Open:

```txt
src/app/models/store.models.ts
```

Update the `Product` type.

## `store.models.ts`

```ts
export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;

  // Number of people who rated/reviewed this product.
  ratingCount: number;

  // Image shown on product card and product details page.
  imageUrl: string;

  // Short product explanation shown on product details page.
  description: string;

  // Delivery or shipping message.
  deliveryText: string;

  // Small marketing label such as Best Seller or Limited Stock.
  badge: string;
};

export type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;
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

# 8. Why Add These Fields?

## `ratingCount`

Makes ratings feel more real.

```txt
★★★★☆ (128)
```

is more believable than:

```txt
★★★★☆
```

## `imageUrl`

Lets the product card show an actual image.

## `description`

Helps the product details page explain the product.

## `deliveryText`

Makes the product card feel like a real shopping experience.

Examples:

```txt
Free delivery tomorrow
Ships in 2 days
Pickup available
```

## `badge`

Adds quick marketing signals.

Examples:

```txt
Best Seller
Limited Stock
New Arrival
Deal
```

---

# 9. Step 2 — Update Product Data in StoreService

Open:

```txt
src/app/services/store.service.ts
```

Find:

```ts
products = signal<Product[]>([
  ...
]);
```

Replace the product array with this richer version.

## Updated products array

```ts
products = signal<Product[]>([
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Audio',
    price: 99,
    stock: 5,
    rating: '★★★★☆',
    ratingCount: 128,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Comfortable wireless headphones with clear sound, soft ear cushions, and long battery life for daily use.',
    deliveryText: 'Free delivery tomorrow',
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    price: 75,
    stock: 4,
    rating: '★★★★★',
    ratingCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    description: 'A responsive mechanical keyboard built for typing, coding, and gaming with satisfying key feedback.',
    deliveryText: 'Ships in 2 days',
    badge: 'Top Rated'
  },
  {
    id: 3,
    name: 'Gaming Mouse',
    category: 'Accessories',
    price: 40,
    stock: 6,
    rating: '★★★★☆',
    ratingCount: 214,
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80',
    description: 'Lightweight gaming mouse with smooth tracking, comfortable grip, and quick response for everyday work or gaming.',
    deliveryText: 'Free delivery this week',
    badge: 'Deal'
  },
  {
    id: 4,
    name: '24" Monitor',
    category: 'Displays',
    price: 220,
    stock: 3,
    rating: '★★★★☆',
    ratingCount: 64,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    description: 'A sharp 24-inch monitor for school, office work, coding, streaming, and multi-tasking setups.',
    deliveryText: 'Delivery available in 3 days',
    badge: 'Limited Stock'
  },
  {
    id: 5,
    name: 'HD Webcam',
    category: 'Cameras',
    price: 60,
    stock: 7,
    rating: '★★★★☆',
    ratingCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80',
    description: 'HD webcam for online classes, meetings, interviews, and content creation with clear video quality.',
    deliveryText: 'Pickup available',
    badge: 'New Arrival'
  },
  {
    id: 6,
    name: 'Bluetooth Speaker',
    category: 'Audio',
    price: 120,
    stock: 2,
    rating: '★★★★☆',
    ratingCount: 77,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    description: 'Portable Bluetooth speaker with strong sound, compact design, and reliable wireless playback.',
    deliveryText: 'Only 2 left — order soon',
    badge: 'Low Stock'
  }
]);
```

---

# 10. Important Note About Online Images

The image URLs above use online images.

That means students need internet access for images to load.

If images do not load, the app still works, but the visual polish is reduced.

Later, you can teach local assets by placing images inside:

```txt
src/assets/
```

For Stage 8, online images are simpler.

---

# 11. Step 3 — Update Product Card HTML

Open:

```txt
src/app/components/product-list/product-list.html
```

Find this old placeholder:

```html
<div class="product-image">Image</div>
```

Replace it with:

```html
<div class="product-image">
  <img [src]="product.imageUrl" [alt]="product.name" />
</div>
```

## Why?

This uses property binding.

```html
[src]="product.imageUrl"
```

means:

> Use the image URL from the product object.

```html
[alt]="product.name"
```

means:

> Use the product name as the image description.

This is better for accessibility.

---

# 12. Update Full Product Card

Replace your product card with this improved version.

## `product-list.html` card section

```html
<article class="product-card">
  <div class="product-image">
    <img [src]="product.imageUrl" [alt]="product.name" />
  </div>

  <div class="product-body">
    <p class="product-badge">
      {{ product.badge }}
    </p>

    <h3>{{ product.name }}</h3>

    <p class="product-category">
      Category: {{ product.category }}
    </p>

    <p class="product-rating">
      {{ product.rating }}
      <span>({{ product.ratingCount }})</span>
    </p>

    <p class="product-price">
      {{ product.price | currency }}
    </p>

    <p class="product-delivery">
      {{ product.deliveryText }}
    </p>

    <p class="product-stock">
      Stock: {{ product.stock }}
    </p>

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
  </div>
</article>
```

---

# 13. Why Add `product-body`?

The product card now has two clear parts:

```txt
product-image
product-body
```

This makes CSS cleaner.

The image is one section.

The text and buttons are another section.

That is a better structure.

---

# 14. Step 4 — Update Product Card CSS

Open:

```txt
src/app/components/product-list/product-list.css
```

Update or add these styles.

## Product image styles

```css
.product-image {
  height: 180px;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  margin: -16px -16px 14px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## Why use `object-fit: cover`?

Images can have different sizes and shapes.

```css
object-fit: cover;
```

means:

> Fill the image box without stretching the image badly.

It may crop a little, but it keeps the card clean.

---

## Product body and badge styles

```css
.product-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-badge {
  align-self: flex-start;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 0.78rem;
  font-weight: 700;
  margin: 0 0 10px;
}
```

## Delivery and rating styles

```css
.product-rating span {
  color: #555;
  font-size: 0.85rem;
}

.product-delivery {
  margin: 6px 0;
  color: #166534;
  font-size: 0.9rem;
  font-weight: 700;
}
```

---

# 15. Step 5 — Update Product Details Page HTML

Open:

```txt
src/app/pages/product-details-page/product-details-page.html
```

Replace the details page with this richer version.

## `product-details-page.html`

```html
<main class="details-page">
  @if (product()) {
    <section class="details-card">
      <div class="details-image">
        <img [src]="product()!.imageUrl" [alt]="product()!.name" />
      </div>

      <div class="details-info">
        <a routerLink="/products" class="back-link">
          ← Back to Products
        </a>

        <p class="details-badge">
          {{ product()!.badge }}
        </p>

        <p class="category">
          {{ product()!.category }}
        </p>

        <h1>
          {{ product()!.name }}
        </h1>

        <p class="rating">
          {{ product()!.rating }}
          <span>({{ product()!.ratingCount }} reviews)</span>
        </p>

        <p class="price">
          {{ product()!.price | currency }}
        </p>

        <p class="description">
          {{ product()!.description }}
        </p>

        <div class="delivery-box">
          <strong>Delivery:</strong>
          <span>{{ product()!.deliveryText }}</span>
        </div>

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

# 16. What Improved on Product Details Page?

Before:

```txt
name
rating
price
stock
add to cart
```

After:

```txt
image
badge
category
name
rating + review count
price
description
delivery text
stock
cart status
actions
```

This page now feels more like a real product page.

---

# 17. Step 6 — Update Product Details Page CSS

Open:

```txt
src/app/pages/product-details-page/product-details-page.css
```

Replace it with this.

## `product-details-page.css`

```css
.details-page {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 16px 40px;
}

.details-card {
  background: white;
  border: 1px solid #dcdfe3;
  border-radius: 6px;
  padding: 24px;
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 32px;
}

.details-image {
  min-height: 420px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.details-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.back-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 700;
  margin-bottom: 20px;
}

.back-link:hover {
  text-decoration: underline;
}

.details-badge {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0 0 12px;
}

.category {
  color: #555;
  font-size: 0.95rem;
  margin: 0 0 8px;
}

.details-info h1 {
  margin: 0 0 12px;
  font-size: 2rem;
}

.rating {
  color: #f59e0b;
  font-size: 1.1rem;
  margin: 0 0 12px;
}

.rating span {
  color: #555;
  font-size: 0.95rem;
}

.price {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 12px;
}

.description {
  color: #374151;
  line-height: 1.6;
  margin: 0 0 18px;
  max-width: 620px;
}

.delivery-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.stock {
  color: #166534;
  font-weight: 700;
  margin: 0 0 16px;
}

.in-cart-message {
  background: #ecfdf3;
  color: #166534;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 18px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cart-btn,
.cart-link {
  border-radius: 999px;
  padding: 11px 18px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.cart-btn {
  border: 1px solid #d1a000;
  background: #ffd814;
  color: #111;
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

.cart-link {
  background: #eaecf0;
  color: #111827;
  border: 1px solid #cbd5e1;
}

.not-found-card {
  background: white;
  border: 1px solid #dcdfe3;
  border-radius: 6px;
  padding: 32px;
  text-align: center;
}

.not-found-card h1 {
  margin-top: 0;
}

.not-found-card p {
  color: #555;
}

@media (max-width: 900px) {
  .details-card {
    grid-template-columns: 1fr;
  }

  .details-image {
    min-height: 280px;
  }
}
```

---

# 18. Optional Cart and Checkout Polish

This step is optional but useful.

In the checkout page and cart summary, show product category beside the item.

Find:

```html
<p>{{ item.price | currency }} x {{ item.quantity }}</p>
```

Change to:

```html
<p>{{ item.category }} · {{ item.price | currency }} x {{ item.quantity }}</p>
```

This gives the cart and checkout page a little more product context.

---

# 19. Important Question: Should CartItem Store imageUrl?

Right now, `CartItem` does not include `imageUrl`.

It has:

```ts
id
name
category
price
quantity
stock
```

That is okay.

If you want cart items to show images later, you can add:

```ts
imageUrl: string;
```

to `CartItem`.

Then in `addToCart()`, include:

```ts
imageUrl: product.imageUrl
```

For Stage 8, this is optional.

Recommended teaching choice:

```txt
Keep CartItem simple for now.
```

Why?

Because Stage 8 is mainly about product display, not cart redesign.

---

# 20. Product vs CartItem

Students may ask:

> Why does Product have imageUrl and description, but CartItem does not?

Explain:

`Product` represents the full catalog item.

`CartItem` represents the item in the cart.

The cart only needs enough information to calculate and display the order.

So it is okay for these types to be different.

---

# 21. Stage 8 Testing Checklist

After updating the files, test these:

## Product list

Expected:

- product cards show images
- badges appear
- ratings show counts
- delivery text appears
- buttons still work

## Product details

Go to:

```txt
/products/1
/products/2
/products/3
```

Expected:

- details page shows the correct image
- description appears
- delivery box appears
- rating count appears
- Add to Cart still works

## Cart

Expected:

- cart still works
- quantities still work
- cart persistence from Stage 7 still works

## Refresh test

Expected:

- cart survives refresh
- images reload
- product details route still works

---

# 22. Common Errors and Fixes

## Error: Property `imageUrl` does not exist on type Product

Cause:

You updated the template but did not update the `Product` type.

Fix:

Update `Product` in:

```txt
src/app/models/store.models.ts
```

Add:

```ts
imageUrl: string;
```

## Error: Product images do not show

Possible causes:

- internet connection is off
- image URL is wrong
- browser blocked the image
- typo in `[src]="product.imageUrl"`

Check the browser console.

## Error: Product card layout looks broken

Make sure `.product-card` has:

```css
overflow: hidden;
```

and `.product-image img` has:

```css
object-fit: cover;
```

## Error: Product details page says product not found

This is not an image problem.

Check that `getProductById()` still exists in `StoreService`.

```ts
getProductById(productId: number) {
  return this.products().find(product => product.id === productId);
}
```

## Error: Add to Cart fails after adding new product fields

Make sure `addToCart()` still creates a valid `CartItem`.

Current CartItem does not need all product fields.

This is okay:

```ts
{
  id: product.id,
  name: product.name,
  category: product.category,
  price: product.price,
  quantity: 1,
  stock: product.stock
}
```

A cart item can store only what the cart needs.

---

# 23. What Students Should Be Able to Explain

At the end of Stage 8, students should explain:

- why we added more fields to `Product`
- how `[src]` binding displays images
- why `[alt]` matters
- what `object-fit: cover` does
- why product details need more data than product cards
- why richer data improves user experience
- why `Product` and `CartItem` can have different shapes
- why Stage 8 does not change the cart architecture

---

# 24. Teacher Explanation Script

Use this in class:

> Our app already works, but it still looks like a demo because products do not feel real.  
> In this stage, we improve the product data and display.  
> We add images, descriptions, delivery text, badges, and review counts.  
> Notice that we are not changing the main app architecture.  
> We are improving the catalog experience using better data and better templates.

---

# 25. Brutal Warning for Students

Do not hardcode product-specific information inside HTML.

Bad:

```html
<p>Best Seller</p>
<p>Free delivery tomorrow</p>
```

inside every card.

Better:

```html
<p>{{ product.badge }}</p>
<p>{{ product.deliveryText }}</p>
```

Why?

Because product information belongs in the product data.

Templates should display data, not become a messy database.

---

# 26. Stage 8 Data Flow

```txt
StoreService products array
        ↓
ProductList reads product data
        ↓
Product cards display image, badge, rating, delivery
        ↓
User clicks View Details
        ↓
ProductDetailsPage reads product by ID
        ↓
Details page displays richer product information
```

---

# 27. Stage 8 Does Not Change These

Stage 8 does not change:

- routing structure
- cart persistence
- service architecture
- checkout logic
- signal architecture

That is important.

This stage is focused.

---

# 28. Optional Student Challenge

Ask students to add one new field:

```ts
brand: string;
```

Then display it on:

- product card
- product details page

This reinforces the relationship between:

```txt
model → data → template
```

---

# 29. Optional Student Challenge 2

Ask students to add:

```ts
originalPrice?: number;
```

Then show a sale price if `originalPrice` exists.

Example:

```html
@if (product.originalPrice) {
  <p class="old-price">{{ product.originalPrice | currency }}</p>
}
```

This introduces optional fields.

---

# 30. What Comes Next?

After Stage 8, the next strong stage is:

```txt
Stage 9 — Checkout Form and Validation
```

That will teach:

- Angular forms
- customer name
- email
- address
- validation messages
- disabling submit button
- order confirmation

Stage 8 improves the product experience.

Stage 9 improves the checkout experience.

---

# 31. Final Summary

Stage 8 makes the storefront feel more real.

Before Stage 8:

```txt
Product cards were functional but plain.
```

After Stage 8:

```txt
Product cards and details pages show richer product information.
```

Main improvements:

- product images
- badges
- rating count
- descriptions
- delivery text
- better product details layout

The key lesson is:

> Better data creates better UI.
