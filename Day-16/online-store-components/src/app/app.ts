import { Component, computed, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { ProductList } from './components/product-list/product-list';
import { CartSummary } from './components/cart-summary/cart-summary';
import { Footer } from './components/footer/footer';

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;
};

export type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;
};

export type NavLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: string[];
};

@Component({
  selector: 'app-root',
  imports: [Navbar, Hero, Footer, ProductList, CartSummary],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  storeName = 'Mini Tech Store';
  location = 'Deliver to Hamilton';

  heroTitle = 'Tech Essentials for Everyday Use';
  heroText = 'Browse featured products, compare prices, and build your order.';

  navLinks: NavLink[] = [
    { label: 'All', href: '#products' },
    { label: "Today's Deals", href: '#products' },
    { label: 'Audio', href: '#products' },
    { label: 'Accessories', href: '#products' },
    { label: 'Monitors', href: '#products' },
    { label: 'Cameras', href: '#products' },
    { label: 'Best Sellers', href: '#products' }
  ];

  footerColumns: FooterColumn[] = [
    { title: 'Get to Know Us', links: ['About', 'Careers', 'Blog', 'Store Info'] },
    { title: 'Shop With Us', links: ['Audio', 'Accessories', 'Displays', 'Cameras'] },
    { title: 'Support', links: ['Your Account', 'Orders', 'Returns', 'Help Center'] },
    { title: 'Teaching Demo', links: ['Angular Components', 'Inputs', 'Outputs', 'Signals'] }
  ];

  categories = ['All', 'Audio', 'Accessories', 'Displays', 'Cameras'];

  selectedCategory = signal('All');
  searchText = signal('');
  cart = signal<CartItem[]>([]);
  orderPlaced = signal(false);
  orderMessage = signal('');

  products = signal<Product[]>([
    { id: 1, name: 'Wireless Headphones', category: 'Audio', price: 99, stock: 5, rating: '★★★★☆' },
    { id: 2, name: 'Mechanical Keyboard', category: 'Accessories', price: 75, stock: 4, rating: '★★★★★' },
    { id: 3, name: 'Gaming Mouse', category: 'Accessories', price: 40, stock: 6, rating: '★★★★☆' },
    { id: 4, name: '24" Monitor', category: 'Displays', price: 220, stock: 3, rating: '★★★★☆' },
    { id: 5, name: 'HD Webcam', category: 'Cameras', price: 60, stock: 7, rating: '★★★★☆' },
    { id: 6, name: 'Bluetooth Speaker', category: 'Audio', price: 120, stock: 2, rating: '★★★★☆' }
  ]);

  filteredProducts = computed(() => {
    const term = this.searchText().toLowerCase().trim();
    const category = this.selectedCategory();

    return this.products().filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      const matchesCategory =
        category === 'All' || product.category === category;

      return matchesSearch && matchesCategory;
    });
  });

  totalItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  cartQuantityForProduct(productId: number) {
    const item = this.cart().find(cartItem => cartItem.id === productId);
    return item ? item.quantity : 0;
  }

  isProductMaxed(product: Product) {
    return this.cartQuantityForProduct(product.id) >= product.stock;
  }

  updateSearchText(value: string) {
    this.searchText.set(value);
  }

  updateSelectedCategory(value: string) {
    this.selectedCategory.set(value);
  }

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

  increaseQuantity(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items =>
      items.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity < item.stock ? item.quantity + 1 : item.quantity
            }
          : item
      )
    );
  }

  decreaseQuantity(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items =>
      items
        .map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  removeFromCart(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');
    this.cart.update(items => items.filter(item => item.id !== itemId));
  }

  clearCart() {
    this.cart.set([]);
    this.orderPlaced.set(false);
    this.orderMessage.set('');
  }

  placeOrder() {
    if (this.cart().length === 0) {
      this.orderPlaced.set(false);
      this.orderMessage.set('Your cart is empty. Please add products before placing the order.');
      return;
    }

    this.orderPlaced.set(true);
    this.orderMessage.set('Order placed successfully!');
  }
}