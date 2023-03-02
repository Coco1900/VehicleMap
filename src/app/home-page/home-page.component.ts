import { splitNsName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs';
import {SoapMethod} from 'soap'
import { SoapService } from '../service/soap/soap.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent{


  speed!: number;
  distance!: number;
  nbstops!: number;
  timestop!: number;

  resultat!: number;

  constructor(private soapService: SoapService) { }

  onSubmitForm(form: NgForm) {
    console.log(form.value);

    const speed = form.value.speed;
    const distance = form.value.distance;
    const nbstops = form.value.nbStops;
    const timestops = form.value.timeStop;

    this.soapService.calculDuration(speed, distance, nbstops, timestops).pipe(
      map(value => this.resultat = value)
    ).subscribe();
  }

  

  

}
