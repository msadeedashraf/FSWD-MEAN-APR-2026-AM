import { Component, inject } from '@angular/core';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  /*
    Footer reads store name and footer columns from service.
  */
  store = inject(StoreService);
}