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
export class VehicleService {

  constructor(private apollo: Apollo) { }

  getListVehicule(): Observable<any>{
    const query = gql`
    query {
      vehicleList(
        page: 0
        size: 20
      ) {
        id
        naming {
          make
          model
        }
        connectors {
          time
        }
        range{
          chargetrip_range {
            best
            worst
          }
        }
        media{
          image{
            thumbnail_url
          }
        }
      }
    }
    `;
    return this.apollo.watchQuery<any>({
      query,
      context: {
        headers,
      },
    }).valueChanges;

  }


}