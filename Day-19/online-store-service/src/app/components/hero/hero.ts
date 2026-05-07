import { Component, inject } from '@angular/core';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  /*
    Hero reads hero text directly from the shared store.
  */
  store = inject(StoreService);
}