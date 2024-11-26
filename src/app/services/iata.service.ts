import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { IataResponse } from '../models/iata.model';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class IataService {
  private apiUrl = `${environment.urlAPI}/GetAirports`;
  private apiKey = environment.funtionKey;

  constructor(private http: HttpClient) {}

  getIataLocations(): Observable<IataResponse> {
    const headers = new HttpHeaders({
       'x-functions-key': this.apiKey
    });

    return this.http.get<IataResponse>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching IATA locations:', error);
        // Fallback to mock data in case of error
        return of(this.getMockData());
      })
    );
  }

  // Keeping mock data as fallback
  private getMockData(): IataResponse {
    return {
      isSuccess: true,
      message: "Successful request",
      data: [

      ]
    };
  }
}