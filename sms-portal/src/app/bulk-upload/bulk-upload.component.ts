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
import * as XLSX from 'ts-xlsx';

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
  public arrayBuffer: any;
  public fileUploaded?: File;

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
    this.fileUploaded = event.target.files[0];
  }

  public upload(): void {
    this.progress = 0;
    // this.fileuploaded(this.selectedFiles);
    // return;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.fileUploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              console.log('in progress');
            } else if (event instanceof HttpResponse) {
              this.message = event?.body?.message || event?.status;
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
  public fileUploader() {
    if (this.selectedFiles) {
      const file:any = this.fileUploaded;
      debugger;

      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; i++) {
          arr[i] = String.fromCharCode(data[i]);
        }
        var bstr = arr.join('');
        var workbook = XLSX.read(bstr, { type: 'binary' });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  // public fileuploaded(files: any) {
  //   if (files && files.length > 0) {
  //     let file = files.item(0);
  //     console.log(file.name);
  //     console.log(file.size);
  //     console.log(file.type);
  //     let reader: FileReader = new FileReader();
  //     // reader.readAsText(file);
  //     let arrayBuffer: any = [];
  //     reader.onload = (e) => {
  //       arrayBuffer = reader.result;
  //       var data = new Uint8Array();
  //       var arr = new Array();
  //       for (var i = 0; i != data.length; i++) {
  //         arr[i] = String.fromCharCode(data[i]);
  //         console.log('arr', arr);
  //       }
  //       var bstr = arr.join('');
  //       var workbook = XLSX.read(bstr, { type: 'binary' });
  //       var first_sheet_name = workbook.SheetNames[0];
  //       var worksheet = workbook.Sheets[first_sheet_name];
  //       console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
  //       // let csv: string = reader.result as string;
  //       // console.log(csv);
  //     };
  //     reader.readAsArrayBuffer(files);
  //   }
  // }
}
