import { Injectable, computed, signal } from '@angular/core';
import { CartItem, FooterColumn, NavLink, Product } from '../models/store.models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  /*
    Basic store information.
    These are simple values because they do not currently change.
  */
  storeName = 'Mini Tech Store';
  location = 'Deliver to Hamilton';

  /*
    Hero content.
  */
  heroTitle = 'Tech Essentials for Everyday Use';
  heroText = 'Browse featured products, compare prices, and build your order.';

  /*
    Categories used by the search/category filter in the navbar.
  */
  categories = ['All', 'Audio', 'Accessories', 'Displays', 'Cameras'];

  /*
    Navigation links shown in the navbar.
  */
  navLinks: NavLink[] = [
    { label: 'All', href: '#products' },
    { label: "Today's Deals", href: '#products' },
    { label: 'Audio', href: '#products' },
    { label: 'Accessories', href: '#products' },
    { label: 'Monitors', href: '#products' },
    { label: 'Cameras', href: '#products' },
    { label: 'Best Sellers', href: '#products' }
  ];

  /*
    Footer data.
  */
  footerColumns: FooterColumn[] = [
    { title: 'Get to Know Us', links: ['About', 'Careers', 'Blog', 'Store Info'] },
    { title: 'Shop With Us', links: ['Audio', 'Accessories', 'Displays', 'Cameras'] },
    { title: 'Support', links: ['Your Account', 'Orders', 'Returns', 'Help Center'] },
    { title: 'Teaching Demo', links: ['Angular Services', 'Shared State', 'Signals', 'Dependency Injection'] }
  ];

  /*
    Signals hold values that can change over time.
  */
  selectedCategory = signal('All');
  searchText = signal('');
  cart = signal<CartItem[]>([]);
  orderPlaced = signal(false);
  orderMessage = signal('');

  /*
    Product data is also stored as a signal.
    This keeps the service reactive.
  */
  products = signal<Product[]>([
    { id: 1, name: 'Wireless Headphones', category: 'Audio', price: 99, stock: 5, rating: '★★★★☆' },
    { id: 2, name: 'Mechanical Keyboard', category: 'Accessories', price: 75, stock: 4, rating: '★★★★★' },
    { id: 3, name: 'Gaming Mouse', category: 'Accessories', price: 40, stock: 6, rating: '★★★★☆' },
    { id: 4, name: '24" Monitor', category: 'Displays', price: 220, stock: 3, rating: '★★★★☆' },
    { id: 5, name: 'HD Webcam', category: 'Cameras', price: 60, stock: 7, rating: '★★★★☆' },
    { id: 6, name: 'Bluetooth Speaker', category: 'Audio', price: 120, stock: 2, rating: '★★★★☆' }
  ]);

  /*
    filteredProducts is computed from:
    - products
    - searchText
    - selectedCategory

    When searchText or selectedCategory changes,
    Angular recalculates this automatically.
  */
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

  /*
    totalItems is derived from cart.
    We do not manually store this as a separate number.
  */
  totalItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  /*
    cartTotal is also derived from cart.
  */
  cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  /*
    Updates the search text signal.
    Called by the navbar.
  */
  updateSearchText(value: string) {
    this.searchText.set(value);
  }

  /*
    Updates the selected category signal.
    Called by the navbar.
  */
  updateSelectedCategory(value: string) {
    this.selectedCategory.set(value);
  }

  /*
    Returns how many of a product are already in the cart.
  */
  cartQuantityForProduct(productId: number) {
    const item = this.cart().find(cartItem => cartItem.id === productId);
    return item ? item.quantity : 0;
  }

  /*
    Returns true if the cart already contains the maximum allowed stock.
  */
  isProductMaxed(product: Product) {
    return this.cartQuantityForProduct(product.id) >= product.stock;
  }

  /*
    Adds a product to the cart.

    If the product is not already in the cart:
    - add it with quantity 1

    If it already exists:
    - increase the quantity
    - but never go above stock
  */
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

  /*
    Increases quantity for one cart item.
  */
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

  /*
    Decreases quantity for one cart item.

    If the quantity becomes 0, the item is removed from the cart.
  */
  decreaseQuantity(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items =>
      items
        .map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  /*
    Removes one item from the cart.
  */
  removeFromCart(itemId: number) {
    this.orderPlaced.set(false);
    this.orderMessage.set('');

    this.cart.update(items => items.filter(item => item.id !== itemId));
  }

  /*
    Clears the entire cart.
  */
  clearCart() {
    this.cart.set([]);
    this.orderPlaced.set(false);
    this.orderMessage.set('');
  }

  /*
    Simulates placing an order.
  */
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