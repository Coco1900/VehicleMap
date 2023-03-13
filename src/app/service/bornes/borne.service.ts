import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ApolloQueryResult, gql } from "@apollo/client/core";
import { Apollo } from "apollo-angular";
import { Observable } from 'rxjs';

const headers = {
  'x-client-id': '640f284275ebf0917938879d',
  'x-app-id': '640f284275ebf0917938879f',
};


@Injectable({
  providedIn: 'root'
})
export class BorneService {

  constructor(private apollo: Apollo) { }

  getListBornes(point : number, point2: number): Observable<any>{
    const query = gql`
    query stationAround($query: StationAroundQuery!){
      stationAround(
          query: $query
          size: 1
        ) {
          location {
            type
            coordinates
          }
          power
          speed
          status
          }
      }
    `;
    return this.apollo.watchQuery<any>({
      query : query,
      variables: {
        query: {
          location: {
            type: "Point",
            coordinates: [
              point,
              point2
            ]
          },
          distance: 10000
        }
      },
      context: {
        headers,
      },
    }).valueChanges;

  }

}
