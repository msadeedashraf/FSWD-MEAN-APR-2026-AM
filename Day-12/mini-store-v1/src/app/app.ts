import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { sign } from 'node:crypto';


type Product = {
id: number;
name: string;
price: number;
stock : number;
}

type CartItems = {
  id : number;
  name: string;
  price: number;
  quantity: number;
  stock : number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mini-store-v1');
searchText = signal('');
orderPlaced  = signal(false);
orderMessage = signal('');

  products = signal<Product[]>([
{id : 1, name : 'Headphones', price: 105, stock:9 },
{ id: 2, name: 'Keyboard', price: 75, stock: 4 },
{ id: 3, name: 'Mouse', price: 40, stock: 6 },
{ id: 4, name: 'Monitor', price: 220, stock: 3 },
{ id: 5, name: 'Webcam', price: 60, stock: 7 },
{ id: 6, name: 'Samsung TV', price: 900, stock: 5 }
]);



filteredProduct = computed(

() => {
  const term = this.searchText().toLowerCase().trim();
  if (!term) return this.products();
  return this.products().filter(
    product => product.name.toLowerCase().includes(term)

  );

});


cart =  signal<CartItems[]>([]);

addToCart(product : Product)
{

  this.orderPlaced.set(false);
  this.orderMessage.set('');

  this.cart.update(items => {
    
    const existing = items.find( item => item.id === product.id)



      if(!existing)
      {
        return [

    
      ...items, 
        { 
          id : product.id,
          name : product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock

      }

    ];

      }

    return items.map(item => item.id === product.id ? {
      ...item,
      quantity: item.quantity <item.stock ? item.quantity+1 : item.quantity

    }  : item);
    
 

  }  );
}


increaseQuantity(producId :number)
{

  this.cart.update(
items => items.map(item => item.id === producId ? {
      ...item,
      quantity: item.quantity <item.stock ? item.quantity+1 : item.quantity

    }  : item)

  )

}


/*
decreaseQuantity(producId :number)
{

  this.cart.update(
items => items.map(item => item.id === producId ? {
      ...item,
      quantity: item.quantity <item.stock ? item.quantity-1 : item.quantity

    }  : item).filter(item => item.quantity > 0)


  )

}
*/
decreaseQuantity(productId: number) {
  this.cart.update(items =>
    items
      .map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0)
  );
}

removeFromCart(producId: number) {

this.cart.update(items => items.filter( item => item.id !== producId));
}

/*
totalItems()
{

  return 1

}
*/

totalItems = computed( ()=> { 
  
  return this.cart().reduce(
    (sum, item) => sum + item.quantity, 0);

})

cartTotal = computed( ()=> { 
  return this.cart().reduce(
    (total, item) => { return total + item.price * item.quantity;} , 0);
})

placeOrder()
{
  if(this.cart().length === 0)
  {
    this.orderPlaced.set(false);
    this.orderMessage.set('Your Cart is empty. Add products before placing the orders');
    return;
   }

   this.orderPlaced.set(true);
   this.orderMessage.set('Order placed successfully');
}

clearCart()
{
  this.cart.set([]);
  this.orderPlaced.set(false);
  this.orderMessage.set('');
  
}


}
