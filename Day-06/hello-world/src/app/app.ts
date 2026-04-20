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

  teacher = signal("Sadeed");
  courses  = signal('Linux');
  count = signal(0);

  changeTitle(){
    this.title.set('This is title change');
  }

  increase()
  {
    this.count.update(c => c +1);
  }

}
