import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavLink } from '../../app';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  @Input() storeName = '';
  @Input() location = '';
  @Input() navLinks: NavLink[] = [];
  @Input() categories: string[] = [];
  @Input() selectedCategory = 'All';
  @Input() searchText = '';
  @Input() totalItems = 0;

  @Output() searchTextChange = new EventEmitter<string>();
  @Output() selectedCategoryChange = new EventEmitter<string>();
}