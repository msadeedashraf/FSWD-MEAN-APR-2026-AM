# Stage 6 — Product Details Page with Route Parameters

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By the end of Stage 5 / Level 5, the storefront has become a routed Angular app.

The project already has:

- reusable components
- a shared `StoreService`
- a products page
- a cart page
- a checkout page
- navbar routing
- cart state shared across pages
- search and category filtering
- product list
- cart summary
- footer

The app is no longer one long page.

It now behaves more like a real website.

---

# 1. What Are We Building in Stage 6?

In Stage 6, we will add a **Product Details Page**.

Instead of only seeing products in a grid, the user will be able to click a product and open a page like:

```txt
/products/1
/products/2
/products/3
```

Each URL will show a different product.

This teaches one of the most important Angular routing ideas:

> One route can display different data depending on the route parameter.

---

# 2. Stage 6 Learning Goals

By the end of this stage, students should understand:

- what a route parameter is
- why product detail pages use IDs
- how to create a dynamic route
- how to read a route parameter using `ActivatedRoute`
- how to find one product from a list
- how to handle invalid product IDs
- how to link from a product card to a details page
- how routed pages still share cart state through `StoreService`

---

# 3. What Is a Route Parameter?

A route parameter is a changing value inside a URL.

Example:

```txt
/products/1
```

Here:

```txt
1
```

is the product ID.

Another example:

```txt
/products/4
```

Here:

```txt
4
```

is the product ID.

So instead of creating separate pages like this:

```txt
/headphones
/keyboard
/mouse
/monitor
```

we create one reusable route:

```txt
/products/:id
```

The `:id` part means:

> Angular, this part of the URL will change.

---

# 4. Why Product Details Pages Matter

Most real shopping websites have this flow:

```txt
Product list
    ↓
Product details
    ↓
Add to cart
    ↓
Cart
    ↓
Checkout
```

Before Stage 6, our app has:

```txt
Product list
    ↓
Cart
    ↓
Checkout
```

Stage 6 adds the missing middle step:

```txt
Product details
```

That makes the app feel much more realistic.

---

# 5. Final Feature Preview

After Stage 6:

- product cards will have a **View Details** button
- clicking it will open `/products/:id`
- the product details page will show:
  - product name
  - category
  - rating
  - price
  - stock
  - larger image placeholder
  - add to cart button
  - current quantity in cart
  - max stock message
  - back to products link

---

# 6. Updated Folder Structure

We will add one new page component:

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
│   ├── product-details-page/
│   ├── cart-page/
│   └── checkout-page/
├── services/
│   └── store.service.ts
├── models/
│   └── store.models.ts
├── app.routes.ts
├── app.ts
├── app.html
└── app.css
```

New folder:

```txt
pages/product-details-page/
```

---

# 7. Generate the Product Details Page

Run this command:

```bash
ng generate component pages/product-details-page
```

Angular will create:

```txt
product-details-page.ts
product-details-page.html
product-details-page.css
```

---

# 8. Update the Routes

Open:

```txt
src/app/app.routes.ts
```

Before Stage 6, it may look like this:

```ts
import { Routes } from '@angular/router';
import { ProductsPage } from './pages/products-page/products-page';
import { CartPage } from './pages/cart-page/cart-page';
import { CheckoutPage } from './pages/checkout-page/checkout-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    component: ProductsPage
  },
  {
    path: 'cart',
    component: CartPage
  },
  {
    path: 'checkout',
    component: CheckoutPage
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];
```

Now update it.

## `app.routes.ts`

```ts
import { Routes } from '@angular/router';

import { ProductsPage } from './pages/products-page/products-page';
import { ProductDetailsPage } from './pages/product-details-page/product-details-page';
import { CartPage } from './pages/cart-page/cart-page';
import { CheckoutPage } from './pages/checkout-page/checkout-page';

export const routes: Routes = [
  /*
    Default route.
    If the user visits the root URL, send them to /products.
  */
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },

  /*
    Main products listing page.
    Shows all products in a grid.
  */
  {
    path: 'products',
    component: ProductsPage
  },

  /*
    Dynamic product details route.

    :id means the value will change.
    Examples:
    /products/1
    /products/2
    /products/5
  */
  {
    path: 'products/:id',
    component: ProductDetailsPage
  },

  /*
    Cart page.
  */
  {
    path: 'cart',
    component: CartPage
  },

  /*
    Checkout page.
  */
  {
    path: 'checkout',
    component: CheckoutPage
  },

  /*
    Wildcard route.
    If the user enters a bad URL, send them back to products.
  */
  {
    path: '**',
    redirectTo: 'products'
  }
];
```

---

# 9. Why Route Order Matters

This part is important.

These routes:

```ts
{
  path: 'products',
  component: ProductsPage
},
{
  path: 'products/:id',
  component: ProductDetailsPage
}
```

allow:

```txt
/products
```

to show the product list, and:

```txt
/products/1
```

to show one product.

Angular checks route patterns and matches the URL.

The `:id` route means:

```txt
/products/something
```

where `something` becomes the value of `id`.

---

# 10. Add a Helper Method to the Store Service

The details page needs to find one product by ID.

Open:

```txt
src/app/services/store.service.ts
```

Add this method inside the `StoreService` class.

## Add to `store.service.ts`

```ts
/*
  Finds one product by its id.

  The route gives us the id as a number.
  We search the products array and return the matching product.

  If no product is found, this returns undefined.
*/
getProductById(productId: number) {
  return this.products().find(product => product.id === productId);
}
```

Your service already has:

```ts
products = signal<Product[]>([ ... ]);
```

So this method uses:

```ts
this.products()
```

to read the current product list.

---

# 11. Why We Put `getProductById()` in the Service

The details page needs product data.

The product list also needs product data.

Later, checkout may need product data too.

So the product data belongs in the service.

Do not duplicate product arrays inside the details page.

Bad approach:

```ts
products = [
  { id: 1, name: 'Wireless Headphones' }
];
```

Good approach:

```ts
product = this.store.getProductById(productId);
```

One source of truth is cleaner.

---

# 12. Product Details Page TypeScript

Open:

```txt
src/app/pages/product-details-page/product-details-page.ts
```

Replace it with this.

## `product-details-page.ts`

```ts
import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-product-details-page',

  /*
    CurrencyPipe is needed for:
    {{ product.price | currency }}

    RouterLink is needed for:
    routerLink="/products"
    routerLink="/cart"
  */
  imports: [CurrencyPipe, RouterLink],

  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.css'
})
export class ProductDetailsPage {
  /*
    Inject the shared store service.
    This gives the page access to products, cart, and cart methods.
  */
  store = inject(StoreService);

  /*
    ActivatedRoute lets this component read information from the current route.
    In this case, we need to read the :id from /products/:id.
  */
  route = inject(ActivatedRoute);

  /*
    Read the product id from the route.

    snapshot means:
    "Read the route value right now."

    paramMap.get('id') returns a string or null.
    Number(...) converts it to a number.
  */
  productId = Number(this.route.snapshot.paramMap.get('id'));

  /*
    product is a computed value.

    It depends on the product list in the store.

    If product data changes later, this computed value can update too.
  */
  product = computed(() => this.store.getProductById(this.productId));

  /*
    Quantity of this product already in the cart.
  */
  quantityInCart = computed(() =>
    this.store.cartQuantityForProduct(this.productId)
  );

  /*
    Checks if this product has reached its stock limit in the cart.
  */
  isMaxed = computed(() => {
    const product = this.product();

    if (!product) {
      return false;
    }

    return this.store.isProductMaxed(product);
  });
}
```

---

# 13. Explain `ActivatedRoute`

This line is new:

```ts
route = inject(ActivatedRoute);
```

`ActivatedRoute` gives the component information about the current route.

For this URL:

```txt
/products/4
```

Angular can read:

```txt
id = 4
```

Using:

```ts
this.route.snapshot.paramMap.get('id')
```

But it returns a string:

```txt
"4"
```

So we convert it to a number:

```ts
Number(this.route.snapshot.paramMap.get('id'))
```

---

# 14. Explain `computed()` on the Details Page

We use:

```ts
product = computed(() => this.store.getProductById(this.productId));
```

This means:

> Find the product that matches the route ID.

If `productId` is `4`, it finds:

```ts
{ id: 4, name: '24" Monitor', ... }
```

This keeps the page connected to the store.

---

# 15. Product Details Page HTML

Open:

```txt
src/app/pages/product-details-page/product-details-page.html
```

Replace it with this.

## `product-details-page.html`

```html
<main class="details-page">
  <!--
    product() returns either:
    - a product object
    - undefined if no matching product exists
  -->
  @if (product()) {
    <section class="details-card">
      <div class="details-image">
        Product Image
      </div>

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
          {{ product()!.rating }}
        </p>

        <p class="price">
          {{ product()!.price | currency }}
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
    <!--
      This appears if the user enters a product id that does not exist.
      Example: /products/999
    -->
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

# 16. Why We Use `product()!`

In the template, this appears:

```html
{{ product()!.name }}
```

The `!` tells TypeScript:

> We already checked that product exists inside the `@if`.

Because this block only runs when:

```html
@if (product())
```

Angular knows there is a product, but TypeScript may still be cautious.

The `!` avoids type errors.

For beginners, explain it simply:

> The exclamation mark says, “Trust me, this value is not empty here.”

Do not overcomplicate it.

---

# 17. Product Details Page CSS

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
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-weight: 700;
  font-size: 1.2rem;
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

.price {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 12px;
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

# 18. Add View Details Button to Product Cards

Now users need a way to open the details page.

Open:

```txt
src/app/components/product-list/product-list.ts
```

Add `RouterLink`.

## Update `product-list.ts`

```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem, Product } from '../../app';

@Component({
  selector: 'app-product-list',

  /*
    RouterLink is needed because the product card will link to:
    /products/:id
  */
  imports: [CurrencyPipe, RouterLink],

  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
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
```

---

# 19. Update Product Card HTML

Open:

```txt
src/app/components/product-list/product-list.html
```

Find the product card actions area.

Replace the button area with this.

## Update inside each product card

```html
<div class="product-actions">
  <a
    class="details-link"
    [routerLink]="['/products', product.id]"
  >
    View Details
  </a>

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
</div>
```

The full card becomes:

```html
<article class="product-card">
  <div class="product-image">Image</div>

  <h3>{{ product.name }}</h3>

  <p class="product-category">Category: {{ product.category }}</p>
  <p class="product-rating">{{ product.rating }}</p>
  <p class="product-price">{{ product.price | currency }}</p>
  <p class="product-stock">Stock: {{ product.stock }}</p>

  @if (cartQuantityForProduct(product.id) > 0) {
    <p class="in-cart-message">
      In cart: {{ cartQuantityForProduct(product.id) }} / {{ product.stock }}
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
      (click)="addProduct.emit(product)"
      [disabled]="isProductMaxed(product)"
    >
      @if (isProductMaxed(product)) {
        Max Stock Reached
      } @else {
        Add to Cart
      }
    </button>
  </div>
</article>
```

---

# 20. Why We Use Array Syntax for RouterLink

This:

```html
[routerLink]="['/products', product.id]"
```

creates a URL like:

```txt
/products/1
```

If product ID is 4, it creates:

```txt
/products/4
```

This is better than manually building strings.

Avoid this for now:

```html
routerLink="/products/{{ product.id }}"
```

Use the array style because it is cleaner and safer.

---

# 21. Update Product List CSS

Open:

```txt
src/app/components/product-list/product-list.css
```

Add these styles.

## Add to `product-list.css`

```css
.product-actions {
  margin-top: auto;
  display: grid;
  gap: 8px;
}

.details-link {
  text-align: center;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #111827;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
}

.details-link:hover {
  background: #f3f4f6;
}

.product-actions .cart-btn {
  margin-top: 0;
}
```

Then check your existing `.cart-btn`.

If it has:

```css
.cart-btn {
  margin-top: auto;
}
```

change it to:

```css
.cart-btn {
  border: 1px solid #d1a000;
  background: #ffd814;
  color: #111;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}
```

Why?

Because now `.product-actions` controls spacing. The button should not push itself separately.

---

# 22. Test the Details Page

Run:

```bash
ng serve
```

Then test:

```txt
/products
/products/1
/products/2
/products/999
```

Expected behavior:

## `/products`

Shows the product grid.

## `/products/1`

Shows Wireless Headphones details.

## `/products/2`

Shows Mechanical Keyboard details.

## `/products/999`

Shows Product Not Found.

---

# 23. Important Test: Cart Still Works Across Pages

This is a key Stage 6 lesson.

Test this:

1. Go to `/products`
2. Click View Details on a product
3. Click Add to Cart
4. Go to Cart
5. Confirm item appears
6. Go back to Products
7. Confirm cart count still shows

Why does this work?

Because cart state lives in:

```ts
StoreService
```

Not inside the product details page.

That is the architecture win.

---

# 24. What Students Should Understand Now

Students should now understand:

```txt
/products
```

means:

> Show the product listing page.

```txt
/products/1
```

means:

> Show details for product with ID 1.

```txt
/products/:id
```

means:

> This route accepts a changing product ID.

---

# 25. Common Errors and Fixes

## Error: `app-product-details-page` or route component not found

Check that you imported it in `app.routes.ts`:

```ts
import { ProductDetailsPage } from './pages/product-details-page/product-details-page';
```

---

## Error: Can't bind to `routerLink`

Any component using `routerLink` must import `RouterLink`.

Example:

```ts
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink]
})
```

---

## Error: No pipe found with name `currency`

Any component using `| currency` must import `CurrencyPipe`.

```ts
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe]
})
```

---

## Error: Product page shows Product Not Found for valid products

Check that the route ID is converted to a number:

```ts
productId = Number(this.route.snapshot.paramMap.get('id'));
```

If you forget `Number(...)`, you may compare:

```txt
"1" === 1
```

That is false.

One is a string. One is a number.

---

## Error: Add to Cart button does nothing on details page

Check that the button calls:

```html
(click)="store.addToCart(product()!)"
```

Also check that `product()` exists inside the `@if (product())` block.

---

## Error: Product details route never opens

Make sure you added this route:

```ts
{
  path: 'products/:id',
  component: ProductDetailsPage
}
```

Also make sure the product card link is:

```html
[routerLink]="['/products', product.id]"
```

---

# 26. Teaching Checkpoints

Use these checkpoints during class.

## Checkpoint 1

After generating the details page, the app should still compile.

---

## Checkpoint 2

After adding the route, `/products/1` should open the details page.

It may still be empty, but the route should work.

---

## Checkpoint 3

After adding `ActivatedRoute`, the page should read the ID from the URL.

---

## Checkpoint 4

After adding `getProductById()`, the correct product should appear.

---

## Checkpoint 5

After adding View Details button, students should navigate from product cards to details page.

---

## Checkpoint 6

After adding Add to Cart on details page, cart count should update.

---

## Checkpoint 7

After testing `/products/999`, the Product Not Found message should appear.

---

# 27. Simple Student Explanation

Use this explanation:

> The product list page shows many products.  
> The product details page shows one product.  
> The URL tells Angular which product to show.  
> The ID in the URL is called a route parameter.

---

# 28. Data Flow in Stage 6

## Opening a product detail page

```txt
User clicks View Details
        ↓
Router opens /products/3
        ↓
ProductDetailsPage reads id = 3
        ↓
StoreService finds product with id 3
        ↓
Page displays that product
```

---

## Adding to cart from details page

```txt
User clicks Add to Cart
        ↓
ProductDetailsPage calls store.addToCart(product)
        ↓
StoreService updates cart signal
        ↓
Navbar cart count updates
        ↓
Cart page shows updated item
```

---

# 29. Why This Stage Is Important

This stage is not just about one product page.

It teaches a pattern used everywhere:

```txt
/blog/10
/users/5
/orders/22
/courses/3
/products/7
```

The same route parameter idea is used in:

- blogs
- shopping sites
- admin dashboards
- student portals
- course platforms
- booking systems
- CRM systems

This is a major Angular concept.

---

# 30. What Comes Next

After Stage 6, the next useful stage is:

```txt
Stage 7 — Cart Persistence with localStorage
```

That teaches:

- saving data in the browser
- loading saved cart on refresh
- keeping cart after page reload
- using effects or service methods carefully

After that:

```txt
Stage 8 — Backend/API Version
```

That teaches:

- HTTP requests
- product API
- database-backed products
- real checkout simulation

---

# 31. Final Mental Model

Think of the route like an address.

```txt
/products
```

means:

> Go to the product shelf.

```txt
/products/2
```

means:

> Go to the details page for product number 2.

Angular reads the address, extracts the ID, and shows the right product.

---

# 32. Stage 6 Summary

In Stage 6, we added:

- a Product Details page
- a dynamic route using `:id`
- route parameter reading with `ActivatedRoute`
- a store method to find one product
- View Details buttons
- Add to Cart from the details page
- Product Not Found handling

The app now feels much closer to a real e-commerce website.

