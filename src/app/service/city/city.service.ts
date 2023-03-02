import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private Http: HttpClient) { }

 

  public postCity(address: string): any {

    address.replace(" ", "+");
  
    return this.Http.post<any>('https://nominatim.openstreetmap.org/search?q='+address+'&format=json&limit=1', { title: 'Post city' });
  }
}
