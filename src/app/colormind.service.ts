import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ColormindService {
  constructor(private http: HttpClient) {}

  getColors(model, input) {
    const url = 'http://colormind.io/api/';
    const data = {
      model,
      input
    };
    console.log(data);

    return this.http.post(url, JSON.stringify(data));
  }
}
