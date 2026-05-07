import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-navbar',

  /*
    FormsModule is required because navbar uses ngModel.
  */
  imports: [FormsModule],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  /*
    inject(StoreService) gives this component access to the shared store.

    Now the navbar can read:
    - store.storeName
    - store.location
    - store.searchText()
    - store.selectedCategory()
    - store.totalItems()

    And it can call:
    - store.updateSearchText()
    - store.updateSelectedCategory()
  */
  store = inject(StoreService);
}