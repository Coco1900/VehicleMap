import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SoapService {

  private uri = 'https://vehicle-map-soap-i2hy.vercel.app/';
  private options = { responseType: 'text' as 'json' };

  constructor(private http: HttpClient) { }

  calculDuration(speed: number, distance: number, nbstops: number, timeStop: number): Observable<any> {
    const body = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spy="spyne.examples.hello.soap">\
      <soapenv:Header/>
      <soapenv:Body>
        <spy:duration_time>
          <spy:speed>${speed}</spy:speed>
          <spy:distance>${distance}</spy:distance>
          <spy:nbstops>${nbstops}</spy:nbstops>
          <spy:timeStop>${timeStop}</spy:timeStop>
        </spy:duration_time>
      </soapenv:Body>
    </soapenv:Envelope>`;
    return this.http.post<any>(this.uri, body, this.options).pipe(
      map(value => {
        const data = value.split("duration_timeResult");
        let res = data[1];
        res = res.replace(">","");
        res = res.replace("</tns:","");
        return res;
      })
    );
  }

}
