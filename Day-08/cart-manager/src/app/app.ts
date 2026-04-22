import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { sign } from 'node:crypto';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cart-manager');

  product = signal('Headphones')

  itemQty = signal(0)

  maxStock = signal(5)

  itemPrice = signal(50)

/*
userDetails = signal({
                      name: "Sadeed",
                      email: "sadeed@sadeed.ca",
                      isloggedIn: false
                    });
*/
  AddItem()
  {
    this.itemQty.update(i => i + 1)
  }

  RemoveItem()
  {
    this.itemQty.update(i => i - 1)
  }

  ClearItem()
  {
    this.itemQty.set(0)
  }


}
