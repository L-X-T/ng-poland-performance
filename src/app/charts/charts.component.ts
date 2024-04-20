import { Component, DoCheck } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { ChartComponent } from './chart/chart.component';

@Component({
  selector: 'app-charts',
  imports: [ChartComponent, ScrollingModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent implements DoCheck {
  protected readonly title = 'Charts';
  protected chartRows: {
    col1: { id: number; data: string };
    col2: { id: number; data: string };
    col3: { id: number; data: string };
    col4: { id: number; data: string };
  }[] = [];
  private readonly chartRowsCount = 27; // 27 * 4 = 108

  constructor() {
    for (let index = 0; index < this.chartRowsCount; index++) {
      this.chartRows.push({
        col1: { id: index * 4, data: 'data1' },
        col2: { id: index * 4 + 1, data: 'data2' },
        col3: { id: index * 4 + 2, data: 'data3' },
        col4: { id: index * 4 + 3, data: 'data4' },
      });
    }
  }

  ngDoCheck(): void {
    console.log('hello');
  }
}
