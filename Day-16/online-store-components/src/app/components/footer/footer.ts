import { Component, Input } from '@angular/core';
import { FooterColumn } from '../../app';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

 @Input() storeName = '';
 @Input() footerColumns: FooterColumn[] = [];

}


