# Stage 4 — Improving the Angular Signals Storefront

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By the end of Stage 3 / Level 3, the storefront already works.

The app has:

- Angular template
- product list
- search text signal
- cart signal
- computed filtered products
- computed cart total
- computed total items
- add to cart
- increase quantity
- decrease quantity
- remove item
- clear cart
- place order message

That means Stage 3 answered this question:

> Can we make the app work using Angular signals?

The answer was yes.

---

# 1. What Is Stage 4 For?

Stage 4 is for improving the working app before we split it into components.

This stage is not mainly about adding a huge new feature.

It is about making the app feel more realistic and more complete.

In Stage 4, we improve:

- category filtering
- product card feedback
- stock limit behavior
- cart usability
- order summary layout
- user experience

---

# 2. Why Do We Need Stage 4?

Stage 3 works, but it is still a bit rough.

For example:

- the category dropdown may look real but not actually filter yet
- the product card may not show how many items are already in the cart
- Add to Cart may still be clickable even when stock is maxed unless we handle it carefully
- the cart summary can feel disconnected from the product area
- users need clearer feedback

Stage 4 fixes those problems.

---

# 3. Stage 4 Mental Model

Stage 3:

```txt
Make it work.
```

Stage 4:

```txt
Make it feel better and behave smarter.
```

Stage 5:

```txt
Make it clean by splitting into components.
```

So Stage 4 is the polish layer before component refactoring.

---

# 4. What Students Will Learn in Stage 4

By the end of Stage 4, students should understand:

- how one `computed()` can depend on multiple signals
- how search and category filters work together
- how to disable buttons based on state
- how to show conditional messages
- how to prevent users from exceeding stock
- how to improve UI feedback
- why polish matters before refactoring

---

# 5. What We Are Adding in Stage 4

We will add:

```txt
selectedCategory signal
categories array
category dropdown filtering
cartQuantityForProduct() helper
isProductMaxed() helper
disabled Add to Cart button
In Cart product message
sticky summary panel
better product hover styles
better cart scrolling
```

---

# 6. Before Stage 4

In Stage 3, you may have had:

```ts
searchText = signal('');
```

and:

```ts
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
```

This means the app can search by text.

But category filtering is not properly separated yet.

---

# 7. After Stage 4

Now we want filtering to depend on both:

```txt
searchText
selectedCategory
```

So if the user types:

```txt
mouse
```

and selects:

```txt
Accessories
```

Angular should show products that match both conditions.

---

# 8. Key Concept: One Computed Value Can Depend on Multiple Signals

This is one of the biggest Stage 4 lessons.

A computed signal can depend on more than one signal.

Example:

```ts
filteredProducts = computed(() => {
  const term = this.searchText().toLowerCase().trim();
  const category = this.selectedCategory();

  ...
});
```

This means:

> If searchText changes, recalculate.
> If selectedCategory changes, recalculate.

Angular automatically tracks both.

---

# 9. Step 1 — Update `app.ts` Imports

Open:

```txt
src/app/app.ts
```

Make sure the imports include:

```ts
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
```

## Why?

- `Component` creates the Angular component
- `signal` creates reactive state
- `computed` creates values calculated from signals
- `FormsModule` allows `ngModel`
- `CurrencyPipe` allows `| currency`

---

# 10. Step 2 — Add the Categories Array

Inside your `App` class, add:

```ts
categories = ['All', 'Audio', 'Accessories', 'Displays', 'Cameras'];
```

## Why?

This gives the dropdown its options from TypeScript.

Instead of hardcoding category options only in HTML, the category list now lives in the component data.

That makes it easier to manage later.

---

# 11. Step 3 — Add the Selected Category Signal

Add:

```ts
selectedCategory = signal('All');
```

## Why?

The selected category can change.

Any value that can change and should update the UI is a good candidate for a signal.

At first, the selected category is:

```txt
All
```

That means show all products.

---

# 12. Step 4 — Update the Product Type

Make sure your product type uses real stock numbers, not only stock text.

Use this:

```ts
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;
};
```

## Why?

In earlier static stages, this was okay:

```ts
stockText: 'In Stock'
```

But now we need real stock logic.

We need to know:

```txt
How many units are available?
```

So we need:

```ts
stock: number;
```

---

# 13. Step 5 — Update the CartItem Type

Use:

```ts
type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;
};
```

## Why?

The cart item must remember the product stock.

This allows the cart to prevent the user from increasing quantity past the available stock.

---

# 14. Step 6 — Product Data

Use real stock numbers.

```ts
products = signal<Product[]>([
  { id: 1, name: 'Wireless Headphones', category: 'Audio', price: 99, stock: 5, rating: '★★★★☆' },
  { id: 2, name: 'Mechanical Keyboard', category: 'Accessories', price: 75, stock: 4, rating: '★★★★★' },
  { id: 3, name: 'Gaming Mouse', category: 'Accessories', price: 40, stock: 6, rating: '★★★★☆' },
  { id: 4, name: '24" Monitor', category: 'Displays', price: 220, stock: 3, rating: '★★★★☆' },
  { id: 5, name: 'HD Webcam', category: 'Cameras', price: 60, stock: 7, rating: '★★★★☆' },
  { id: 6, name: 'Bluetooth Speaker', category: 'Audio', price: 120, stock: 2, rating: '★★★★☆' }
]);
```

## Why?

Now the UI can display:

```txt
Stock: 5
```

And the app can enforce stock limits.

---

# 15. Step 7 — Update `filteredProducts`

Replace the Stage 3 version with this:

```ts
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
```

---

# 16. How This Filtering Works

## Search condition

```ts
const matchesSearch =
  product.name.toLowerCase().includes(term) ||
  product.category.toLowerCase().includes(term);
```

This checks whether the product name or category includes the search term.

Example:

```txt
searchText = "mouse"
```

Matches:

```txt
Gaming Mouse
```

---

## Category condition

```ts
const matchesCategory =
  category === 'All' || product.category === category;
```

This means:

If selected category is `All`, show everything.

Otherwise, only show products from the selected category.

---

## Final condition

```ts
return matchesSearch && matchesCategory;
```

This means both conditions must be true.

The product must match:

```txt
search text
AND
selected category
```

---

# 17. Step 8 — Add Product Cart Helper

Add this method:

```ts
cartQuantityForProduct(productId: number) {
  const item = this.cart().find(cartItem => cartItem.id === productId);
  return item ? item.quantity : 0;
}
```

## Why?

The product card needs to know:

```txt
How many of this product are already in the cart?
```

Example:

```txt
Wireless Headphones
In cart: 2 / 5
```

This helper gives us that number.

---

# 18. Step 9 — Add Max Stock Helper

Add:

```ts
isProductMaxed(product: Product) {
  return this.cartQuantityForProduct(product.id) >= product.stock;
}
```

## Why?

This tells us whether the product has reached its stock limit.

If stock is 5 and cart quantity is 5:

```txt
Max stock reached
```

The Add to Cart button should be disabled.

---

# 19. Step 10 — Full Stage 4 `app.ts`

Use this full version if you want a clean complete file.

```ts
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;
};

type NavLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: string[];
};

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
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  storeName = 'Mini Tech Store';
  location = 'Deliver to Hamilton';

  heroTitle = 'Tech Essentials for Everyday Use';
  heroText = 'Browse featured products, compare prices, and build your order.';

  navLinks: NavLink[] = [
    { label: 'All', href: '#products' },
    { label: "Today's Deals", href: '#products' },
    { label: 'Audio', href: '#products' },
    { label: 'Accessories', href: '#products' },
    { label: 'Monitors', href: '#products' },
    { label: 'Cameras', href: '#products' },
    { label: 'Best Sellers', href: '#products' }
  ];

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

  categories = ['All', 'Audio', 'Accessories', 'Displays', 'Cameras'];

  selectedCategory = signal('All');
  searchText = signal('');
  cart = signal<CartItem[]>([]);
  orderPlaced = signal(false);
  orderMessage = signal('');

  products = signal<Product[]>([
    { id: 1, name: 'Wireless Headphones', category: 'Audio', price: 99, stock: 5, rating: '★★★★☆' },
    { id: 2, name: 'Mechanical Keyboard', category: 'Accessories', price: 75, stock: 4, rating: '★★★★★' },
    { id: 3, name: 'Gaming Mouse', category: 'Accessories', price: 40, stock: 6, rating: '★★★★☆' },
    { id: 4, name: '24" Monitor', category: 'Displays', price: 220, stock: 3, rating: '★★★★☆' },
    { id: 5, name: 'HD Webcam', category: 'Cameras', price: 60, stock: 7, rating: '★★★★☆' },
    { id: 6, name: 'Bluetooth Speaker', category: 'Audio', price: 120, stock: 2, rating: '★★★★☆' }
  ]);

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

  totalItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  cartQuantityForProduct(productId: number) {
    const item = this.cart().find(cartItem => cartItem.id === productId);
    return item ? item.quantity : 0;
  }

  isProductMaxed(product: Product) {
    return this.cartQuantityForProduct(product.id) >= product.stock;
  }

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

  removeFromCart(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');
    this.cart.update(items => items.filter(item => item.id !== itemId));
  }

  clearCart() {
    this.cart.set([]);
    this.orderPlaced.set(false);
    this.orderMessage.set('');
  }

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

# 20. Step 11 — Update the Search Area in `app.html`

Find the search area in your navbar.

Replace it with this:

```html
<div class="search-area">
  <select
    class="search-category"
    [ngModel]="selectedCategory()"
    (ngModelChange)="selectedCategory.set($event)"
  >
    @for (category of categories; track category) {
      <option [value]="category">{{ category }}</option>
    }
  </select>

  <input
    type="text"
    [ngModel]="searchText()"
    (ngModelChange)="searchText.set($event)"
    placeholder="Search {{ storeName }}"
  />

  <button class="search-btn">Search</button>
</div>
```

---

# 21. What Changed in the Search Area?

## Before

The dropdown looked real, but it did not control the data.

## After

The dropdown is connected to:

```ts
selectedCategory
```

The input is connected to:

```ts
searchText
```

Both values control:

```ts
filteredProducts
```

So the UI now reacts to both.

---

# 22. Step 12 — Update the Product Card

Inside the product card, replace the basic Add to Cart button with this improved version:

```html
@if (cartQuantityForProduct(product.id) > 0) {
  <p class="in-cart-message">
    In cart: {{ cartQuantityForProduct(product.id) }} / {{ product.stock }}
  </p>
}

<button
  class="cart-btn"
  (click)="addToCart(product)"
  [disabled]="isProductMaxed(product)"
>
  @if (isProductMaxed(product)) {
    Max Stock Reached
  } @else {
    Add to Cart
  }
</button>
```

---

# 23. Full Product Card Example

Your product card should now look like this:

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

  <button
    class="cart-btn"
    (click)="addToCart(product)"
    [disabled]="isProductMaxed(product)"
  >
    @if (isProductMaxed(product)) {
      Max Stock Reached
    } @else {
      Add to Cart
    }
  </button>
</article>
```

---

# 24. Why This Product Card Is Better

Now the product card is not just a display card.

It gives real feedback:

```txt
In cart: 2 / 5
```

It also prevents invalid actions:

```txt
Max Stock Reached
```

This is better user experience.

---

# 25. Step 13 — Keep the Cart Summary Logic

Your cart summary from Stage 3 can mostly stay the same.

Make sure the `+` button is disabled when stock is maxed:

```html
<button
  class="qty-btn"
  (click)="increaseQuantity(item.id)"
  [disabled]="item.quantity === item.stock"
>
  +
</button>
```

## Why?

If the cart already has the maximum available stock, the user should not be able to increase quantity.

This protects the cart from invalid values.

---

# 26. Step 14 — Add Stage 4 CSS Improvements

Add these to your `app.css`.

```css
.summary-section {
  position: sticky;
  top: 92px;
  align-self: start;
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

.cart-btn:disabled {
  background: #e5e7eb;
  border-color: #cbd5e1;
  color: #6b7280;
  cursor: not-allowed;
}

.search-category {
  min-width: 120px;
  cursor: pointer;
}

.product-card {
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.1);
}

.cart-preview {
  max-height: 520px;
  overflow-y: auto;
}
```

---

# 27. Why Add Sticky Summary?

This CSS:

```css
.summary-section {
  position: sticky;
  top: 92px;
  align-self: start;
}
```

keeps the order summary visible while the user scrolls products.

This feels more like a real shopping experience.

---

# 28. Why Add Hover Effects?

This CSS:

```css
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.1);
}
```

makes product cards feel interactive.

It tells the user:

> This is something you can interact with.

Small UI feedback matters.

---

# 29. Update Responsive CSS

If you use sticky summary on desktop, disable it on smaller screens.

Add this inside your media query:

```css
@media (max-width: 1100px) {
  .summary-section {
    position: static;
  }
}
```

## Why?

Sticky sidebars work well on desktop.

On mobile, they can feel awkward and take too much space.

---

# 30. Stage 4 Full Template Flow

Your page now works like this:

```txt
User selects a category
        ↓
selectedCategory signal changes
        ↓
filteredProducts recomputes
        ↓
product grid updates
```

```txt
User types in search box
        ↓
searchText signal changes
        ↓
filteredProducts recomputes
        ↓
product grid updates
```

```txt
User adds product to cart
        ↓
cart signal updates
        ↓
totalItems recomputes
        ↓
cartTotal recomputes
        ↓
product card shows "In cart"
        ↓
cart summary updates
```

---

# 31. Stage 4 Testing Checklist

After finishing Stage 4, test these:

## Search

Type:

```txt
mouse
```

Expected:

```txt
Gaming Mouse appears
```

---

## Category

Select:

```txt
Audio
```

Expected:

```txt
Wireless Headphones
Bluetooth Speaker
```

---

## Search + Category Together

Select:

```txt
Accessories
```

Then search:

```txt
key
```

Expected:

```txt
Mechanical Keyboard
```

---

## Add to Cart

Click Add to Cart.

Expected:

- cart count increases
- cart summary updates
- product card shows In cart message

---

## Max Stock

Add Bluetooth Speaker twice.

Expected:

```txt
Max Stock Reached
```

button becomes disabled.

---

## Decrease Quantity

Click `-`.

Expected:

- quantity decreases
- if quantity becomes 0, item disappears from cart
- product card In cart message updates

---

## Clear Cart

Click Clear Cart.

Expected:

- cart becomes empty
- totals reset
- product cards no longer show In cart message

---

# 32. Common Errors and Fixes

## Error: `ngModel` is not known

Fix:

Make sure `FormsModule` is imported:

```ts
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, CurrencyPipe]
})
```

---

## Error: No pipe found with name `currency`

Fix:

Make sure `CurrencyPipe` is imported:

```ts
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [FormsModule, CurrencyPipe]
})
```

---

## Error: `selectedCategory` does not exist

Fix:

Make sure you added:

```ts
selectedCategory = signal('All');
```

---

## Error: Product stock does not display

Check that products use:

```ts
stock: 5
```

not:

```ts
stockText: 'In Stock'
```

---

## Error: Button does not disable

Check:

```html
[disabled]="isProductMaxed(product)"
```

and make sure the method exists:

```ts
isProductMaxed(product: Product) {
  return this.cartQuantityForProduct(product.id) >= product.stock;
}
```

---

## Error: In cart message does not update

Check that the product card uses:

```html
cartQuantityForProduct(product.id)
```

and that the cart is updated with the correct product `id`.

---

# 33. What Students Should Be Able to Explain

At the end of Stage 4, students should explain:

- why `selectedCategory` is a signal
- how search and category filtering work together
- what `matchesSearch` means
- what `matchesCategory` means
- why `filteredProducts` is computed
- why Add to Cart is disabled at max stock
- why cart totals should be computed instead of manually stored
- why UI feedback matters

---

# 34. Teacher Explanation Script

Use this in class:

> In Stage 3, we made the app work.  
> In Stage 4, we make the app behave more like a real shopping experience.  
> The dropdown now actually filters products.  
> Product cards now know how many of each item are already in the cart.  
> Buttons now protect the user from going beyond stock.  
> This is the step where the app starts feeling smarter.

---

# 35. Important Teaching Warning

Do not jump to components yet if Stage 4 is not working.

If the app is broken before refactoring, splitting it into components will make debugging harder.

The correct order is:

```txt
Make it work
Improve it
Then split it
```

So Stage 4 must be stable before Stage 5.

---

# 36. Stage 4 Summary

Stage 4 improves the Stage 3 app by adding:

- real category filtering
- better computed filtering logic
- product cart status
- stock limit protection
- disabled Add to Cart button
- sticky order summary
- better UI feedback

This stage answers the question:

> Can we make the working app smarter and more user-friendly before refactoring?

Yes.

---

# 37. What Comes Next?

After Stage 4, the next stage is:

```txt
Stage 5 — Split the app into components
```

That means we will move parts of the page into:

```txt
Navbar
Hero
ProductList
CartSummary
Footer
```

But the important point is:

> Stage 5 should not change what the app does.  
> It should only organize the code better.

---

# 38. Final Mental Model

```txt
Stage 1 → Make it visible
Stage 2 → Make it data-driven
Stage 3 → Make it work with signals
Stage 4 → Make it smarter and polished
Stage 5 → Make it clean with components
```

Stage 4 is the bridge between a working prototype and a clean component-based app.

