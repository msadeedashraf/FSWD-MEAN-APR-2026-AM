# Stage 12 — Adding a Database to the Backend

## Student-Centric Step-by-Step Guide

---

## 0. Where We Are in the Project

By the end of Stage 11, the project became a real full-stack application.

We now have:

```txt
Angular frontend
        ↓
Express backend API
```

The Angular app can:

- load products from the backend
- submit checkout orders to the backend
- use `HttpClient`
- handle loading states
- handle error states
- call `GET /api/products`
- call `POST /api/orders`

That was a huge step.

But Stage 11 still has one major weakness.

The backend stores data in memory.

Example:

```js
const products = [ ... ];
const orders = [];
```

That means:

```txt
Server running → data exists
Server restarts → data disappears
```

That is not good enough for a real application.

Stage 12 fixes this by adding a database.

---

# 1. What Is Stage 12 For?

Stage 12 introduces database integration.

Instead of storing products and orders inside JavaScript arrays, the backend will store them in a database.

In this guide, we will use:

```txt
MongoDB
Mongoose
Express
Angular
```

MongoDB will store:

```txt
products
orders
```

The backend will read and write from MongoDB.

Angular will continue talking to the backend API.

---

# 2. Why Do We Need a Database?

A database is used to store data permanently.

Without a database:

```txt
Restart backend → orders disappear
```

With a database:

```txt
Restart backend → orders are still there
```

A real store needs persistent data.

Products, orders, customers, inventory, and history cannot disappear every time the server restarts.

---

# 3. Stage 12 Main Goal

By the end of Stage 12:

- products will come from MongoDB
- orders will be saved in MongoDB
- backend routes will use database models
- Angular will keep using the same API URLs
- students will understand why databases matter

The important idea:

> Angular should not talk directly to the database.  
> Angular talks to the backend.  
> The backend talks to the database.

---

# 4. Stage 12 Learning Goals

Students should understand:

- what a database is
- why in-memory arrays are temporary
- what MongoDB is
- what Mongoose is
- what a schema is
- what a model is
- how Express connects to MongoDB
- how backend routes use database models
- how products are fetched from the database
- how orders are saved to the database
- why Angular code changes very little

---

# 5. Stage 11 vs Stage 12

## Stage 11

Backend data was stored in memory.

```txt
Express server
├── products array
└── orders array
```

Problem:

```txt
Restart server → data disappears
```

---

## Stage 12

Backend data is stored in MongoDB.

```txt
Express server
        ↓
MongoDB database
├── products collection
└── orders collection
```

Benefit:

```txt
Restart server → data remains
```

---

# 6. Big Picture Architecture

The full project now looks like this:

```txt
Angular Frontend
        ↓ HTTP
Express Backend API
        ↓ Mongoose
MongoDB Database
```

Each layer has a job.

## Angular

```txt
Displays the app
Collects user input
Calls backend API
Shows loading/error/success states
```

## Express

```txt
Receives API requests
Runs backend logic
Talks to database
Returns responses
```

## MongoDB

```txt
Stores products and orders permanently
```

---

# 7. Important Rule

Do not connect Angular directly to MongoDB.

That would be wrong for this kind of app.

Correct:

```txt
Angular → Express → MongoDB
```

Wrong:

```txt
Angular → MongoDB
```

The backend protects the database and controls what the frontend is allowed to do.

---

# 8. What Is MongoDB?

MongoDB is a NoSQL database.

It stores data as documents.

A product document can look like this:

```json
{
  "_id": "abc123",
  "name": "Wireless Headphones",
  "category": "Audio",
  "price": 99,
  "stock": 5
}
```

This looks very similar to JavaScript objects.

That is one reason MongoDB is beginner-friendly for JavaScript projects.

---

# 9. What Is Mongoose?

Mongoose is a library that helps Node.js work with MongoDB.

Without Mongoose, we would write lower-level MongoDB code.

With Mongoose, we can define schemas and models.

Example:

```js
const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});
```

Mongoose helps us structure our data.

---

# 10. What Is a Schema?

A schema describes what a document should look like.

Example:

```txt
A product should have:
- name
- category
- price
- stock
- imageUrl
```

The schema is like a blueprint.

---

# 11. What Is a Model?

A model is the tool we use to work with a collection.

Example:

```js
Product.find()
```

means:

```txt
Find products from the products collection.
```

Example:

```js
Order.create(orderData)
```

means:

```txt
Create a new order in the orders collection.
```

---

# 12. Step 1 — Install MongoDB Tools

There are two common options.

## Option A — MongoDB Atlas

MongoDB Atlas is cloud-hosted MongoDB.

Good for:

```txt
students who do not want to install MongoDB locally
```

## Option B — Local MongoDB

Install MongoDB on your machine.

Good for:

```txt
local development
offline practice
```

For class, MongoDB Atlas is often easier because students only need a connection string.

---

# 13. Step 2 — Install Mongoose in Backend

Go to the backend folder.

```bash
cd backend-api
```

Install Mongoose:

```bash
npm install mongoose
```

Mongoose will allow Express to connect to MongoDB.

---

# 14. Step 3 — Create a `.env` File

We do not want to hardcode the database connection string directly inside `server.js`.

Create:

```txt
backend-api/.env
```

Add:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/mini-tech-store
PORT=3000
```

If using MongoDB Atlas, the URI will look different.

Example:

```env
MONGODB_URI=mongodb+srv://username:password@clustername.mongodb.net/mini-tech-store
PORT=3000
```

---

# 15. Why Use `.env`?

`.env` stores environment variables.

These are settings that may change between machines.

Examples:

```txt
database connection string
port number
secret keys later
```

Important:

> Do not push real passwords to GitHub.

For real projects, add `.env` to `.gitignore`.

---

# 16. Step 4 — Install dotenv

Install dotenv:

```bash
npm install dotenv
```

`dotenv` lets Node read values from the `.env` file.

---

# 17. Step 5 — Update `server.js` Imports

Open:

```txt
backend-api/server.js
```

At the top, update imports:

```js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
```

## Why?

```js
require('dotenv').config();
```

loads values from `.env`.

```js
mongoose
```

lets us connect to MongoDB.

---

# 18. Step 6 — Connect Express to MongoDB

Add this near the top of `server.js`, after creating the app:

```js
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });
```

## What this does

```js
mongoose.connect(MONGODB_URI)
```

tries to connect to the database.

If successful:

```txt
Connected to MongoDB
```

If it fails:

```txt
MongoDB connection error
```

---

# 19. Step 7 — Create Models Folder

Inside backend:

```txt
backend-api/
├── models/
│   ├── Product.js
│   └── Order.js
├── server.js
├── package.json
└── .env
```

Create:

```bash
mkdir models
```

---

# 20. Step 8 — Create Product Model

Create:

```txt
backend-api/models/Product.js
```

Add:

```js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  ratingCount: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deliveryText: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
```

---

# 21. Explain Product Schema

This schema says:

```txt
A product must have:
- id
- name
- category
- price
- stock
- rating
- ratingCount
- imageUrl
- description
- deliveryText
```

If a required field is missing, Mongoose can reject the document.

This is basic data protection.

---

# 22. Step 9 — Create Order Model

Create:

```txt
backend-api/models/Order.js
```

Add:

```js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  price: Number,
  quantity: Number,
  stock: Number,
  imageUrl: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
```

---

# 23. Explain Order Schema

An order has:

```txt
customer
items
total
createdAt
updatedAt
```

The `timestamps: true` option automatically adds:

```txt
createdAt
updatedAt
```

This is useful because orders should have dates.

---

# 24. Step 10 — Import Models in `server.js`

Open:

```txt
server.js
```

Add:

```js
const Product = require('./models/Product');
const Order = require('./models/Order');
```

Now the server can use:

```js
Product.find()
Order.create()
```

---

# 25. Step 11 — Replace In-Memory Products Route

In Stage 11, you had:

```js
app.get('/api/products', (req, res) => {
  res.json(products);
});
```

Replace it with:

```js
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Could not load products.'
    });
  }
});
```

## Why async/await?

Database operations take time.

So we use:

```js
async
await
```

to wait for MongoDB to respond.

---

# 26. Step 12 — Replace Order POST Route

In Stage 11, orders were saved to an array.

```js
orders.push(newOrder);
```

Now we save to MongoDB.

Replace the `POST /api/orders` route with:

```js
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;

    if (!order || !order.customer || !order.items || order.items.length === 0) {
      return res.status(400).json({
        message: 'Invalid order. Customer and cart items are required.'
      });
    }

    const newOrder = await Order.create({
      customer: order.customer,
      items: order.items,
      total: order.total
    });

    res.status(201).json({
      message: 'Order created successfully.',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({
      message: 'Could not create order.'
    });
  }
});
```

---

# 27. Step 13 — Replace Orders GET Route

In Stage 11:

```js
app.get('/api/orders', (req, res) => {
  res.json(orders);
});
```

Replace it with:

```js
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Could not load orders.'
    });
  }
});
```

This allows us to test stored orders in the browser.

---

# 28. Step 14 — Full Updated `server.js`

Use this complete version if you want a clean final file.

```js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Could not load products.'
    });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;

    if (!order || !order.customer || !order.items || order.items.length === 0) {
      return res.status(400).json({
        message: 'Invalid order. Customer and cart items are required.'
      });
    }

    const newOrder = await Order.create({
      customer: order.customer,
      items: order.items,
      total: order.total
    });

    res.status(201).json({
      message: 'Order created successfully.',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({
      message: 'Could not create order.'
    });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Could not load orders.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
});
```

---

# 29. Important Problem: Products Collection Is Empty

After switching to MongoDB, this route:

```txt
GET /api/products
```

will read from the database.

But the database may not have products yet.

So we need to seed the database.

---

# 30. What Is Seeding?

Seeding means adding starter data to the database.

For this app, we need starter products.

Instead of manually adding products one by one, we create a script.

---

# 31. Step 15 — Create Seed File

Create:

```txt
backend-api/seed-products.js
```

Add:

```js
require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('./models/Product');

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

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log('Products seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedProducts();
```

---

# 32. Step 16 — Add Seed Script

Open:

```txt
package.json
```

Update scripts:

```json
"scripts": {
  "start": "node server.js",
  "seed": "node seed-products.js"
}
```

Now run:

```bash
npm run seed
```

Expected:

```txt
Products seeded successfully.
```

---

# 33. Step 17 — Test Products from Database

Start backend:

```bash
npm start
```

Open:

```txt
http://localhost:3000/api/products
```

Expected:

```txt
Product list appears from MongoDB.
```

If the list is empty, run:

```bash
npm run seed
```

again.

---

# 34. Step 18 — Test Angular

Start Angular:

```bash
ng serve
```

Open:

```txt
http://localhost:4200/products
```

Expected:

```txt
Products appear.
```

Angular does not need much change because it already calls:

```txt
http://localhost:3000/api/products
```

That is good architecture.

---

# 35. Step 19 — Test Order Storage

1. Add products to cart.
2. Go to checkout.
3. Fill the form.
4. Submit the order.
5. Open:

```txt
http://localhost:3000/api/orders
```

Expected:

```txt
The order appears from MongoDB.
```

Now restart the backend and open the same endpoint again.

Expected:

```txt
The order is still there.
```

That proves database persistence works.

---

# 36. Stage 12 Data Flow

## Products

```txt
Angular loads products
        ↓
GET /api/products
        ↓
Express route runs
        ↓
Product.find()
        ↓
MongoDB returns products
        ↓
Express sends JSON
        ↓
Angular updates products signal
        ↓
UI updates
```

## Orders

```txt
User submits checkout
        ↓
Angular sends POST /api/orders
        ↓
Express validates request
        ↓
Order.create()
        ↓
MongoDB stores order
        ↓
Express returns success
        ↓
Angular shows confirmation
        ↓
Cart clears
```

---

# 37. What Changed in Angular?

Very little.

That is the key lesson.

Because Angular already talked to the backend API in Stage 11, Stage 12 mostly changes the backend.

Angular keeps calling:

```txt
GET /api/products
POST /api/orders
```

It does not care whether the backend uses:

```txt
arrays
JSON file
MongoDB
SQL database
```

as long as the API response shape stays consistent.

This is the power of API design.

---

# 38. Important Concept: API Contract

An API contract means:

```txt
Frontend expects a certain request and response shape.
Backend agrees to provide that shape.
```

Example:

Angular expects products to have:

```txt
id
name
category
price
stock
rating
imageUrl
description
deliveryText
```

If backend changes those names, Angular may break.

So frontend and backend must agree.

---

# 39. Common Errors and Fixes

## Error: MongoDB connection error

Check:

```txt
MONGODB_URI
```

Make sure MongoDB is running or Atlas connection string is correct.

---

## Error: Cannot find module mongoose

Run:

```bash
npm install mongoose
```

---

## Error: Cannot find module dotenv

Run:

```bash
npm install dotenv
```

---

## Error: Products endpoint returns empty array

Run:

```bash
npm run seed
```

---

## Error: Duplicate key error while seeding

This can happen because product `id` is unique.

The seed script already does:

```js
await Product.deleteMany({});
```

Make sure that line exists before:

```js
await Product.insertMany(products);
```

---

## Error: Angular shows productsError

Check backend is running:

```txt
http://localhost:3000/api/products
```

If backend is down, Angular cannot load products.

---

## Error: Order not saving

Check:

- backend terminal errors
- MongoDB connection
- `Order` model import
- `app.use(express.json())`
- Angular POST URL

---

# 40. Classroom Checkpoints

Use these checkpoints in class.

## Checkpoint 1

Install Mongoose and dotenv.

## Checkpoint 2

Create `.env`.

## Checkpoint 3

Connect backend to MongoDB.

## Checkpoint 4

Create Product model.

## Checkpoint 5

Create Order model.

## Checkpoint 6

Update product route to use `Product.find()`.

## Checkpoint 7

Create seed script.

## Checkpoint 8

Run seed script and confirm products exist.

## Checkpoint 9

Submit order and confirm it exists after server restart.

---

# 41. What Students Should Be Able to Explain

At the end of Stage 12, students should explain:

- why in-memory arrays are not enough
- what MongoDB does
- what Mongoose does
- what a schema is
- what a model is
- what seeding means
- why Angular does not talk directly to MongoDB
- why backend routes use models
- why orders survive server restarts
- what an API contract is

---

# 42. Teacher Explanation Script

Use this in class:

> In Stage 11, we created a backend API, but the backend still stored products and orders in temporary arrays.  
> That means the data disappeared when the server restarted.  
> In Stage 12, we add MongoDB.  
> Now products and orders live in a database.  
> Angular still calls the same backend API, but the backend now gets and saves data permanently.

---

# 43. Brutal Mentor Warning

Do not let students think MongoDB replaces the backend.

It does not.

MongoDB is the database.

Express is still the backend.

Angular should not skip Express and talk directly to MongoDB.

The correct architecture is:

```txt
Angular → Express → MongoDB
```

Not:

```txt
Angular → MongoDB
```

---

# 44. What Stage 12 Should Not Do Yet

Do not add:

```txt
login
JWT
passwords
payment processing
admin dashboard
deployment
role-based access
```

Stage 12 is about:

```txt
database persistence
```

Keep it focused.

---

# 45. What Comes Next?

After Stage 12, strong next stages are:

## Stage 13 — Order History Page

Show submitted orders in Angular.

Route:

```txt
/orders
```

Backend:

```txt
GET /api/orders
```

## Stage 14 — Admin Product Management

Add:

```txt
create product
edit product
delete product
update stock
```

## Stage 15 — Authentication

Add:

```txt
login
register
protected routes
user-specific orders
```

---

# 46. Final Summary

Stage 12 moves the project from:

```txt
backend with temporary arrays
```

to:

```txt
backend with a real database
```

The key tools are:

```txt
MongoDB
Mongoose
schemas
models
seed script
async/await
database persistence
```

The biggest mindset shift is:

> A backend without a database can receive data.  
> A backend with a database can remember data.

This is a major full-stack milestone.

