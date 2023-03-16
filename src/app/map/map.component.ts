import { Component, AfterViewInit, OnChanges, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { Observable, zip, map } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { delay, timer } from 'rxjs';
import { BorneService } from '../service/bornes/borne.service';
import { CityService } from '../service/city/city.service';
import { VehicleService } from '../service/vehicle/vehicle.service';
import { SoapService } from '../service/soap/soap.service';
import { InfoService } from '../service/infos/info.service';
import { PriceService } from '../service/price/price.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit,OnChanges, OnInit {

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
  private tableauFinal:any[any]=[];
  public myListVehicle: any[]=[];
  public selectedValue: any;
  autonomieVehicule!: number;
  tempsRecharge! : number;
  

  constructor(private Cityservice: CityService, 
    private BorneService: BorneService, 
    private VehicleService: VehicleService, 
    private SoapService: SoapService, 
    private InfoService: InfoService,
    private PriceService: PriceService) { 
    this.arrive="";
    this.depart="";
  }

  ngOnInit():void{
    this.VehicleService.getListVehicule().subscribe(
      (data) => {
        console.log(data.data.vehicleList);
        this.myListVehicle = data.data.vehicleList
      });

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

  selectVehicle(vehicle:  any){
    console.log(vehicle);
    this.autonomieVehicule = vehicle.range.chargetrip_range.best;
    this.InfoService.setAutonomy(vehicle.range.chargetrip_range.best)
    this.InfoService.setTimeStop(vehicle.connectors[0].time)

    this.InfoService.setDistance(0)
    this.InfoService.setNbStops(0)
    this.tempsRecharge = vehicle.connectors[0].time;
    console.log(this.tempsRecharge);
    console.log(this.autonomieVehicule);

  }

  firstsearch(){

    if(this.tableauFinal!=null){
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
      this.tableauFinal=[];
    }
   

    //cherche ville de départ
    this.Cityservice.postCity(this.depart).subscribe((data: any) => {
      if(data[0]!=undefined){
        this.departData=data[0];
        console.log(data[0].lat);
        this.markerDepart=L.marker([data[0].lat, data[0].lon]);
      }
        
    });

    //cherche ville d'arrivé et lance le parcours si on a ce qu'il faut
    this.Cityservice.postCity(this.arrive).subscribe((data: any) => {
      console.log(data[0], this.departData );
      if(data[0]!=undefined || this.departData==null || this.departData==undefined ){
        console.log(data[0], this.departData )

        this.arriveeData=data[0];
      
        console.log(data[0].lat);
        this.markerArrive=L.marker([data[0].lat, data[0].lon]);

      
        this.route2=L.Routing.control({
          waypoints: [
              L.latLng( this.departData.lat ,this.departData.lon),
              L.latLng(this.arriveeData.lat,this.arriveeData.lon )
          ],
          routeWhileDragging: false,
        }).addTo(this.tempMap);

      

        //quand on a le premier tracé
          this.route2.on('routesfound', (e:any) => {
            this.route2.on('routefound', null);

            
            var routes = e.routes;
            var summary = routes[0].summary;

            
            console.log(routes[0].coordinates);
            console.log(summary.totalDistance);


            this.InfoService.setDistance(summary.totalDistance/ 1000);


            console.log(routes[0].waypointIndices[1]);
            const index=this.calculIndexArray(summary.totalDistance, this.autonomieVehicule, routes[0].waypointIndices[1]);

            //vérifie le nombre de stops
            if(index==null){
              this.InfoService.setNbStops(0);
            }
            else{
              this.InfoService.setNbStops(index.length);
            }

            this.SoapService.calculDuration(100, (summary.totalDistance/ 1000), index.length, this.tempsRecharge).pipe(
              map(value => this.InfoService.setTempsTrajet(value))
            ).subscribe();

            this.PriceService.getPrice(summary.totalDistance/ 1000);

            let tableau=[];
    
            for(let i=0; i<index.length; i++){
              tableau.push([routes[0].coordinates[index[i]].lat, routes[0].coordinates[index[i]].lng])
              
            }

            this.calculBorneProche(tableau);
          
          });

      }
      
      
        

  
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

    //on remet le point de depart pour le tableau final
    this.tableauFinal.push(L.latLng( this.departData.lat ,this.departData.lon));
      
    zip(...checkArray).subscribe((data: any) => {
      let i=0;
      data.forEach((e: any) => {

        //mise en place des points intermédiaires des bornes

        if(e.data.stationAround[0].location.coordinates == undefined) {

          this.tableauFinal.push(L.latLng(mesPointIntermediaires[i].lat, mesPointIntermediaires[i].lon ));    
        }else{
          this.tableauFinal.push(L.latLng(e.data.stationAround[0].location.coordinates[1], e.data.stationAround[0].location.coordinates[0]));
        }
        i++;
      });
     
        this.route=L.Routing.control({
            waypoints: this.tableauFinal,
            routeWhileDragging: false,
          }).addTo(this.map);
          
    })
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
