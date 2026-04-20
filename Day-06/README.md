Signal = data
set() = assigns the new value
update() = modify the existing value
() = read value


## Challenge

Goal

Create a mini profile card where the student can:

- show a name
- change the name to Chris
- change the name to Sara
- reset the name back to Guest
- What they should practice
- using set() to assign completely new values
reading the signal with ()

```

import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-name-changer',
  standalone: true,
  template: `
    <h2>Name Challenge</h2>
    <p>Current Name: {{ username() }}</p>

    <button (click)="changeToChris()">Chris</button>
    <button (click)="changeToSara()">Sara</button>
    <button (click)="resetName()">Reset</button>
  `
})
export class NameChangerComponent {
  username = signal('Guest');

  changeToChris() {
    // use set()
  }

  changeToSara() {
    // use set()
  }

  resetName() {
    // use set()
  }
}

```


Shopping Cart Quantity

Goal

Create a product quantity selector.

Display:

- product name
- quantity
- buttons to add/remove items
- button to clear cart

```
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  template: `
    <h2>Shopping Cart Challenge</h2>
    <p>Product: Laptop</p>
    <p>Quantity: {{ quantity() }}</p>

    <button (click)="addOne()">Add 1</button>
    <button (click)="removeOne()">Remove 1</button>
    <button (click)="clearCart()">Clear Cart</button>
  `
})
export class CartComponent {
  quantity = signal(1);

  addOne() {
    // use update()
  }

  removeOne() {
    // use update()
  }

  clearCart() {
    // use set()
  }
}
```