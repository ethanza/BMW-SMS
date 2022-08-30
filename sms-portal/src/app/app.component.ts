import { Component, ViewEncapsulation } from '@angular/core';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'sms-portal';
}
