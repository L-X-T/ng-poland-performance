import { Component, DestroyRef, effect, ElementRef, inject, input, NgZone, viewChild } from '@angular/core';

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
  private readonly blinkService = inject(BlinkService);
  // private readonly cdr = inject(ChangeDetectorRef);
  private readonly chartsDataService = inject(ChartsDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);

  readonly id = input(0);
  readonly data = input('data1');

  // @ViewChild('container') container?: ElementRef;
  protected readonly container = viewChild<ElementRef<HTMLDivElement>>('container');

  // Default data set mapping, hardcoded here.
  private chart: anychart.charts.Pie | null = null;

  constructor() {
    this.createChart();
    this.createEffect();
  }

  private createChart(): void {
    this.chart = anychart.pie(this.chartsDataService.getData(this.data()));
    this.destroyRef.onDestroy(() => {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    });
  }

  private createEffect(): void {
    const myEffect = effect(
      () => {
        const container = this.container();
        this.ngZone.runOutsideAngular(() => {
          if (this.chart && container) {
            this.chart.container(container.nativeElement);
            this.chart.draw();
          }
        });
        myEffect.destroy();
      },
      { manualCleanup: true },
    );
  }

  blink(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }
}
