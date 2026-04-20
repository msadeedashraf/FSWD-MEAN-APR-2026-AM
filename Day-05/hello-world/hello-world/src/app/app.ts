import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Our First Angular Project');

  teacher = signal("Sadeed")
  courses  = signal('Linux')

  changeTitle(){
    this.title.set('This is title change');
  }

}
