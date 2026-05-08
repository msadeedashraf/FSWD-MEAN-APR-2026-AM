# Stage 7 — Cart Persistence with localStorage

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By the end of Stage 6, the storefront behaves much more like a real Angular app.

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

That is a strong app.

But there is still one serious problem.

---

# 1. The Problem We Are Solving in Stage 7

Right now, the cart only lives in memory.

That means:

```txt
User adds products to cart
        ↓
Cart updates
        ↓
User refreshes the browser
        ↓
Cart is lost
```

That is bad for a shopping app.

A real shopping app should remember the cart, at least temporarily.

Stage 7 solves this by using:

```txt
localStorage
```

---

# 2. What Is localStorage?

`localStorage` is browser storage.

It lets a website save small pieces of data inside the user's browser.

The data stays there even if the user refreshes the page.

Example:

```ts
localStorage.setItem('cart', 'some data');
```

Later:

```ts
localStorage.getItem('cart');
```

This allows the app to remember things.

---

# 3. Stage 7 Main Goal

By the end of Stage 7, the cart should survive browser refresh.

Example:

```txt
1. Add Wireless Headphones to cart
2. Refresh the browser
3. Cart should still contain Wireless Headphones
```

That is the main feature.

---

# 4. What Students Will Learn

Students will learn:

- what browser localStorage is
- why app memory disappears on refresh
- how to save cart data
- how to load cart data when the app starts
- how to convert objects to strings using `JSON.stringify`
- how to convert strings back to objects using `JSON.parse`
- how to keep localStorage logic inside the service
- how to avoid duplicating persistence logic in every component

---

# 5. Why This Stage Comes After Services

This stage depends on the architecture from Level 4.

Because the cart already lives in:

```txt
StoreService
```

we only need to add persistence in one place.

If cart logic were scattered across many components, localStorage would become messy.

This is why the order matters:

```txt
Stage 5 → Components
Level 4 → StoreService
Level 5 → Routing
Stage 6 → Product details
Stage 7 → Persistence
```

The service makes persistence easier.

---

# 6. What Does Persistence Mean?

Persistence means:

> Data continues to exist even after the page reloads.

Without persistence:

```txt
Refresh page → cart resets
```

With persistence:

```txt
Refresh page → cart comes back
```

In Stage 7, we persist the cart using the browser.

---

# 7. Important Warning

`localStorage` is not a database.

It is useful for small browser-side data.

Good for:

```txt
cart items
theme preference
draft form values
recent searches
```

Not good for:

```txt
secure passwords
credit card numbers
private personal data
large databases
```

For this project, storing cart items is okay.

---

# 8. Big Picture of the New Flow

After Stage 7, the cart flow will look like this:

```txt
User adds product to cart
        ↓
StoreService updates cart signal
        ↓
StoreService saves cart to localStorage
        ↓
User refreshes page
        ↓
StoreService loads cart from localStorage
        ↓
Cart appears again
```

---

# 9. Step 1 — Find the Service File

Open:

```txt
src/app/services/store.service.ts
```

This is where cart state currently lives.

Because cart state lives here, localStorage logic should also live here.

Do not put localStorage code inside:

```txt
ProductList
CartSummary
Navbar
CheckoutPage
```

That would duplicate logic.

---

# 10. Step 2 — Add a Storage Key

Inside the `StoreService` class, add this near the top:

```ts
private readonly cartStorageKey = 'mini-tech-store-cart';
```

## Why?

We need a consistent name for the localStorage entry.

This key is like a label.

The browser will store cart data under:

```txt
mini-tech-store-cart
```

Using a named key avoids magic strings scattered across the code.

Bad:

```ts
localStorage.setItem('cart', ...);
localStorage.getItem('my-cart', ...);
```

Good:

```ts
private readonly cartStorageKey = 'mini-tech-store-cart';
```

Then use:

```ts
this.cartStorageKey
```

everywhere.

---

# 11. Step 3 — Understand JSON.stringify

localStorage can only store strings.

But our cart is an array of objects.

Example cart:

```ts
[
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99,
    quantity: 2,
    stock: 5
  }
]
```

That is not a string.

So before saving it, we convert it to a string:

```ts
JSON.stringify(this.cart())
```

This turns the cart into text that localStorage can store.

---

# 12. Step 4 — Understand JSON.parse

When we load cart data back from localStorage, it comes back as a string.

So we need to turn it back into an array.

```ts
JSON.parse(savedCart)
```

That converts the string back into JavaScript data.

---

# 13. Step 5 — Add `saveCartToStorage()`

Inside `StoreService`, add this method:

```ts
/*
  Saves the current cart into browser localStorage.

  localStorage only stores strings.
  That is why we use JSON.stringify().
*/
private saveCartToStorage() {
  localStorage.setItem(
    this.cartStorageKey,
    JSON.stringify(this.cart())
  );
}
```

## Why private?

This method is only for the service to use internally.

Components do not need to call it.

Components should call actions like:

```ts
addToCart()
removeFromCart()
clearCart()
```

The service should handle saving automatically.

---

# 14. Step 6 — Add `loadCartFromStorage()`

Add this method:

```ts
/*
  Loads cart data from browser localStorage.

  If no saved cart exists, we leave the cart empty.
*/
private loadCartFromStorage() {
  const savedCart = localStorage.getItem(this.cartStorageKey);

  if (!savedCart) {
    return;
  }

  const parsedCart = JSON.parse(savedCart);
  this.cart.set(parsedCart);
}
```

## What this does

```ts
localStorage.getItem(this.cartStorageKey)
```

tries to read the saved cart.

If nothing is found:

```ts
savedCart
```

will be `null`.

So we check:

```ts
if (!savedCart) {
  return;
}
```

If there is saved data, we parse it and put it back into the cart signal:

```ts
this.cart.set(parsedCart);
```

---

# 15. Step 7 — Add a Constructor

A constructor runs when the service is created.

Add this inside the `StoreService` class:

```ts
constructor() {
  this.loadCartFromStorage();
}
```

## Why?

When the app starts, Angular creates the service.

At that moment, we want to load the saved cart.

So the sequence becomes:

```txt
App starts
        ↓
StoreService is created
        ↓
constructor runs
        ↓
loadCartFromStorage runs
        ↓
cart signal is restored
```

---

# 16. Step 8 — Update Cart Methods to Save Automatically

Now every method that changes the cart must also save the cart.

These methods change cart state:

```txt
addToCart()
increaseQuantity()
decreaseQuantity()
removeFromCart()
clearCart()
```

After changing the cart signal, each method should call:

```ts
this.saveCartToStorage();
```

But we must place it correctly.

---

# 17. Important Timing Issue

This pattern works:

```ts
this.cart.update(items => {
  return updatedItems;
});

this.saveCartToStorage();
```

Why?

Because after `cart.update()` finishes, the signal contains the new value.

Then `saveCartToStorage()` saves the updated cart.

---

# 18. Step 9 — Update `addToCart()`

Before Stage 7, it probably looked like this:

```ts
addToCart(product: Product) {
  this.orderPlaced.set(false);
  this.orderMessage.set('');

  this.cart.update(items => {
    ...
  });
}
```

Update it like this:

```ts
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

  /*
    After the cart changes, save it.
  */
  this.saveCartToStorage();
}
```

---

# 19. Step 10 — Update `increaseQuantity()`

```ts
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

  this.saveCartToStorage();
}
```

---

# 20. Step 11 — Update `decreaseQuantity()`

```ts
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

  this.saveCartToStorage();
}
```

---

# 21. Step 12 — Update `removeFromCart()`

```ts
removeFromCart(itemId: number) {
  this.orderPlaced.set(false);
  this.orderMessage.set('');

  this.cart.update(items => items.filter(item => item.id !== itemId));

  this.saveCartToStorage();
}
```

---

# 22. Step 13 — Update `clearCart()`

```ts
clearCart() {
  this.cart.set([]);
  this.orderPlaced.set(false);
  this.orderMessage.set('');

  this.saveCartToStorage();
}
```

This saves an empty cart.

That means localStorage now stores:

```txt
[]
```

That is okay.

---

# 23. Optional Improvement — Remove Cart from Storage When Empty

Instead of saving an empty array, you can remove the key.

Better version:

```ts
clearCart() {
  this.cart.set([]);
  this.orderPlaced.set(false);
  this.orderMessage.set('');

  localStorage.removeItem(this.cartStorageKey);
}
```

This completely removes the stored cart.

Both approaches work.

For beginners, saving `[]` is simpler.

For cleaner storage, removing the key is better.

---

# 24. Step 14 — Safer Loading with try/catch

Sometimes localStorage data can be broken.

For example, a user or developer could manually edit localStorage.

If the stored data is invalid JSON, this can crash:

```ts
JSON.parse(savedCart)
```

A safer version is:

```ts
private loadCartFromStorage() {
  const savedCart = localStorage.getItem(this.cartStorageKey);

  if (!savedCart) {
    return;
  }

  try {
    const parsedCart = JSON.parse(savedCart) as CartItem[];
    this.cart.set(parsedCart);
  } catch {
    this.cart.set([]);
    localStorage.removeItem(this.cartStorageKey);
  }
}
```

## Why use try/catch?

Because it prevents the app from crashing if the saved data is broken.

This is more professional.

Use this safer version in the final code.

---

# 25. Full Updated `store.service.ts`

Below is the complete Stage 7 version.

Use this if you want a clean final service.

```ts
import { Injectable, computed, signal } from '@angular/core';
import { CartItem, FooterColumn, NavLink, Product } from '../models/store.models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  /*
    localStorage key used to save and load the cart.
  */
  private readonly cartStorageKey = 'mini-tech-store-cart';

  storeName = 'Mini Tech Store';
  location = 'Deliver to Hamilton';

  heroTitle = 'Tech Essentials for Everyday Use';
  heroText = 'Browse featured products, compare prices, and build your order.';

  categories = ['All', 'Audio', 'Accessories', 'Displays', 'Cameras'];

  navLinks: NavLink[] = [
    { label: 'Products', href: '/products' },
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout', href: '/checkout' },
    { label: 'Audio', href: '/products' },
    { label: 'Accessories', href: '/products' },
    { label: 'Displays', href: '/products' },
    { label: 'Cameras', href: '/products' }
  ];

  footerColumns: FooterColumn[] = [
    { title: 'Get to Know Us', links: ['About', 'Careers', 'Blog', 'Store Info'] },
    { title: 'Shop With Us', links: ['Audio', 'Accessories', 'Displays', 'Cameras'] },
    { title: 'Support', links: ['Your Account', 'Orders', 'Returns', 'Help Center'] },
    { title: 'Teaching Demo', links: ['localStorage', 'Cart Persistence', 'Services', 'Signals'] }
  ];

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

  /*
    Constructor runs when the service is created.
    We use it to restore the cart from localStorage.
  */
  constructor() {
    this.loadCartFromStorage();
  }

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

  updateSearchText(value: string) {
    this.searchText.set(value);
  }

  updateSelectedCategory(value: string) {
    this.selectedCategory.set(value);
  }

  cartQuantityForProduct(productId: number) {
    const item = this.cart().find(cartItem => cartItem.id === productId);
    return item ? item.quantity : 0;
  }

  isProductMaxed(product: Product) {
    return this.cartQuantityForProduct(product.id) >= product.stock;
  }

  getProductById(productId: number) {
    return this.products().find(product => product.id === productId);
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

    this.saveCartToStorage();
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

    this.saveCartToStorage();
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

    this.saveCartToStorage();
  }

  removeFromCart(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items => items.filter(item => item.id !== itemId));

    this.saveCartToStorage();
  }

  clearCart() {
    this.cart.set([]);
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.saveCartToStorage();
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

  /*
    Saves the current cart in browser localStorage.
  */
  private saveCartToStorage() {
    localStorage.setItem(
      this.cartStorageKey,
      JSON.stringify(this.cart())
    );
  }

  /*
    Loads the cart from browser localStorage.

    If storage is empty, do nothing.
    If storage is broken, reset it safely.
  */
  private loadCartFromStorage() {
    const savedCart = localStorage.getItem(this.cartStorageKey);

    if (!savedCart) {
      return;
    }

    try {
      const parsedCart = JSON.parse(savedCart) as CartItem[];
      this.cart.set(parsedCart);
    } catch {
      this.cart.set([]);
      localStorage.removeItem(this.cartStorageKey);
    }
  }
}
```

---

# 26. Step 15 — Test Cart Persistence

Run the app:

```bash
ng serve
```

Then test:

```txt
1. Go to /products
2. Add Wireless Headphones
3. Add Gaming Mouse
4. Refresh the page
5. Check the cart count
6. Go to /cart
7. Confirm cart items are still there
```

Expected:

```txt
Cart survives refresh.
```

---

# 27. Test Across Routes

Now test:

```txt
1. Add product on /products
2. Go to /cart
3. Refresh on /cart
4. Go to /checkout
```

Expected:

```txt
The same cart appears across all pages.
```

This proves:

```txt
StoreService + localStorage = shared persistent state
```

---

# 28. Browser DevTools Test

Students can inspect localStorage.

In Chrome or Edge:

```txt
Right click page
Inspect
Application tab
Local Storage
Select localhost
Find mini-tech-store-cart
```

They should see something like:

```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "category": "Audio",
    "price": 99,
    "quantity": 1,
    "stock": 5
  }
]
```

This helps students see where the cart is saved.

---

# 29. Common Mistake: Forgetting JSON.stringify

Bad:

```ts
localStorage.setItem(this.cartStorageKey, this.cart());
```

This does not work because `this.cart()` is an array, not a string.

Correct:

```ts
localStorage.setItem(this.cartStorageKey, JSON.stringify(this.cart()));
```

---

# 30. Common Mistake: Forgetting JSON.parse

Bad:

```ts
const parsedCart = savedCart;
this.cart.set(parsedCart);
```

This sets the cart to a string, not an array.

Correct:

```ts
const parsedCart = JSON.parse(savedCart) as CartItem[];
this.cart.set(parsedCart);
```

---

# 31. Common Mistake: Saving Before Updating

Bad pattern:

```ts
this.saveCartToStorage();

this.cart.update(items => {
  return updatedItems;
});
```

This saves the old cart before the new cart is created.

Correct pattern:

```ts
this.cart.update(items => {
  return updatedItems;
});

this.saveCartToStorage();
```

---

# 32. Common Mistake: Saving in Components

Do not do this inside ProductList:

```ts
localStorage.setItem(...)
```

Do not do this inside CartSummary:

```ts
localStorage.setItem(...)
```

Why?

Because persistence belongs with cart logic.

Cart logic lives in:

```txt
StoreService
```

Keep the design clean.

---

# 33. Does localStorage Update the UI Automatically?

No.

localStorage is only storage.

The UI updates because:

```txt
cart signal changes
```

Then:

```txt
computed values update
```

Then:

```txt
templates update
```

localStorage is just a backup copy.

---

# 34. Important Concept: Source of Truth

In this project, the source of truth during runtime is:

```txt
cart signal
```

localStorage is used to restore that cart after refresh.

Do not treat localStorage as the live cart.

The live cart is still:

```ts
cart = signal<CartItem[]>([]);
```

---

# 35. What Happens on Refresh?

When the page refreshes:

```txt
Angular app restarts
StoreService starts with empty cart signal
constructor runs
loadCartFromStorage reads saved cart
cart signal is set
UI updates
```

This is the full lifecycle.

---

# 36. Should We Save Order Message?

No.

In Stage 7, we only persist the cart.

We should not save:

```txt
orderPlaced
orderMessage
searchText
selectedCategory
```

Why?

Because after refresh, showing an old order success message can be confusing.

Cart persistence is useful.

Old UI messages are usually temporary.

---

# 37. Should We Clear Cart After Order?

Good question.

Right now, `placeOrder()` only shows a success message.

A more realistic version could clear the cart after order.

Option:

```ts
placeOrder() {
  if (this.cart().length === 0) {
    this.orderPlaced.set(false);
    this.orderMessage.set('Your cart is empty. Please add products before placing the order.');
    return;
  }

  this.orderPlaced.set(true);
  this.orderMessage.set('Order placed successfully!');

  this.cart.set([]);
  this.saveCartToStorage();
}
```

But be careful.

For teaching, you may want students to see the cart after placing order.

So do not clear the cart automatically unless you explain the behavior.

Recommended for this stage:

```txt
Keep the cart after order.
Clear Cart button handles clearing.
```

Later, an order system can clear the cart properly.

---

# 38. Better Future Version

In a more advanced version, after order placement we might:

```txt
create order
save order history
clear cart
navigate to confirmation page
```

But that is not Stage 7.

Stage 7 is only about:

```txt
cart persistence
```

Do not overload students.

---

# 39. Stage 7 Testing Checklist

Students should test:

## Add item and refresh

```txt
Add item
Refresh page
Item remains
```

## Increase quantity and refresh

```txt
Increase quantity
Refresh page
Quantity remains
```

## Decrease quantity and refresh

```txt
Decrease quantity
Refresh page
Updated quantity remains
```

## Remove item and refresh

```txt
Remove item
Refresh page
Item stays removed
```

## Clear cart and refresh

```txt
Clear cart
Refresh page
Cart is empty
```

## Invalid localStorage

Optional advanced test:

```txt
Open DevTools
Edit mini-tech-store-cart to invalid text
Refresh page
App should not crash
```

---

# 40. What Students Should Be Able to Explain

At the end of Stage 7, students should explain:

- why cart disappears without persistence
- what localStorage is
- why localStorage stores strings
- why we use `JSON.stringify`
- why we use `JSON.parse`
- why persistence belongs in the service
- why cart signal is still the live source of truth
- how the cart is restored after refresh
- why try/catch makes loading safer

---

# 41. Teacher Explanation Script

Use this in class:

> So far, our cart works while the app is running.  
> But if we refresh the browser, the app restarts and memory is lost.  
> That is not good enough for a shopping app.  
> In this stage, we save the cart into the browser using localStorage.  
> When the app starts again, the service loads the cart back into the signal.  
> The UI updates because the cart signal is restored.

---

# 42. Brutal Warning for Students

Do not store sensitive data in localStorage.

Never store:

```txt
passwords
credit card numbers
private tokens
highly sensitive user information
```

localStorage is readable by browser JavaScript.

For this class project, storing cart items is fine.

---

# 43. Stage 7 Architecture

```txt
StoreService
├── cart signal
├── addToCart()
├── increaseQuantity()
├── decreaseQuantity()
├── removeFromCart()
├── clearCart()
├── saveCartToStorage()
└── loadCartFromStorage()
```

Components stay clean:

```txt
ProductList → calls store.addToCart()
CartSummary → calls store.clearCart()
CheckoutPage → reads store.cart()
```

No component needs to know how localStorage works.

That is good architecture.

---

# 44. Data Flow Diagram

## Saving

```txt
User action
  ↓
Service method runs
  ↓
cart signal updates
  ↓
saveCartToStorage()
  ↓
localStorage updated
```

## Loading

```txt
Browser refresh
  ↓
Angular starts
  ↓
StoreService constructor runs
  ↓
loadCartFromStorage()
  ↓
cart signal restored
  ↓
UI updates
```

---

# 45. Common Errors and Fixes

## Error: `localStorage is not defined`

This usually happens in server-side rendering environments.

For this normal browser-based Angular classroom project, localStorage should work.

If using SSR later, you need browser checks.

Do not worry about SSR in Stage 7.

---

## Error: App crashes after refresh

Possible cause:

```ts
JSON.parse(savedCart)
```

is parsing invalid data.

Use the safer try/catch version.

---

## Error: Cart does not save

Check that every cart-changing method calls:

```ts
this.saveCartToStorage();
```

after updating the cart.

---

## Error: Cart saves but does not load

Check that the constructor calls:

```ts
constructor() {
  this.loadCartFromStorage();
}
```

---

## Error: Cart loads but totals are wrong

Make sure cart items have:

```ts
price
quantity
```

The computed total depends on them:

```ts
item.price * item.quantity
```

---

## Error: Cart count not updating

Make sure templates read computed signals with parentheses:

```html
{{ store.totalItems() }}
```

not:

```html
{{ store.totalItems }}
```

---

# 46. Stage 7 Classroom Checkpoints

Use these during class.

## Checkpoint 1

Add storage key.

App still compiles.

---

## Checkpoint 2

Add save method.

App still compiles.

---

## Checkpoint 3

Call save method after `addToCart`.

Add item, inspect localStorage.

---

## Checkpoint 4

Add load method and constructor.

Refresh page, cart returns.

---

## Checkpoint 5

Update increase/decrease/remove/clear methods.

All cart changes persist after refresh.

---

## Checkpoint 6

Test across routes.

Cart persists on:

```txt
/products
/cart
/checkout
```

---

# 47. Student Mini Challenge

Ask students to answer:

> What happens if we save the cart before calling `cart.update()`?

Expected answer:

```txt
The old cart gets saved, not the updated cart.
```

---

# 48. Student Mini Challenge 2

Ask:

> Why should ProductList not directly write to localStorage?

Expected answer:

```txt
Because persistence belongs with cart state inside StoreService.
Components should not duplicate storage logic.
```

---

# 49. What Comes Next?

After Stage 7, good next options are:

## Stage 8 — Product Images and Product Detail Polish

Add:

```txt
imageUrl
description
delivery text
rating count
larger product details layout
```

## Stage 9 — Checkout Form and Validation

Add:

```txt
customer name
email
address
form validation
disabled order button
```

## Stage 10 — HTTP Client / Mock API

Move product data out of TypeScript and load it from a JSON/API source.

---

# 50. Final Summary

Stage 7 adds persistence.

Before Stage 7:

```txt
Cart disappears on refresh.
```

After Stage 7:

```txt
Cart survives refresh.
```

The key tools are:

```txt
localStorage
JSON.stringify
JSON.parse
StoreService
signals
```

The most important architecture lesson is:

> Components do not need to know how the cart is saved.  
> The service owns the cart and handles persistence.

That is clean Angular thinking.

