import { splitNsName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map, Observable } from 'rxjs';
import {SoapMethod} from 'soap'
import { InfoService } from '../service/infos/info.service';
import { SoapService } from '../service/soap/soap.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit{


  autonomy$!: Observable<number | null>;
  tempsTrajet$!: Observable<number | null>;
  distance$!: Observable<number | null>;
  nbStops$!: Observable<number | null>;

  timeStop$!: Observable<number | null>;
  price$!: Observable<number | null>;

  constructor(private soapService: SoapService, private infoService: InfoService) { }

  ngOnInit(){
    this.tempsTrajet$ = this.infoService.tempsTrajet$;
    this.timeStop$ = this.infoService.timeStop$;
    this.distance$ = this.infoService.distance$;
    this.nbStops$ = this.infoService.nbStops$;
    this.autonomy$ = this.infoService.autonomy$;
    this.price$ = this.infoService.price$;
  }
 

}
