import { Component } from '@angular/core';

import { ChartComponent } from './chart/chart.component';

@Component({
  selector: 'app-charts',
  imports: [ChartComponent],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent {
  protected readonly title = 'Charts';
  protected charts: { id: number; data: string }[] = [];
  private readonly chartsCount = 4;

  constructor() {
    for (let index = 1; index <= this.chartsCount; index++) {
      let dataNumber = index % 3;
      if (!dataNumber) {
        dataNumber = 3;
      }

      this.charts.push({ id: index, data: 'data' + dataNumber });
    }
  }
}

export default ChartsComponent;
