import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FlightData } from '../../models/flight.model';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-list.component.html'
})
export class FlightListComponent implements OnInit {
  flights: FlightData[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const results = localStorage.getItem('searchResults');
    console.log("Val demo: ", results);
    if (results) {
      const response = JSON.parse(results);
      this.flights = response.data || [];
    }
  }

  backToSearch() {
    this.router.navigate(['/search']);
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString();
  }
}