import { ChangeDetectionStrategy, Component, ElementRef, inject, model } from '@angular/core';

import { BlinkService } from '../../shared/blink.service';

@Component({
  selector: 'app-flight-status-toggle',
  templateUrl: './flight-status-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightStatusToggleComponent {
  readonly status = model.required<boolean>();

  private readonly blinkService = inject(BlinkService);
  private readonly elementRef = inject(ElementRef);

  protected onToggleStatus(): void {
    this.status.set(!this.status());
  }

  protected blinkFirstChild(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }
}
