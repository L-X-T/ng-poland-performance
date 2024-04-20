import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  viewChild,
} from '@angular/core';

import { ChartsDataService } from './charts-data.service';
import { BlinkService } from '../../shared/blink.service';

import 'anychart';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  readonly id = input(0);
  readonly data = input('data1');

  // @ViewChild('container') container?: ElementRef;
  readonly container = viewChild<ElementRef>('container');

  private chart?: anychart.charts.Pie | null;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly chartsDataService = inject(ChartsDataService);
  private readonly blinkService = inject(BlinkService);
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  constructor() {
    effect(() => {
      this.chart = anychart.pie(this.chartsDataService.getData(this.data()));
      const container = this.container();
      this.ngZone.runOutsideAngular(() => {
        if (this.chart && container) {
          this.chart.container(container.nativeElement);
          this.chart.draw();
          //this.cdr.detach();
        }
      });
    });

    this.destroyRef.onDestroy(() => {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    });
  }

  blink(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }
}
