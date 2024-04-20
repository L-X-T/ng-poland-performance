import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BehaviorSubject, Observer } from 'rxjs';

import { BlinkService } from '../../shared/blink.service';
import { pattern } from '../../shared/global';

import { Flight } from '../../entities/flight';
import { FlightService } from '../flight.service';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightStatusToggleComponent } from '../flight-status-toggle/flight-status-toggle.component';
import { FlightValidationErrorsComponent } from '../flight-validation-errors/flight-validation-errors.component';

@Component({
  selector: 'app-flight-search',
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightStatusToggleComponent,
    FlightValidationErrorsComponent,
  ],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent {
  protected from = 'Graz';
  protected to = 'Hamburg';
  protected hasSearched = false;

  protected minLength = 3;
  protected maxLength = 15;
  protected pattern = pattern;
  private readonly TEN_MINUTES = 10 * 1000 * 60;

  protected oldSchoolFlights: Flight[] = []; // old school
  protected readonly flightsSubject = new BehaviorSubject<Flight[]>([]); // RxJS
  protected readonly flights = signal<Flight[]>([]); // Signal

  protected readonly flightsLength = computed(() => this.flights().length); // to demo computed

  protected basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  private readonly blinkService = inject(BlinkService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);
  private readonly flightService = inject(FlightService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => console.log('update: ', this.flights())); // to demo effect

    if (this.from && this.to) {
      this.onSearch(); // auto search if default test values are set
    }

    // add focus management here
  }

  protected onSearch(): void {
    // 1. my observable
    const flights$ = this.flightService.find(this.from, this.to);

    // 2. my observer
    const flightsObserver: Observer<Flight[]> = {
      next: (flights) => {
        this.oldSchoolFlights = flights;
        this.flightsSubject.next(flights);
        this.flights.set(flights);
        this.hasSearched = true;
        if (flights.length > 0) {
          console.log('Found ' + flights.length + ' flights');
        } else {
          console.log('No flights found');
        }
      },
      error: (errResp) => {
        this.hasSearched = true;
        console.error('Error loading flights', errResp);
      },
      complete: () => {
        // console.log('flight$ completed');
      },
    };

    // 3. my subscription
    flights$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(flightsObserver);
  }

  protected onDelayFirstFlight(): void {
    // old school
    if (this.oldSchoolFlights.length > 0) {
      const flightDate = new Date(this.oldSchoolFlights[0].date);
      flightDate.setTime(flightDate.getTime() + this.TEN_MINUTES);

      // Mutable
      this.oldSchoolFlights[0].date = flightDate.toISOString();

      // Immutable
      // ?
    }

    // RxJS
    if (this.flightsSubject.value.length > 0) {
      const flights = this.flightsSubject.value;
      const flightDate = new Date(flights[0].date);
      flightDate.setTime(flightDate.getTime() + this.TEN_MINUTES);

      // Mutable
      flights[0].date = flightDate.toISOString();

      // Immutable
      // flights[0] = { ...flights[0], date: flightDate.toISOString() };

      this.flightsSubject.next(flights);
    }

    // Signal
    if (this.flights().length > 0) {
      // Update
      this.flights.update((flights) => {
        const flightDate = new Date(flights[0].date);
        flightDate.setTime(flightDate.getTime() + this.TEN_MINUTES);

        // Mutable
        flights[0].date = flightDate.toISOString();

        // Immutable
        // flights[0] = { ...flights[0], date: flightDate.toISOString() };

        return flights;
      });
    }
  }

  protected onEditFlight(id: number): void {
    this.router.navigate(['/flights/flight-edit', id, { showDetails: true }]);
  }

  protected blinkFirstChild(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }
}
