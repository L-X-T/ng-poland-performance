import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-dynamic-chart',
  standalone: true,
  imports: [],
  templateUrl: './dynamic-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicChartComponent implements AfterViewInit {
  title = 'Dynamic Chart';

  @ViewChild('cnt', { read: ViewContainerRef }) viewContainerRef!: ViewContainerRef;

  private readonly cdr = inject(ChangeDetectorRef);

  async ngAfterViewInit(): Promise<void> {
    setTimeout(async () => {
      await this.createChart();
    }, 2_100);
  }

  private async createChart(): Promise<void> {
    const esm = await import('../charts/chart/chart.component');
    this.viewContainerRef.createComponent(esm.ChartComponent);
    this.cdr.markForCheck();
  }
}

export default DynamicChartComponent;
