import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ColormindService {
  constructor(private http: HttpClient) {}

  getColors(model, input, lock) {
    const url = 'http://colormind.io/api/';
    let data;
    if (lock) {
      data = {
        model: 'default',
        input
      };
    } else {
      data = {
        model: 'default'
      };
    }

    console.log(data);

    return this.http.post(url, JSON.stringify(data));
  }
}
