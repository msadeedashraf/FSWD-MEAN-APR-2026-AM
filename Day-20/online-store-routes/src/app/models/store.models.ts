/*
  Product describes one item in the store.
*/
export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;
};

/*
  CartItem describes a product after it is added to the cart.

  It includes quantity because the cart needs to know
  how many units of the product were added.
*/
export type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;
};

/*
  NavLink describes one navigation link in the navbar.
*/
export type NavLink = {
  label: string;
  href: string;
};

/*
  FooterColumn describes one section in the footer.
*/
export type FooterColumn = {
  title: string;
  links: string[];
};