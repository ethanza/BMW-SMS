import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = '';
  constructor(private http: HttpClient) {}

  public upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseUrl}/send-whatsapp`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

}
