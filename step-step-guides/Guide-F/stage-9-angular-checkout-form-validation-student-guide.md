# Stage 9 — Checkout Form and Validation

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By Stage 8, the storefront has become much more realistic.

The app already has:

- product listing page
- product images
- richer product details
- product details route
- cart page
- checkout page
- cart persistence with localStorage
- `StoreService`
- shared cart state
- routing
- product detail routing
- add/remove/update cart logic

Now we need to improve the checkout experience.

Right now, the checkout page may only show cart items and a Place Order button.

That is not enough for a real shopping flow.

A real checkout needs customer information.

---

# 1. What Is Stage 9 For?

Stage 9 adds a checkout form.

The user will enter:

```txt
Full name
Email
Phone
Address
City
Province
Postal code
```

The app will validate the form before allowing the order.

The main goal is:

> Teach Angular forms and validation using a realistic checkout example.

---

# 2. What Problem Are We Solving?

Before Stage 9, checkout is too simple.

The user can place an order without giving any customer information.

That is not realistic.

A real store needs to know:

```txt
Who is ordering?
Where should the order be delivered?
How can we contact the customer?
```

Stage 9 fixes this.

---

# 3. Stage 9 Learning Goals

By the end of Stage 9, students should understand:

- what a form is in Angular
- how to use `ngModel`
- how to bind form fields to component data
- how to validate required fields
- how to validate email format
- how to show validation messages
- how to disable or block order submission until the form is valid
- how to combine form validation with cart validation
- how to create a cleaner order confirmation experience

---

# 4. Stage 9 Mental Model

The project has been growing step by step:

```txt
Stage 1 → Make it visible
Stage 2 → Make it data-driven
Stage 3 → Make it reactive
Stage 4 → Make it smarter
Stage 5 → Make it clean with components
Level 4 → Move state into service
Level 5 → Add pages
Stage 6 → Add dynamic product details
Stage 7 → Persist cart
Stage 8 → Polish product experience
Stage 9 → Validate checkout
```

Stage 9 is where the checkout page becomes more realistic.

---

# 5. Template-Driven Forms vs Reactive Forms

Angular has two major form styles:

```txt
Template-driven forms
Reactive forms
```

For this beginner-friendly stage, we will use:

```txt
Template-driven forms
```

Why?

Because students already used:

```html
[ngModel]
(ngModelChange)
```

in the search bar.

Now they can extend that idea to a real checkout form.

---

# 6. What We Will Build

We will update the checkout page so it has:

```txt
Customer information form
Validation messages
Order summary
Place Order button
Success/error message
Empty cart message
```

The page will still use:

```txt
StoreService
```

for cart and order state.

The form itself can live inside the checkout page component.

---

# 7. Why Form State Can Live in CheckoutPage

The cart belongs in `StoreService` because multiple pages need it.

But checkout form values are only used on the checkout page.

So it is okay for form state to live in:

```txt
CheckoutPage
```

This is an important architecture lesson.

## Shared state

Belongs in service:

```txt
cart
products
searchText
selectedCategory
```

## Local page state

Can stay in page component:

```txt
customerName
email
phone
address
city
province
postalCode
```

---

# 8. Step 1 — Update Checkout Page TypeScript

Open:

```txt
src/app/pages/checkout-page/checkout-page.ts
```

We need:

```txt
FormsModule
CurrencyPipe
RouterLink
StoreService
```

Use this version.

## `checkout-page.ts`

```ts
import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { StoreService } from '../../services/store.service';

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};

@Component({
  selector: 'app-checkout-page',

  /*
    FormsModule is needed for ngModel.
    CurrencyPipe is needed for prices.
    RouterLink is needed for navigation links.
  */
  imports: [FormsModule, CurrencyPipe, RouterLink],

  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css'
})
export class CheckoutPage {
  /*
    Checkout still reads cart data from StoreService.
  */
  store = inject(StoreService);

  /*
    This object holds form values.
    This is local state because only CheckoutPage needs it.
  */
  checkoutForm: CheckoutForm = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  };

  /*
    This flag helps us decide when to show validation messages.
    We do not want to show all errors before the user tries to submit.
  */
  formSubmitted = false;

  /*
    Simple email check.
    This is not perfect, but it is good enough for a beginner project.
  */
  isEmailValid() {
    return this.checkoutForm.email.includes('@') &&
      this.checkoutForm.email.includes('.');
  }

  /*
    Checks whether all required fields have values.
  */
  isFormComplete() {
    return this.checkoutForm.fullName.trim() !== '' &&
      this.checkoutForm.email.trim() !== '' &&
      this.checkoutForm.phone.trim() !== '' &&
      this.checkoutForm.address.trim() !== '' &&
      this.checkoutForm.city.trim() !== '' &&
      this.checkoutForm.province.trim() !== '' &&
      this.checkoutForm.postalCode.trim() !== '';
  }

  /*
    The form is valid only if:
    - all required fields are filled
    - email looks valid
  */
  isFormValid() {
    return this.isFormComplete() && this.isEmailValid();
  }

  /*
    User can place order only when:
    - cart has items
    - form is valid
  */
  canPlaceOrder() {
    return this.store.cart().length > 0 && this.isFormValid();
  }

  /*
    Runs when user clicks Place Order.

    If the form is invalid, show validation messages.
    If valid, call the store order method.
  */
  submitOrder() {
    this.formSubmitted = true;

    if (!this.canPlaceOrder()) {
      this.store.orderPlaced.set(false);
      this.store.orderMessage.set('Please complete the checkout form before placing your order.');
      return;
    }

    this.store.placeOrder();
  }

  /*
    Optional helper to reset the form after a successful order.
    We will not call it automatically yet, because students may want
    to see the completed form while testing.
  */
  resetForm() {
    this.checkoutForm = {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: ''
    };

    this.formSubmitted = false;
  }
}
```

---

# 9. Why Use a `CheckoutForm` Type?

This type:

```ts
type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};
```

describes the shape of the checkout form.

It helps TypeScript catch mistakes.

Example:

```ts
this.checkoutForm.fullName
```

is valid.

But this typo would be caught:

```ts
this.checkoutForm.fullname
```

because the property is actually:

```ts
fullName
```

---

# 10. Why Not Put Checkout Form in StoreService?

Because this form is page-specific.

Only the checkout page needs it.

If every small form value goes into the service, the service becomes messy.

Keep this rule:

> Shared app data goes in the service. Page-only form data can stay in the page.

---

# 11. Step 2 — Update Checkout Page HTML

Open:

```txt
src/app/pages/checkout-page/checkout-page.html
```

Replace it with this.

## `checkout-page.html`

```html
<main class="checkout-page">
  <section class="page-header">
    <h1>Checkout</h1>
    <p>Enter your delivery information and review your order.</p>
  </section>

  @if (store.cart().length === 0) {
    <section class="checkout-card">
      <h2>Your cart is empty</h2>
      <p>Add products before continuing to checkout.</p>

      <a routerLink="/products" class="continue-btn">
        Continue Shopping
      </a>
    </section>
  } @else {
    <div class="checkout-layout">
      <!-- Left side: Customer information form. -->
      <section class="checkout-card">
        <h2>Delivery Information</h2>

        <form class="checkout-form">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              [(ngModel)]="checkoutForm.fullName"
              placeholder="Enter your full name"
            />

            @if (formSubmitted && checkoutForm.fullName.trim() === '') {
              <p class="error-text">Full name is required.</p>
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              [(ngModel)]="checkoutForm.email"
              placeholder="example@email.com"
            />

            @if (formSubmitted && checkoutForm.email.trim() === '') {
              <p class="error-text">Email is required.</p>
            }

            @if (formSubmitted && checkoutForm.email.trim() !== '' && !isEmailValid()) {
              <p class="error-text">Enter a valid email address.</p>
            }
          </div>

          <div class="form-group">
            <label for="phone">Phone</label>
            <input
              id="phone"
              type="text"
              name="phone"
              [(ngModel)]="checkoutForm.phone"
              placeholder="Enter your phone number"
            />

            @if (formSubmitted && checkoutForm.phone.trim() === '') {
              <p class="error-text">Phone number is required.</p>
            }
          </div>

          <div class="form-group">
            <label for="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              [(ngModel)]="checkoutForm.address"
              placeholder="Street address"
            />

            @if (formSubmitted && checkoutForm.address.trim() === '') {
              <p class="error-text">Address is required.</p>
            }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">City</label>
              <input
                id="city"
                type="text"
                name="city"
                [(ngModel)]="checkoutForm.city"
                placeholder="City"
              />

              @if (formSubmitted && checkoutForm.city.trim() === '') {
                <p class="error-text">City is required.</p>
              }
            </div>

            <div class="form-group">
              <label for="province">Province</label>
              <input
                id="province"
                type="text"
                name="province"
                [(ngModel)]="checkoutForm.province"
                placeholder="Province"
              />

              @if (formSubmitted && checkoutForm.province.trim() === '') {
                <p class="error-text">Province is required.</p>
              }
            </div>
          </div>

          <div class="form-group">
            <label for="postalCode">Postal Code</label>
            <input
              id="postalCode"
              type="text"
              name="postalCode"
              [(ngModel)]="checkoutForm.postalCode"
              placeholder="Postal code"
            />

            @if (formSubmitted && checkoutForm.postalCode.trim() === '') {
              <p class="error-text">Postal code is required.</p>
            }
          </div>
        </form>
      </section>

      <!-- Right side: Order review. -->
      <section class="checkout-card">
        <h2>Order Review</h2>

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
          (click)="submitOrder()"
        >
          Place Order
        </button>

        @if (!isFormValid()) {
          <p class="helper-text">
            Complete the delivery form before checkout.
          </p>
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

        @if (store.orderPlaced()) {
          <div class="confirmation-box">
            <h3>Thank you, {{ checkoutForm.fullName }}!</h3>
            <p>Your order confirmation will be sent to {{ checkoutForm.email }}.</p>
          </div>
        }
      </section>
    </div>
  }
</main>
```

---

# 12. Why Use `[(ngModel)]`?

This:

```html
[(ngModel)]="checkoutForm.fullName"
```

means two-way binding.

It does two things:

```txt
Displays the current value from TypeScript
Updates TypeScript when the user types
```

So if the user types:

```txt
Sadeed Farooq
```

then:

```ts
checkoutForm.fullName
```

becomes:

```txt
Sadeed Farooq
```

---

# 13. Why Does Each Input Need a `name`?

In template-driven Angular forms, when using `ngModel` inside a form, each input needs a `name`.

Example:

```html
<input
  name="fullName"
  [(ngModel)]="checkoutForm.fullName"
/>
```

Without `name`, Angular may complain.

---

# 14. Why Show Errors Only After Submit?

If we show errors immediately, the page feels aggressive.

The user sees errors before doing anything.

Instead, we use:

```ts
formSubmitted = false;
```

When the user clicks Place Order:

```ts
this.formSubmitted = true;
```

Then validation messages appear.

This is better UX.

---

# 15. Step 3 — Add Checkout Page CSS

Open:

```txt
src/app/pages/checkout-page/checkout-page.css
```

Replace it with this.

## `checkout-page.css`

```css
.checkout-page {
  max-width: 1200px;
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

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

.checkout-card {
  background: white;
  border: 1px solid #dcdfe3;
  border-radius: 6px;
  padding: 24px;
}

.checkout-card h2 {
  margin-top: 0;
}

.checkout-form {
  display: grid;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-group {
  display: grid;
  gap: 6px;
}

.form-group label {
  font-weight: 700;
  color: #111827;
}

.form-group input {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 11px 12px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: 2px solid #f59e0b;
  border-color: #f59e0b;
}

.error-text {
  color: #b91c1c;
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0;
}

.helper-text {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 10px 0 0;
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

.confirmation-box {
  margin-top: 16px;
  padding: 16px;
  background: #ecfdf3;
  border: 1px solid #bbf7d0;
  color: #166534;
  border-radius: 6px;
}

.confirmation-box h3 {
  margin-top: 0;
}

@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
```

---

# 16. Step 4 — Test Empty Cart Checkout

Go to:

```txt
/checkout
```

with an empty cart.

Expected:

```txt
Your cart is empty
Continue Shopping button
```

This prevents the user from filling checkout information with no products.

---

# 17. Step 5 — Test Checkout With Cart Items

1. Go to:

```txt
/products
```

2. Add one or more products.

3. Go to:

```txt
/checkout
```

Expected:

```txt
Delivery Information form
Order Review
Place Order button
```

---

# 18. Step 6 — Test Validation Messages

Click Place Order with an incomplete form.

Expected:

```txt
Please complete the checkout form before placing your order.
Validation messages appear under missing fields.
```

This is why the teaching version allows the button to be clicked.

The submit method decides if the order is valid.

---

# 19. Disabled Button Approach vs Teaching Approach

There are two valid patterns.

## Pattern A — Disable button until valid

```html
[disabled]="!canPlaceOrder()"
```

Pros:

- prevents invalid click

Cons:

- students may not see validation messages clearly

## Pattern B — Allow click and show errors

```html
(click)="submitOrder()"
```

Pros:

- better for teaching validation
- students see exactly what is missing

Cons:

- user can click before form is valid, but the method blocks order

For this stage, use Pattern B.

---

# 20. Step 7 — Test Email Validation

Try:

```txt
sadeed
```

Expected:

```txt
Enter a valid email address.
```

Try:

```txt
sadeed@example.com
```

Expected:

```txt
Email error should no longer apply.
```

---

# 21. Step 8 — Test Successful Order

Fill all fields:

```txt
Full Name: Sadeed Farooq
Email: sadeed@example.com
Phone: 9051234567
Address: 123 Main Street
City: Hamilton
Province: Ontario
Postal Code: L8P 1A1
```

Click:

```txt
Place Order
```

Expected:

```txt
Order placed successfully!
Thank you, Sadeed Farooq!
Your order confirmation will be sent to sadeed@example.com.
```

---

# 22. Should We Clear Cart After Successful Order?

For Stage 9, recommended answer:

```txt
No, not yet.
```

Why?

Because there is no order history page yet.

If we clear the cart immediately, students may wonder where the order went.

Later, after adding order history or confirmation page, clearing the cart makes more sense.

---

# 23. What Stage 9 Should Not Do Yet

Do not add:

```txt
real payments
credit card processing
backend orders
authentication
order history
email confirmation
```

Those are advanced topics.

Stage 9 is only about:

```txt
checkout form and validation
```

Keep the learning focused.

---

# 24. Important Security Warning

Never collect real credit card data in a class demo.

Never store payment data in:

```txt
localStorage
frontend variables
plain text
```

Payment processing must be handled by secure payment providers.

This project should not collect real payment information.

---

# 25. Common Errors and Fixes

## Error: Can't bind to `ngModel`

Fix:

Import `FormsModule` in `checkout-page.ts`.

```ts
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, CurrencyPipe, RouterLink]
})
```

---

## Error: If ngModel is used within a form tag, either the name attribute must be set

Fix:

Every input inside a form needs a `name`.

Correct:

```html
<input
  name="email"
  [(ngModel)]="checkoutForm.email"
/>
```

Wrong:

```html
<input
  [(ngModel)]="checkoutForm.email"
/>
```

---

## Error: Currency pipe not found

Fix:

Import `CurrencyPipe`.

```ts
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe]
})
```

---

## Error: routerLink not working

Fix:

Import `RouterLink`.

```ts
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink]
})
```

---

## Error: Validation messages never show

Check:

```ts
formSubmitted = true;
```

inside:

```ts
submitOrder()
```

Also check your template conditions use:

```html
formSubmitted && ...
```

---

## Error: Place Order never succeeds

Check:

```ts
canPlaceOrder()
```

Make sure:

- cart has items
- all form fields are filled
- email contains `@` and `.`

---

# 26. Stage 9 Data Flow

## Typing into form

```txt
User types full name
        ↓
ngModel updates checkoutForm.fullName
        ↓
Template can read updated value
```

---

## Clicking Place Order

```txt
User clicks Place Order
        ↓
submitOrder() runs
        ↓
formSubmitted becomes true
        ↓
if invalid, show errors
        ↓
if valid, call store.placeOrder()
        ↓
order message appears
```

---

# 27. Architecture Reminder

The checkout page now has two kinds of data.

## Shared data from service

```txt
cart
cartTotal
orderMessage
orderPlaced
```

## Local checkout page data

```txt
fullName
email
phone
address
city
province
postalCode
formSubmitted
```

This is good separation.

---

# 28. Classroom Checkpoints

Use these checkpoints in class.

## Checkpoint 1

Checkout page imports `FormsModule`.

App compiles.

---

## Checkpoint 2

Form fields display.

Typing into fields updates the form object.

---

## Checkpoint 3

Empty form shows validation messages after submit attempt.

---

## Checkpoint 4

Invalid email shows email validation message.

---

## Checkpoint 5

Valid form allows successful order.

---

## Checkpoint 6

Empty cart still blocks checkout.

---

## Checkpoint 7

Cart totals still come from `StoreService`.

---

# 29. What Students Should Be Able to Explain

At the end of Stage 9, students should explain:

- why checkout needs a form
- what `[(ngModel)]` does
- why each input needs a `name`
- what form validation means
- why email needs validation
- why form data can stay in CheckoutPage
- why cart data stays in StoreService
- how submitOrder decides whether order can be placed

---

# 30. Teacher Explanation Script

Use this in class:

> Until now, our checkout page could place an order without knowing who the customer is.  
> That is not realistic.  
> In this stage, we add a checkout form.  
> The form collects delivery information.  
> Then we validate the form before placing the order.  
> Cart data still comes from the service, but form data stays inside the checkout page because only this page needs it.

---

# 31. Brutal Mentor Warning

Do not let students think validation is optional.

A form without validation is not a real form.

Bad checkout:

```txt
empty name
bad email
missing address
still places order
```

Good checkout:

```txt
checks required fields
checks email format
shows useful messages
prevents bad order
```

---

# 32. Stage 9 Summary

Stage 9 adds:

- checkout form
- local form state
- `FormsModule`
- `[(ngModel)]`
- required field validation
- simple email validation
- customer delivery information
- improved order submission logic
- confirmation message

The app now behaves more like a real shopping checkout flow.

---

# 33. What Comes Next?

After Stage 9, the next strong step is:

```txt
Stage 10 — Mock API / HttpClient
```

That means product data will no longer be hardcoded in `StoreService`.

Instead, the app will load products from a JSON file or API.

This teaches:

- `HttpClient`
- async data
- loading state
- error state
- API-driven frontend apps

---

# 34. Final Mental Model

```txt
Stage 8 → Products feel real
Stage 9 → Checkout feels real
Stage 10 → Data source feels real
```

Or:

```txt
Product polish
→ Checkout validation
→ API data
```

