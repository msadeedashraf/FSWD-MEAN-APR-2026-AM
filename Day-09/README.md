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
