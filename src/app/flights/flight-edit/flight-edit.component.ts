import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, model } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';

import { pattern } from '../../shared/global';

import { FlightService } from '../flight.service';
import { Flight } from '../../entities/flight';

@Component({
  selector: 'app-flight-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './flight-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightEditComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly flightService = inject(FlightService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected flight$?: Observable<Flight>;
  readonly flight = model<Flight>();

  protected readonly id = input<number>(0);
  protected readonly showDetails = input<boolean>(false);

  protected message = '';
  protected pattern = pattern;
  protected editForm = this.fb.group({
    id: [0, Validators.required],
    from: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.pattern(this.pattern),
        ],
        updateOn: 'blur',
      },
    ],
    to: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.pattern(this.pattern),
        ],
        updateOn: 'blur',
      },
    ],
    date: ['', [Validators.required, Validators.minLength(33), Validators.maxLength(33)], []],
  });

  private readonly DEBOUNCE_MS = 250;
  private readonly DELAY_MS = 2_500;

  private readonly flightInputEffect = effect(() => this.patchFormValue(this.flight() as Flight));
  private readonly flightParamEffect = effect(() => {
    this.flight$ = this.flightService.findById('' + this.id());
    this.flight$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (flight) => {
        this.flight.set(flight);
        this.patchFormValue(flight);
        this.message = 'Success loading!';
      },
      error: (errResponse) => {
        if (this.showDetails()) {
          console.error(errResponse);
        }
        this.message = 'Error Loading!';
      },
    });
  });

  constructor() {
    this.setupSubscriptions();
  }

  protected onSave(): void {
    this.message = 'Is saving ...';

    const flightToSave = this.editForm.value as Flight;

    this.flightService
      .save(flightToSave)
      .pipe(delay(this.DELAY_MS), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (flight) => {
          // console.warn('FlightEditComponent - onSave()');
          // console.log(flight);
          this.flight.set(flight);
          this.patchFormValue(flight);
          this.message = 'Success saving! Navigating ...';

          setTimeout(() => this.router.navigate(['/flights/flight-search']), this.DELAY_MS);
        },
        error: (errResponse) => {
          console.error(errResponse);
          this.message = 'Error saving!';
        },
      });
  }

  private patchFormValue(flight: Flight): void {
    if (this.editForm && flight) {
      this.editForm.patchValue(flight);
    }
  }

  private setupSubscriptions(): void {
    this.editForm.valueChanges
      .pipe(
        debounceTime(this.DEBOUNCE_MS),
        distinctUntilChanged((a, b) => a.id === b.id && a.from === b.from && a.to === b.to && a.date === b.date),
        takeUntilDestroyed(),
      )
      .subscribe((value) => {
        console.log(value);
      });
  }
}
