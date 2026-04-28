- app.html
```
<h1>MiniStore</h1>
<h2>Search Products</h2>
<input type="text">
<h2>Avaialable Products</h2>

<div>
  <h3>Headphones</h3>
  <p>Price: $99.00</p>
  <p>Stock: 5</p>
  <button>Add to cart</button>
</div>

<div>
  <h3>Headphones</h3>
  <p>Price: $99.00</p>
  <p>Stock: 5</p>
  <button>Add to cart</button>
</div>
<div>
  <h3>Headphones</h3>
  <p>Price: $99.00</p>
  <p>Stock: 5</p>
  <button>Add to cart</button>
</div>
<div>
  <h3>Headphones</h3>
  <p>Price: $99.00</p>
  <p>Stock: 5</p>
  <button>Add to cart</button>
</div>


<hr>

<h2>Your Cart</h2>

<div>
  <h3>Webcam</h3>
   <p>Price: $60.00</p> 
   <p>Quantity: 1</p>
   <p>Subtotal: $60.00</p>
   <button>+</button>
   <button>-</button>
   <button>Remove</button>
</div>

<hr>

<h2>Order Summary</h2>
<p>Total Items: 1</p>
<p>Total Cost: $60.00</p>
<button>Place Order</button>
<button>Clear the Cart</button>

<p>Review your cart before placing the order.</p>
```
- aap.ts
```
type Product = {
id: number;
name: string;
price: number;
stock : number;
}

type cartItems = {
  id : number;
  name: string;
  price: number;
  quantity: number;
  stock : number;
}

export class App {
  protected readonly title = signal('mini-store-v1');
product = signal<Product[]>([
{id : 1, name : 'Headphones', price: 99, stock:5 },
{ id: 2, name: 'Keyboard', price: 75, stock: 4 },
{ id: 3, name: 'Mouse', price: 40, stock: 6 },
{ id: 4, name: 'Monitor', price: 220, stock: 3 },
{ id: 5, name: 'Webcam', price: 60, stock: 7 }

])

}

```

- To diplay one product for testing
```
<div>
  <h3>{{products()[0].name}}</h3>
  <p>Price: {{products()[0].price}}</p>
  <p>Stock: {{products()[0].stock}}</p>
  <button>Add to cart</button>
</div>
```

- To display all the products on the UI from the array
```
@for(product of products(); track product.id )
{
  <div>
    <h3>{{product.name}}</h3>
    <p>Price: {{product.price}}</p>
    <p>Stock: {{product.stock}}</p>
    <button>Add to cart</button>
  </div>

}
```


```

<input 
  type="text"
  [ngModel] = "searchText()"
  (ngModelChange) = "searchText.set($event)"  
  placeholder="Search for a product"
>

@for(product of filteredProduct(); track product.id )
{
  <div>
    <h3>{{product.name}}</h3>
    <p>Price: {{product.price}}</p>
    <p>Stock: {{product.stock}}</p>
    <button>Add to cart</button>
  </div>

}


```


```
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


searchText = signal('');

filteredProduct = computed(

() => {
  const term = this.searchText().toLowerCase().trim();
  if (!term) return this.products();
  return this.products().filter(
    product => product.name.toLowerCase().includes(term)

  );

});
```

- when no product found
```
@if(filteredProduct().length === 0)
{
<p>No product found.</p>
}
@else
{
  @for(product of filteredProduct(); track product.id )
{
  <div>
    <h3>{{product.name}}</h3>
    <p>Price: {{product.price}}</p>
    <p>Stock: {{product.stock}}</p>
    <button>Add to cart</button>
  </div>

}
```

- Adding items to the cart

app.ts
```
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
```
app.html
```
<h2>Your Cart</h2>


@if (cart().length ===0 )
{

  <p>Your cart is empty</p>
}
@else
{
  @for(item of cart(); track item.id)
  {

    <div>
      <h3>{{item.name}}</h3>
       <p>Price: {{item.price}} </p> 
       <p>Quantity: {{item.quantity}} </p>
       <p>Subtotal: {{item.price*item.quantity}}</p>
       <button >+</button>
       <button>-</button>
       <button>Remove</button>
    </div>
  }



}

```

- Add and Remove function 

app.ts
```
increaseQuantity(producId :number)
{

  this.cart.update(
items => items.map(item => item.id === producId ? {
      ...item,
      quantity: item.quantity <item.stock ? item.quantity+1 : item.quantity

    }  : item)

  )

}

decreaseQuantity(producId :number)
{

  this.cart.update(
items => items.map(item => item.id === producId ? {
      ...item,
      quantity: item.quantity <item.stock ? item.quantity-1 : item.quantity

    }  : item).filter(item => item.quantity > 0)


  )

}
```

app.html
```
@if (cart().length ===0 )
{

  <p>Your cart is empty</p>
}
@else
{
  @for(item of cart(); track item.id)
  {

    <div>
      <h3>{{item.name}}</h3>
       <p>Price: {{item.price}} </p> 
       <p>Quantity: {{item.quantity}} </p>
       <p>Subtotal: {{item.price*item.quantity}}</p>
       <button 
       (click) = "increaseQuantity(item.id)" 
       [disabled] = "item.quantity === item.stock"
       >+</button>
       <button (click) = "decreaseQuantity(item.id)" 
        >-</button>
       <button>Remove</button>
    </div>
  }
```

- Removing the Item from the cart

app.html
```
@if (cart().length ===0 )
{

  <p>Your cart is empty</p>
}
@else
{
  @for(item of cart(); track item.id)
  {

    <div>
      <h3>{{item.name}}</h3>
       <p>Price: {{item.price}} </p> 
       <p>Quantity: {{item.quantity}} </p>
       <p>Subtotal: {{item.price*item.quantity}}</p>
       <button 
       (click) = "increaseQuantity(item.id)" 
       [disabled] = "item.quantity === item.stock"
       >+</button>
       <button (click) = "decreaseQuantity(item.id)" 
        >-</button>
       <button (click)="removeFromCart(item.id)" >Remove</button>
    </div>
  }



}
```

app.ts
```
removeFromCart(producId: number) {

this.cart.update(items => items.filter( item => item.id !== producId));
}
```

- Calulate the Total Cost

app.html
```
<hr>

<h2>Order Summary</h2>
<p>Total Items: 10</p>
<p>Total Cost: {{cartTotal()}}</p>
<button>Place Order</button>
<button>Clear the Cart</button>

<p>Review your cart before placing the order.</p>
```

app.ts
```
cartTotal = computed( ()=> { 
  return this.cart().reduce(
    (total, item) => { return total + item.price * item.quantity;} , 0);
})
```










- Calulate the Total Items

app.html
```
<hr>

<h2>Order Summary</h2>
<p>Total Items: {{totalItems()}}</p>
<p>Total Cost: {{cartTotal()}}</p>
<button>Place Order</button>
<button>Clear the Cart</button>

<p>Review your cart before placing the order.</p>
```

app.ts
```
totalItems = computed( ()=> { 
  
  return this.cart().reduce(
    (sum, item) => sum + item.quantity, 0);

})
```




- PLace order and change the state

app.html
```
<button (click)="placeOrder()" >Place Order</button>
<button>Clear the Cart</button>

<p>{{orderMessage()}}</p>

<p>Review your cart before placing the order.</p>

```

app.ts
```
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

```




- Clear the cart

app.html
```
<button (click)="clearCart()">Clear the Cart</button>

```

app.ts
```
clearCart()
{
  this.cart.set([]);
  this.orderPlaced.set(false);
  this.orderMessage.set('');
  
}
```

- Show order Message

app.html
```
@if( orderMessage())
{
<p>{{orderMessage()}}</p>

}
```

- Show the order status

```
@if( orderPlaced() )
{
  <p>Thank you for your order</p>

}
@else
{


  <p>Review your cart before placing the order.</p>
}

```


State Signals

Computed Signals

Methods