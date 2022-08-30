import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  NgForm,
} from '@angular/forms';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from '../services/file-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BulkUploadComponent implements OnInit {
  myForm: any = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });

  public selectedFiles?: FileList;
  public currentFile?: File;
  public progress = 0;
  public message = '';
  public fileInfos?: Observable<any>;

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  public get f() {
    return this.myForm.controls;
  }

  public selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  public upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.fileUploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              console.log('in progress');
            } else if (event instanceof HttpResponse) {
              debugger;
              this.message = event.body.message;
              console.log(this.message);
              if (event.status == 200) {
                this.router.navigate(['/success']);
              }
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;
            this.currentFile = undefined;
          },
        });
      }
    }
    this.selectedFiles = undefined;
  }
}
