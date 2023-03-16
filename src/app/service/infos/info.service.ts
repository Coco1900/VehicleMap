import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ApolloQueryResult, gql } from "@apollo/client/core";
import { Apollo } from "apollo-angular";
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InfoService {

  private distance: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  distance$: Observable<number | null> = this.distance.asObservable();

  private nbStops: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  nbStops$: Observable<number | null> = this.nbStops.asObservable();

  private autonomy: BehaviorSubject<number> = new BehaviorSubject<number>(500);
  autonomy$: Observable<number> = this.autonomy.asObservable();
  
  private tempsTrajet: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  tempsTrajet$: Observable<number | null> = this.tempsTrajet.asObservable();

  private timeStop: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  timeStop$: Observable<number | null> = this.timeStop.asObservable();


  
  constructor() { }


  setTempsTrajet(tempsTrajet: number) {
    this.tempsTrajet.next(tempsTrajet);
  }

  setDistance(distance: number) {
    this.distance.next(distance);
  }

  setNbStops(nbStops: number) {
    this.nbStops.next(nbStops);
  }

  setTimeStop(timeStops: number) {
    this.timeStop.next(timeStops);
  }

  setAutonomy(autonomy: number) {
    this.autonomy.next(autonomy);
  }


}
