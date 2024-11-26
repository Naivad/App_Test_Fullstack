import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlightResponse, SearchCriteria } from '../models/flight.model';
import { LoadingService } from './loading.service';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = `${environment.urlAPI}/CheckFlights`;


  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  searchFlights(criteria: SearchCriteria): Observable<FlightResponse> {
    const headers = new HttpHeaders({
 
    });

    let params = new HttpParams()
      .set('startDate', criteria.departureDate)
      .set('EdnDate', criteria.returnDate!)
      .set('iataCodeOrigin', criteria.origin)
      .set('iataCodeDestination', criteria.destination)
      .set('currency', criteria.currency);

    if (criteria.type === 'roundtrip' && criteria.returnDate) {
      params = params.set('EdnDate', criteria.returnDate);
    }

    return this.loadingService.wrapWithLoading(
      this.http.get<FlightResponse>(this.apiUrl, { headers, params })
        .pipe(catchError(this.handleError))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}