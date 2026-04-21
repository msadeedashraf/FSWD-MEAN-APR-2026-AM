import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',  
  templateUrl:'./app.html',  
  styleUrl: './app.css'
})
export class App {
  //protected readonly title = signal('Our First Angular Project');

  //First Challenge

   username = signal('Guest');

  changeToChris() {
    // use set()
    this.username.set('Chris');
  }

  changeToSara() {
    // use set()
    this.username.set('Sara')
  }

  resetName() {
    // use set()
    this.username.set('Guest')
  }
  
  /*
  quantity = signal(1);

  addOne() {
    // use update()
    this.quantity.update(q => q + 1);

  }

  removeOne() {
    // use update()
    this.quantity.update(q => q - 1);
  }

  clearCart() {
    // use set()
    this.quantity.set(0);

  }
*/
}
