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


  products = signal<Product[]>([
{id : 1, name : 'Headphones', price: 105, stock:9 },
{ id: 2, name: 'Keyboard', price: 75, stock: 4 },
{ id: 3, name: 'Mouse', price: 40, stock: 6 },
{ id: 4, name: 'Monitor', price: 220, stock: 3 },
{ id: 5, name: 'Webcam', price: 60, stock: 7 },
{ id: 6, name: 'Samsung TV', price: 900, stock: 5 }
]);

searchText = signal('');

filteredProduct = computed(

() => {
  const term = this.searchText().toLowerCase().trim();
  if (!term) return this.products();
  return this.products().filter(
    product => product.name.toLowerCase().includes(term)

  );

});





}
