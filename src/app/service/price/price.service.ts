import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { InfoService } from '../infos/info.service';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private uri = "https://vehicle-map-price-api.vercel.app";
  
  constructor(   private http: HttpClient,private infoService: InfoService) { }


  getPrice(distanceKm: number) {
    this.http.get<any>(this.uri + '/' + Math.floor(distanceKm)).pipe(
      map(value =>  this.infoService.setPrice(value.price))
    ).subscribe();
  }
}