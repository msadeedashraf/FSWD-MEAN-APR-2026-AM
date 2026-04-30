import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

type NavLink = {

  label: string;
  href: string;
}

type Product = {
id : number;
name: string;
 category: string;
  price: number;
  stock: number;
  rating: string;

}

type CartItem = {

  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;

}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LowerCasePipe, CurrencyPipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('online-store-v1');

  storeName = 'flipZila';
  location = 'Delivery to London';


heroTitle = 'Tech Essentials for Everyday Use';

heroText= 'Browse featured products, compare prices, and build your order.';

summaryItems = 5;
summaryTotal = 1100;

  navLinks: NavLink[] = [

    {label:'All', href:'#'},
    { label: "Today's Deals", href: '#' },
    { label: 'Audio', href: '#products' },
    { label: 'Accessories', href: '#products' },
    { label: 'Monitors', href: '#products' },
    { label: 'Cameras', href: '#products' },
     { label: 'Best Sellers', href: '#products' }
  ];


  products = signal< Product[]>([

    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Audio',
      price: 99,
      stock: 5,
      rating: '★★★★☆'
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      price: 75,
      stock: 5,
      rating: '★★★★★'
    },
    {
      id: 3,
      name: 'Gaming Mouse',
      category: 'Accessories',
      price: 40,
      stock: 5,
      rating: '★★★★☆'
    },
    {
      id: 4,
      name: '24" Monitor',
      category: 'Displays',
      price: 220,
      stock: 4,
      rating: '★★★★☆'
    },
    {
      id: 5,
      name: 'HD Webcam',
      category: 'Cameras',
      price: 60,
      stock: 5,
      rating: '★★★★☆'
    }
    ,
    {
      id: 6,
      name: 'Bluetooth Speaker',
      category: 'Audio',
      price: 120,
      stock: 6,
      rating: '★★★★☆'
    }
  ]);

  searchText = signal('');
  cart = signal<CartItem[]>([]);

  orderPlaced= signal(false);
  orderMessage = signal('');

filteredProducts = computed(() => {
    const term = this.searchText().toLowerCase().trim();

    if (!term) {
      return this.products();
    }

    return this.products().filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  });




addToCart(product: Product) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items => {
      const existingItem = items.find(item => item.id === product.id);

      if (!existingItem) {
        return [
          ...items,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: 1,
            stock: product.stock
          }
        ];
      }

      return items.map(item =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity < item.stock ? item.quantity + 1 : item.quantity
            }
          : item
      );
    });
  }


  increaseQuantity(itemId: number){

  }
  decreaseQuantity(itemId: number) {

  }
  removeFromCart(itemId: number) {
    
  }
}
