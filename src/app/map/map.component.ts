import { Component, AfterViewInit, OnChanges } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import * as L from 'leaflet';
import { delay, timer } from 'rxjs';
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
  private bounds!: any;
  private markerGroup!:any;
  private markerDepart: any;
  private markerArrive:any;
  private tiles:any;

  constructor(private Cityservice: CityService) { 
    this.arrive="";
    this.depart="";
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
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
    if (this.markerArrive) {
      this.map.removeLayer(this.markerArrive); // remove
    }
    if (this.markerDepart) {
      this.map.removeLayer(this.markerDepart); // remove
    }
    this.Cityservice.postCity(this.depart).subscribe((data: any) => {
        this.departData=data.ville;
        console.log(data[0].lat);
        this.markerDepart=L.marker([data[0].lat, data[0].lon]);
        this.markerDepart.addTo(this.map);
    });

    this.Cityservice.postCity(this.arrive).subscribe((data: any) => {
      this.departData=data.ville;
      console.log(data[0].lat);
      this.markerArrive=L.marker([data[0].lat, data[0].lon]);
      this.markerArrive.addTo(this.map);
      this.bounds = L.featureGroup([this.markerDepart,this.markerArrive]);
      this.map.fitBounds(this.bounds.getBounds())

  });
    //this.arriveeData=this.Cityservice.postCity(this.arrive);
    //L.marker([, 30.5]).addTo(map);
    //L.marker([50.5, 30.5]).addTo(map);
    
    //console.log(this.departData.geometry.coordinates);

   

    
  };

}
