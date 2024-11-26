import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { IataService } from '../../services/iata.service';
import { LoadingService } from '../../services/loading.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { IataLocation } from '../../models/iata.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent implements OnInit {
  searchForm: FormGroup;
  loading$ = this.loadingService.loading$;
  locations: IataLocation[] = [];
  filteredOriginLocations: IataLocation[] = [];
  filteredDestinationLocations: IataLocation[] = [];
  showOriginDropdown = false;
  showDestinationDropdown = false;
  minDate!: string;

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private iataService: IataService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.searchForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      currency: ['USD', Validators.required],
      type: ['oneway', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: ['']
    });
  }

  ngOnInit() {
    this.loadIataLocations();
    this.setupLocationAutocomplete();

    
  }

  private loadIataLocations() {
    this.iataService.getIataLocations().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.locations = response.data;
        }
      },
      error: (error) => console.error('Error loading IATA locations:', error)
    });
  }

  private setupLocationAutocomplete() {
    this.searchForm.get('origin')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterLocations(value, 'origin');
    });

    this.searchForm.get('destination')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterLocations(value, 'destination');
    });
  }

  private filterLocations(value: string, field: 'origin' | 'destination') {
    if (!value) {
      this[field === 'origin' ? 'filteredOriginLocations' : 'filteredDestinationLocations'] = [];
      return;
    }

    const filtered = this.locations.filter(location =>
      location.cityName.toLowerCase().includes(value.toLowerCase()) ||
      location.iataCode.toLowerCase().includes(value.toLowerCase())
    );

    if (field === 'origin') {
      this.filteredOriginLocations = filtered;
      this.showOriginDropdown = true;
    } else {
      this.filteredDestinationLocations = filtered;
      this.showDestinationDropdown = true;
    }
  }

  selectLocation(location: IataLocation, field: 'origin' | 'destination') {
    this.searchForm.patchValue({
      [field]: location.iataCode
    });
    if (field === 'origin') {
      this.showOriginDropdown = false;
    } else {
      this.showDestinationDropdown = false;
    }
  }

  onFlightTypeChange() {
    const returnDateControl = this.searchForm.get('returnDate');
    if (this.searchForm.get('type')?.value === 'roundtrip') {
      returnDateControl?.setValidators(Validators.required);
    } else {
      returnDateControl?.clearValidators();
      returnDateControl?.setValue('');
    }
    returnDateControl?.updateValueAndValidity();
  }



  onSubmit() {
    if (this.searchForm.valid) {
      this.flightService.searchFlights(this.searchForm.value).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            localStorage.setItem('searchResults', JSON.stringify(response));
            this.router.navigate(['/results']);
          } else {
            alert('Error: ' + response.message);
          }
        },
        error: (error) => {
          alert('Error searching flights: ' + error);
        }
      });
    }
  } 
}