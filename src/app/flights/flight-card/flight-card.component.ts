import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { DatePipe } from '@angular/common';

import { Flight } from '../../entities/flight';
import { CityPipe } from '../../pipes/city.pipe';
import { BlinkService } from '../../shared/blink.service';
import { FlightDatePipe } from '../shared/pipes/flight-date.pipe';

@Component({
  selector: 'app-flight-card',
  imports: [DatePipe, CityPipe, FlightDatePipe],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightCardComponent implements OnChanges, OnInit, DoCheck, OnDestroy {
  private readonly debug = false;

  readonly item = input.required<Flight>();
  readonly selected = input(false);

  readonly datePipe = new DatePipe('en-US');

  private readonly blinkService = inject(BlinkService);
  private readonly elementRef = inject(ElementRef);

  ngOnChanges(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngOnChanges()]');
      console.log(this.item());
      console.log('selected: ' + this.selected());
    }
  }

  ngOnInit(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngOnInit()]');
      console.log(this.item());
      console.log('selected: ' + this.selected());
    }
  }

  ngDoCheck(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngDoCheck()]');
      console.log(this.item);
      console.log('selected: ' + this.selected);
    }
  }

  ngOnDestroy(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngOnDestroy()]');
      console.log(this.item());
      console.log('selected: ' + this.selected());
    }
  }

  protected blinkFirstChild(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }
}
