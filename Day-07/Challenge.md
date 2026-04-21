# Mini Project: Online Store Cart Manager

## Objective

In this mini project, you will build a small Angular app that uses:

- `signal()` to store state
- `set()` to assign a new value
- `update()` to change an existing value
- `()` to read a signal value
- `@if / @else if / @else` to control the UI

This project helps you connect **state management** with **real UI behavior**.

---

## Real-World Scenario

You are building a simple shopping cart for an online store.

The store sells **Headphones**.

Your app should allow a user to:

- add items to the cart
- remove items from the cart
- clear the cart
- see different messages depending on cart state

---

## What You Will Practice

By the end of this challenge, you should be able to:

- create and use signals
- update state safely
- prevent invalid values
- control what appears on screen using conditional UI
- connect user actions to app behavior

---

## Project Requirements

Build an app with the following rules:

1. The cart starts with `0` items
2. The maximum stock is `5`
3. The user can click:
   - **Add Item**
   - **Remove Item**
   - **Clear Cart**
4. The quantity must never go below `0`
5. The quantity must never go above `5`
6. Show different messages depending on the cart quantity
7. Disable buttons when an action is not allowed

---

## UI Rules

### When quantity is `0`
Show:
`Your cart is empty`

### When quantity is between `1` and `4`
Show:
`You have items in your cart`

### When quantity is `5`
Show:
`Stock limit reached`

---

