# Stage 11 — Connecting Angular to a Real Backend API

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By the end of Stage 10, the storefront no longer depends on hardcoded product data inside `StoreService`.

The app already has:

- product listing page
- product details page
- cart page
- checkout page
- checkout form and validation
- `StoreService`
- cart persistence with `localStorage`
- routing and dynamic routing
- `HttpClient`
- product data loaded from a mock JSON file

Stage 10 was a big step because the data moved outside TypeScript code.

But a JSON file is still not a real backend.

Stage 11 takes the next step:

```txt
Angular frontend
        ↓
Express backend API
```

---

# 1. What Is Stage 11 For?

Stage 11 introduces a simple backend API.

Instead of loading products from:

```txt
/data/products.json
```

Angular will load products from:

```txt
http://localhost:3000/api/products
```

The checkout page will also send orders to:

```txt
http://localhost:3000/api/orders
```

This is the first real full-stack version of the project.

---

# 2. What Problem Are We Solving?

Before Stage 11:

```txt
Angular pretends to call an API by reading a JSON file.
```

After Stage 11:

```txt
Angular actually calls a backend server.
```

This matters because real applications usually need a backend for:

- products
- orders
- users
- inventory
- payments
- admin tools
- database access

The frontend should not be responsible for everything.

---

# 3. Stage 11 Learning Goals

By the end of Stage 11, students should understand:

- what a backend API is
- what an endpoint is
- what Express does
- what `GET` means
- what `POST` means
- why Angular and backend apps run on different ports
- what CORS means at a beginner level
- how Angular calls a backend using `HttpClient`
- how Angular sends an order to the backend
- why backend data stored in memory disappears after restart
- why a database is the next logical step

---

# 4. Stage 10 vs Stage 11

## Stage 10

Angular loaded products from a mock JSON file:

```txt
Angular → products.json
```

## Stage 11

Angular loads products from a backend API:

```txt
Angular → Express API → products
```

The Angular side still uses `HttpClient`.

That is important.

Stage 10 prepared students for Stage 11.

---

# 5. Main Mental Model

Use this idea:

```txt
Frontend = what the user sees
Backend = what provides and processes data
```

Angular is the frontend.

Express is the backend.

They communicate using HTTP.

---

# 6. What We Are Building

We will create a small Express backend with three routes:

```txt
GET  /api/products
POST /api/orders
GET  /api/orders
```

## `GET /api/products`

Returns the product list.

## `POST /api/orders`

Receives an order from Angular.

## `GET /api/orders`

Shows submitted orders for testing.

---

# 7. Final Folder Structure

A clean structure can look like this:

```txt
mini-tech-store/
├── angular-storefront/
│   └── Angular app
└── backend-api/
    └── Express API
```

The frontend and backend are separate projects.

That is not a mistake.

That is how real apps are often organized.

---

# 8. Step 1 — Create the Backend Folder

From the parent project folder, run:

```bash
mkdir backend-api
cd backend-api
```

Initialize a Node project:

```bash
npm init -y
```

This creates:

```txt
package.json
```

---

# 9. Step 2 — Install Express and CORS

Run:

```bash
npm install express cors
```

## Why Express?

Express lets us create API routes.

## Why CORS?

Angular usually runs on:

```txt
http://localhost:4200
```

The backend will run on:

```txt
http://localhost:3000
```

Because these are different origins, the browser may block requests unless the backend allows them.

CORS allows the frontend to call the backend during development.

Beginner explanation:

> CORS is the browser asking, “Is this frontend allowed to call this backend?”

---

# 10. Step 3 — Create `server.js`

Inside `backend-api`, create:

```txt
server.js
```

Paste this code:

```js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

/*
  Allows Angular running on localhost:4200
  to call this backend running on localhost:3000.
*/
app.use(cors());

/*
  Allows Express to read JSON sent in POST requests.
  Without this, req.body may be undefined.
*/
app.use(express.json());

/*
  Stage 11 uses in-memory product data.
  This is not a database yet.
*/
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Audio',
    price: 99,
    stock: 5,
    rating: '★★★★☆',
    ratingCount: 128,
    imageUrl: 'https://placehold.co/600x400?text=Headphones',
    description: 'Comfortable wireless headphones with clear sound and long battery life.',
    deliveryText: 'Free delivery available by tomorrow.'
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    price: 75,
    stock: 4,
    rating: '★★★★★',
    ratingCount: 94,
    imageUrl: 'https://placehold.co/600x400?text=Keyboard',
    description: 'Responsive mechanical keyboard designed for typing, gaming, and productivity.',
    deliveryText: 'Ships within 24 hours.'
  },
  {
    id: 3,
    name: 'Gaming Mouse',
    category: 'Accessories',
    price: 40,
    stock: 6,
    rating: '★★★★☆',
    ratingCount: 211,
    imageUrl: 'https://placehold.co/600x400?text=Mouse',
    description: 'Lightweight gaming mouse with accurate tracking and ergonomic grip.',
    deliveryText: 'Free delivery on orders over $50.'
  },
  {
    id: 4,
    name: '24 Inch Monitor',
    category: 'Displays',
    price: 220,
    stock: 3,
    rating: '★★★★☆',
    ratingCount: 67,
    imageUrl: 'https://placehold.co/600x400?text=Monitor',
    description: 'Full HD monitor for work, study, streaming, and everyday productivity.',
    deliveryText: 'Delivery available this week.'
  },
  {
    id: 5,
    name: 'HD Webcam',
    category: 'Cameras',
    price: 60,
    stock: 7,
    rating: '★★★★☆',
    ratingCount: 143,
    imageUrl: 'https://placehold.co/600x400?text=Webcam',
    description: 'HD webcam for online classes, video meetings, and content creation.',
    deliveryText: 'Usually ships in 1 to 2 days.'
  },
  {
    id: 6,
    name: 'Bluetooth Speaker',
    category: 'Audio',
    price: 120,
    stock: 2,
    rating: '★★★★☆',
    ratingCount: 76,
    imageUrl: 'https://placehold.co/600x400?text=Speaker',
    description: 'Portable Bluetooth speaker with strong sound and rechargeable battery.',
    deliveryText: 'Only a few left. Order soon.'
  }
];

/*
  Orders are stored in memory for this stage.
  If the backend restarts, orders disappear.
  A database comes later.
*/
const orders = [];

/*
  GET /api/products
  Sends product data to Angular.
*/
app.get('/api/products', (req, res) => {
  res.json(products);
});

/*
  POST /api/orders
  Receives order data from Angular.
*/
app.post('/api/orders', (req, res) => {
  const order = req.body;

  if (!order || !order.customer || !order.items || order.items.length === 0) {
    return res.status(400).json({
      message: 'Invalid order. Customer and cart items are required.'
    });
  }

  const newOrder = {
    id: orders.length + 1,
    customer: order.customer,
    items: order.items,
    total: order.total,
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  res.status(201).json({
    message: 'Order created successfully.',
    order: newOrder
  });
});

/*
  GET /api/orders
  Optional testing route to view submitted orders.
*/
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
});
```

---

# 11. Step 4 — Add a Start Script

Open:

```txt
backend-api/package.json
```

Find `scripts` and replace it with:

```json
"scripts": {
  "start": "node server.js"
}
```

Now run:

```bash
npm start
```

Expected output:

```txt
Backend API running at http://localhost:3000
```

---

# 12. Step 5 — Test the Backend First

Open this in the browser:

```txt
http://localhost:3000/api/products
```

Expected:

```txt
Product JSON appears in the browser.
```

Do not move to Angular until this works.

This is a key debugging habit.

Backend first. Frontend second.

---

# 13. Step 6 — Update Angular Product API URL

Open:

```txt
src/app/services/store.service.ts
```

Find this from Stage 10:

```ts
this.http.get<Product[]>('/data/products.json')
```

Replace it with:

```ts
this.http.get<Product[]>('http://localhost:3000/api/products')
```

Your `loadProducts()` should look like this:

```ts
loadProducts() {
  this.productsLoading.set(true);
  this.productsError.set('');

  this.http.get<Product[]>('http://localhost:3000/api/products').subscribe({
    next: products => {
      this.products.set(products);
      this.productsLoading.set(false);
    },
    error: () => {
      this.productsError.set('Could not load products from the backend.');
      this.productsLoading.set(false);
    }
  });
}
```

---

# 14. What Changed in Angular?

Not much.

That is the point.

Because Stage 10 already introduced `HttpClient`, Stage 11 only changes the URL.

Before:

```txt
Angular → JSON file
```

After:

```txt
Angular → Express backend
```

The rest of the app can keep reading from:

```ts
products
filteredProducts
getProductById()
```

That is good architecture.

---

# 15. Step 7 — Run Angular and Backend Together

You now need two terminals.

## Terminal 1 — Backend

```bash
cd backend-api
npm start
```

Runs on:

```txt
http://localhost:3000
```

## Terminal 2 — Angular

```bash
cd angular-storefront
ng serve
```

Runs on:

```txt
http://localhost:4200
```

Both must be running.

---

# 16. Stage 11 Checkpoint — Product Loading

Open:

```txt
http://localhost:4200/products
```

Expected:

```txt
Products still appear.
```

But now they come from:

```txt
http://localhost:3000/api/products
```

not from:

```txt
products.json
```

---

# 17. Step 8 — Add Order Types to Angular

Open:

```txt
src/app/models/store.models.ts
```

Add:

```ts
export type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};

export type OrderRequest = {
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
};

export type OrderResponse = {
  message: string;
  order: {
    id: number;
    customer: CustomerInfo;
    items: CartItem[];
    total: number;
    createdAt: string;
  };
};
```

---

# 18. Why Add Order Types?

Types help students see the shape of data moving between frontend and backend.

Angular sends:

```txt
OrderRequest
```

Backend returns:

```txt
OrderResponse
```

This makes the contract clearer.

---

# 19. Step 9 — Update StoreService Imports

Open:

```txt
src/app/services/store.service.ts
```

Update imports:

```ts
import {
  CartItem,
  CustomerInfo,
  FooterColumn,
  NavLink,
  OrderRequest,
  OrderResponse,
  Product
} from '../models/store.models';
```

---

# 20. Step 10 — Add Order Submission State

Inside `StoreService`, add:

```ts
orderSubmitting = signal(false);
orderError = signal('');
```

## Why?

Submitting an order is asynchronous.

The app needs to know:

```txt
Is the order currently submitting?
Did the order fail?
Did the order succeed?
```

---

# 21. Step 11 — Add `submitOrderToApi()`

Inside `StoreService`, add:

```ts
submitOrderToApi(customer: CustomerInfo) {
  if (this.cart().length === 0) {
    this.orderPlaced.set(false);
    this.orderMessage.set('Your cart is empty. Please add products before placing the order.');
    return;
  }

  const orderRequest: OrderRequest = {
    customer,
    items: this.cart(),
    total: this.cartTotal()
  };

  this.orderSubmitting.set(true);
  this.orderError.set('');
  this.orderPlaced.set(false);
  this.orderMessage.set('');

  this.http.post<OrderResponse>('http://localhost:3000/api/orders', orderRequest).subscribe({
    next: response => {
      this.orderSubmitting.set(false);
      this.orderPlaced.set(true);
      this.orderMessage.set(`${response.message} Order #${response.order.id}`);

      /*
        After backend accepts the order,
        clear the cart and save the empty cart to localStorage.
      */
      this.cart.set([]);
      this.saveCartToStorage();
    },
    error: () => {
      this.orderSubmitting.set(false);
      this.orderPlaced.set(false);
      this.orderError.set('Could not submit order. Please try again.');
      this.orderMessage.set('Could not submit order. Please try again.');
    }
  });
}
```

---

# 22. Why This Belongs in StoreService

Order submission needs:

- cart data
- cart total
- HTTP
- order status
- cart clearing
- localStorage update

Those are app-level concerns.

So this logic belongs in:

```txt
StoreService
```

The checkout page should collect customer information and then call the service.

---

# 23. Step 12 — Update CheckoutPage

Open:

```txt
src/app/pages/checkout-page/checkout-page.ts
```

Find `submitOrder()`.

Change it to:

```ts
submitOrder() {
  this.formSubmitted = true;

  if (!this.canPlaceOrder()) {
    this.store.orderPlaced.set(false);
    this.store.orderMessage.set('Please complete the checkout form before placing your order.');
    return;
  }

  this.store.submitOrderToApi({
    fullName: this.checkoutForm.fullName,
    email: this.checkoutForm.email,
    phone: this.checkoutForm.phone,
    address: this.checkoutForm.address,
    city: this.checkoutForm.city,
    province: this.checkoutForm.province,
    postalCode: this.checkoutForm.postalCode
  });
}
```

---

# 24. What Changed in Checkout?

Before Stage 11:

```txt
Checkout simulated an order inside Angular.
```

After Stage 11:

```txt
Checkout sends the order to the backend.
```

This is a real frontend/backend interaction.

---

# 25. Step 13 — Update Checkout Button for Submitting State

Open:

```txt
src/app/pages/checkout-page/checkout-page.html
```

Find the Place Order button.

Update it:

```html
<button
  class="place-order-btn"
  (click)="submitOrder()"
  [disabled]="store.orderSubmitting()"
>
  @if (store.orderSubmitting()) {
    Submitting Order...
  } @else {
    Place Order
  }
</button>
```

## Why?

While the order is being sent, the user should not click the button repeatedly.

This helps prevent duplicate submissions.

---

# 26. Step 14 — Test Order Submission

Start both servers.

## Backend

```bash
npm start
```

## Angular

```bash
ng serve
```

Then:

1. Go to `/products`
2. Add products to cart
3. Go to `/checkout`
4. Fill checkout form
5. Click Place Order

Expected:

```txt
Order created successfully. Order #1
```

Cart should clear after successful order.

---

# 27. Step 15 — Verify Orders in Backend

Open:

```txt
http://localhost:3000/api/orders
```

You should see submitted orders.

Example:

```json
[
  {
    "id": 1,
    "customer": {
      "fullName": "Sadeed Farooq",
      "email": "sadeed@example.com"
    },
    "items": [],
    "total": 174,
    "createdAt": "2026-05-08T00:00:00.000Z"
  }
]
```

This proves Angular successfully sent data to the backend.

---

# 28. Important Warning About In-Memory Data

In Stage 11, orders are stored in memory:

```js
const orders = [];
```

That means:

```txt
If the backend restarts, orders disappear.
```

This is okay for Stage 11.

A database comes later.

---

# 29. Stage 11 Data Flow

## Loading products

```txt
Angular starts
        ↓
StoreService.loadProducts()
        ↓
GET http://localhost:3000/api/products
        ↓
Express returns products
        ↓
products signal updates
        ↓
UI updates
```

## Submitting order

```txt
User fills checkout form
        ↓
CheckoutPage validates form
        ↓
CheckoutPage calls store.submitOrderToApi(customer)
        ↓
StoreService sends POST /api/orders
        ↓
Express validates and stores order
        ↓
Express returns success response
        ↓
Angular shows order success message
        ↓
Cart clears
```

---

# 30. GET vs POST

## GET

Used to retrieve data.

Example:

```txt
GET /api/products
```

Meaning:

```txt
Give me the product list.
```

## POST

Used to send new data.

Example:

```txt
POST /api/orders
```

Meaning:

```txt
Create a new order with this data.
```

---

# 31. Frontend vs Backend Responsibilities

## Frontend

Angular is responsible for:

- displaying products
- showing the cart
- collecting checkout form data
- validating user input
- calling backend APIs
- showing success and error messages

## Backend

Express is responsible for:

- providing product data
- receiving order data
- validating submitted order data
- creating order records
- returning API responses

---

# 32. Common Errors and Fixes

## Error: Cannot GET /api/products

Possible causes:

- backend server is not running
- route name is wrong
- URL is typed incorrectly

Check:

```txt
http://localhost:3000/api/products
```

---

## Error: Angular products not loading

Check:

```ts
this.http.get<Product[]>('http://localhost:3000/api/products')
```

Also check backend terminal for errors.

---

## Error: CORS error in browser console

Make sure backend has:

```js
const cors = require('cors');
app.use(cors());
```

---

## Error: POST body is undefined

Make sure backend has:

```js
app.use(express.json());
```

Without this, Express cannot read JSON sent by Angular.

---

## Error: HttpClient not available

Make sure Angular has:

```ts
provideHttpClient()
```

inside `app.config.ts`.

---

## Error: Order does not submit

Check:

- cart has items
- checkout form is valid
- backend is running
- POST URL is correct
- backend has `/api/orders`

---

# 33. Classroom Checkpoints

Use these checkpoints.

## Checkpoint 1

Backend folder created.

## Checkpoint 2

Express and CORS installed.

## Checkpoint 3

`GET /api/products` works in browser.

## Checkpoint 4

Angular loads products from backend.

## Checkpoint 5

Checkout sends order to backend.

## Checkpoint 6

`GET /api/orders` shows submitted orders.

## Checkpoint 7

Cart clears after successful backend order.

---

# 34. What Students Should Be Able to Explain

At the end of Stage 11, students should explain:

- what a backend API is
- what an endpoint is
- what Express does
- why Angular and backend run on different ports
- what CORS does at a beginner level
- what `GET` is used for
- what `POST` is used for
- how Angular sends an order to the backend
- why data stored in memory disappears after server restart
- why the database is the next logical step

---

# 35. Teacher Explanation Script

Use this in class:

> Until now, Angular loaded data from a local JSON file.  
> That helped us learn HttpClient.  
> But real apps usually talk to a backend.  
> In this stage, we create a small Express API.  
> Angular gets products from the backend and sends orders back to the backend.  
> This is the first real full-stack version of our store.

---

# 36. Brutal Mentor Warning

Do not let students think a backend is just “another file.”

A backend is a separate application.

It has its own:

- server
- routes
- port
- `package.json`
- dependencies
- responsibilities

Frontend and backend work together, but they are not the same thing.

---

# 37. What Stage 11 Should Not Do Yet

Do not add:

- database
- login
- passwords
- payment processing
- admin dashboard
- deployment
- JWT authentication

Those are later stages.

Stage 11 is only about:

```txt
Angular frontend talking to Express backend.
```

Keep the lesson focused.

---

# 38. What Comes Next?

After Stage 11, the next strong step is:

```txt
Stage 12 — Database Integration
```

That means replacing in-memory arrays with a database.

Options:

- MongoDB
- PostgreSQL
- SQLite
- SQL Server

For beginner students, MongoDB or SQLite can be simpler.

---

# 39. Final Summary

Stage 11 moves the project from:

```txt
Angular + mock JSON file
```

to:

```txt
Angular frontend + Express backend API
```

The key tools are:

- Node.js
- Express
- CORS
- HttpClient
- GET
- POST
- API endpoints

The biggest mindset shift is:

> The frontend displays and sends data.  
> The backend provides, receives, and processes data.

This is the first real full-stack step in the project.

