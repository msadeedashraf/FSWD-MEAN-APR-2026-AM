import { Component, signal } from '@angular/core';
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
  stockText: string;
  rating: string;

}


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LowerCasePipe, CurrencyPipe],
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


  products : Product[] = [

    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Audio',
      price: 99,
      stockText: 'In Stock',
      rating: '★★★★☆'
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      price: 75,
      stockText: 'In Stock',
      rating: '★★★★★'
    },
    {
      id: 3,
      name: 'Gaming Mouse',
      category: 'Accessories',
      price: 40,
      stockText: 'In Stock',
      rating: '★★★★☆'
    },
    {
      id: 4,
      name: '24" Monitor',
      category: 'Displays',
      price: 220,
      stockText: 'Limited Stock',
      rating: '★★★★☆'
    },
    {
      id: 5,
      name: 'HD Webcam',
      category: 'Cameras',
      price: 60,
      stockText: 'In Stock',
      rating: '★★★★☆'
    },
    {
      id: 6,
      name: 'Bluetooth Speaker',
      category: 'Audio',
      price: 120,
      stockText: 'Only 2 Left',
      rating: '★★★★☆'
    }
  ]

cartPreview = [

  { name: 'Wireless Headphones', details: '$99.00 x 1', total: '$99.00' },
    { name: 'Gaming Mouse', details: '$40.00 x 2', total: '$80.00' },
    { name: 'HD Webcam', details: '$35.00 x 1', total: '$35.00' }
]

}
