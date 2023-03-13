import { Component, AfterViewInit, OnChanges } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { Observable, zip } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { delay, timer } from 'rxjs';
import { BorneService } from '../service/bornes/borne.service';
import { CityService } from '../service/city/city.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit,OnChanges {

  public arrive: string;
  public depart: string;
  public departData!:any;
  public arriveeData!: any;
  public map!:any;
  public tempMap!:any;
  private bounds!: any;
  private markerGroup!:any;
  private markerDepart: any;
  private markerArrive:any;
  private tiles:any;
  private route:any;
  private route2:any;
  private tableau2:any[any]=[];
  private tableau3:any[any]=[];
  private mapMarkers:any;
  private check:boolean=false;
  

  constructor(private Cityservice: CityService, private BorneService: BorneService) { 
    this.arrive="";
    this.depart="";
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    this.tempMap = L.map('tempMap', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  ngOnChanges():void{
  }

  searchs() {
    this.firstsearch();

  };

  firstsearch(){
    /*if (this.markerArrive) {
      this.map.removeLayer(this.markerArrive); // remove
    }
    if (this.markerDepart) {
      this.map.removeLayer(this.markerDepart); // remove
    }*/
    if(this.tableau2!=null){
       this.map.eachLayer((layer: any) => {
      layer.remove();
      });

      this.map.eachLayer((layer: any) => {
        if (layer.options.waypoints && layer.options.waypoints.length) {
          this.map.removeLayer(layer);
         }
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      this.tableau2=[];
    }
   

    this.Cityservice.postCity(this.depart).subscribe((data: any) => {
      
        this.departData=data[0];
        console.log(data[0].lat);
        this.markerDepart=L.marker([data[0].lat, data[0].lon]);
        //this.markerDepart.addTo(this.map);
    });

    this.Cityservice.postCity(this.arrive).subscribe((data: any) => {
      
      this.arriveeData=data[0];
      
      console.log(data[0].lat);
      this.markerArrive=L.marker([data[0].lat, data[0].lon]);
      //this.markerArrive.addTo(this.map);
      //this.bounds = L.featureGroup([this.markerDepart,this.markerArrive]);
      //this.map.fitBounds(this.bounds.getBounds())

      

      this.route2=L.Routing.control({
        waypoints: [
            L.latLng( this.departData.lat ,this.departData.lon),
            L.latLng(this.arriveeData.lat,this.arriveeData.lon )
        ],
        routeWhileDragging: false,
      }).addTo(this.tempMap);  

        this.route2.on('routesfound', (e:any) => {
          this.route2.on('routefound', null);

          
          var routes = e.routes;
          var summary = routes[0].summary; 
          console.log(routes[0].coordinates);
          console.log(summary.totalDistance);
          console.log(routes[0].waypointIndices[1]);
          const index=this.calculIndexArray(summary.totalDistance, 99, routes[0].waypointIndices[1]);
          console.log("COUOCU",index.length);
          let tableau=[];
  
          //this.route.spliceWaypoints(0, 0, this.route.getWaypoints()[0]);
          for(let i=0; i<index.length; i++){
            
            console.log("COUCOU"+routes[0].coordinates[i].lat, routes[0].coordinates[i].lng);
            //tableau.push(L.latLng(routes[0].coordinates[index[i]].lat, routes[0].coordinates[index[i]].lng))
            tableau.push([routes[0].coordinates[index[i]].lat, routes[0].coordinates[index[i]].lng])
            
            //this.route.spliceWaypoints(0, 0, L.latLng(routes[0].coordinates[index[i]].lat, routes[0].coordinates[index[i]].lng));
  
            //console.log(this.route.getWaypoints());
            //this.route.waypoints.add(L.latLng(routes[0].coordinates[index[i]].lat, routes[0].coordinates[index[i]].lng))
            //console.log("COUCOU"+routes[0].coordinates[i].lat, routes[0].coordinates[i].lng);
            //newCoord.add(L.latLng(routes[0].coordinates[index[i]].lat, routes[0].coordinates[index[i]].lng));
            //console.log(this.route.getWaypoints());
            //this.route.spliceWaypoints(0, 0, L.latLng();
            
          }

          this.calculBorneProche(tableau);
          //console.log("tableau2"+this.tableau2);
  
          //console.log(this.route.getWaypoints);
          
          
         
        });
        
        
      
      //this.route.addTo(this.map);
      //console.log(this.route.waypo)

  
    });


  }

  calculBorneProche(tableau: [any][any]){
    const checkArray: Observable<any>[]=[];
    const mesPointIntermediaires: any[]=[];

    tableau.forEach((element: any[]) => {
      checkArray.push(this.BorneService.getListBornes(
        element[1], element[0])
      ); 
      mesPointIntermediaires.push({lat: element[0], lon: element[1]});
    })
      
    zip(...checkArray).subscribe((data: any) => {
      let i=0;
      data.forEach((e: any) => {
        console.log(e.data.stationAround[0].location.coordinates);

        if(e.data.stationAround[0].location.coordinates == undefined) {

          this.tableau2.push(L.latLng(mesPointIntermediaires[i].lat, mesPointIntermediaires[i].lon ));    
        }else{
          this.tableau2.push(L.latLng(e.data.stationAround[0].location.coordinates[1], e.data.stationAround[0].location.coordinates[0]));
        }
        i++;
      });
     
      
        this.route=L.Routing.control({
            waypoints: this.tableau2,
            routeWhileDragging: false,
          }).addTo(this.map);
          
      //console.log(data.data.stationAround[0].location.coordinates)
    })
    //this.tableau2.push(L.latLng(element[0], element[1])); 
      console.log("COUCOU");
  

      
    

    //console.log(tableau2)
    //return this.tableau2;
  }

  calculIndexArray(distanceM: number, autonomy: number, lengthCoords: number) {
    if (autonomy < distanceM) {
      const nbReloads = Math.floor(distanceM / (autonomy*1000));
      console.log("nb arret", nbReloads);
      let index = (lengthCoords/nbReloads);
     
      //tableau pour les indexes des coordonéees a recuperer
      let arrayIndex: any = [];
      
      for (let i = 1; i < nbReloads + 1; i++) {
        var indexTemp=i*index;
        console.log(indexTemp);
        arrayIndex.push(Math.floor(indexTemp));
      }
      return arrayIndex;
    }
    return null;  
     
  };
  
}
