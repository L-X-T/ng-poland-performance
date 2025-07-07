# 04 Runtime Best Practices

In this lab, we will explore how to improve change detection performance in Angular using the `OnPush` strategy. With `OnPush`, you'll be perfectly prepared for going zoneless. We will also learn how to handle zone pollution caused by third-party libraries, since most Angular apps still use `zone.js`. After that, we will apply some more runtime best practices to our Angular app, including RxJS subscription management. Later, once again, you should also apply the same optimizations to your own _Angular apps_.

**Lab time:** 45–60 minutes

## Table of Contents

<!-- TOC -->

- [Improving Data Binding Performance with OnPush](#improving-data-binding-performance-with-onpush)
  - [Bonus: Search for Change Detection cycles in your own project](#bonus-search-for-change-detection-cycles-in-your-own-project)
- [Zone Pollution by 3rd party lib](#zone-pollution-by-3rd-party-lib)
  - [Bonus: Search for Zone Pollution in your own project](#bonus-search-for-zone-pollution-in-your-own-project)
- [Using @for track](#using-for-track)
- [Using Virtual Scrolling](#using-virtual-scrolling)
- [Bonus: RxJS subscription management](#bonus-rxjs-subscription-management)
<!-- TOC -->

## Improving Data Binding Performance with OnPush

1. Open the file `flight-search.component.ts` and look at the `onDelayFirstFlight` method, which is bound to the button with the label `Delay 1st Flight` in the HTML template.

   ```typescript
   if (this.oldSchoolFlights.length > 0) {
     const flightDate = new Date(this.oldSchoolFlights[0].date);
     flightDate.setTime(flightDate.getTime() + this.TEN_MINUTES);

     // Mutable
     this.oldSchoolFlights[0].date = flightDate.toISOString();

     // Immutable
     // ?
   }
   ```

   ```html
       [...]
         Search
       </button>

       @if (flights.length > 0) {
         <button class="btn btn-default" style="margin-left: 10px" (click)="onDelayFirstFlight()">Delay 1st Flight</button>
       }
     </div>
     [...]
   ```

2. Now open the file `flight-card.component.ts` and look at what this call of the `BlinkService` method does:

   ```typescript
   protected blinkFirstChild(): void {
     this.blinkService.blinkElementsFirstChild(this.elementRef);
   }
   ```

3. Move to the file `flight-card.component.html` and see the usage of this method:

   ```html
   {{ blinkFirstChild() }}
   ```

   Please note that binding methods in templates is not a good idea from a performance point of view. We do it here just to visualize the change detector.

4. Open the application in the browser and search for flights from `Hamburg` to `Graz`.

5. Click the button `Delay 1st Flight` and see that only the first flight gets a new date. But you will also see that every component is checked for changes by Angular, because every component blinks.

6. Open the file `flight-card.component.ts`. Switch on `OnPush` for your `FlightCardComponent`.

   <details>
   <summary>Show Code</summary>
   <p>

   ```typescript
   [...]
   import { ChangeDetectionStrategy } from '@angular/core';

   @Component({
     selector: 'app-flight-card',
     standalone: true,
     imports: [CommonModule, CityPipe],
     templateUrl: './flight-card.component.html',
     changeDetection: ChangeDetectionStrategy.OnPush // add this
   })
   export class FlightCardComponent {
     [...]
   }
   ```

   </p>
   </details>

7. Open `flight-search.component.ts` and adjust it to update the selected flight's date in an _immutable_ way – using the spread operator to create a shallow copy of the flight item:

   <details>
   <summary>Show Code</summary>
   <p>

   ```typescript
   onDelayFirstFlight(): void {
     if (this.oldSchoolFlights.length > 0) {
       const flightDate = new Date(this.oldSchoolFlights[0].date);
       flightDate.setTime(flightDate.getTime() + this.TEN_MINUTES);

       // Mutable
       // this.oldSchoolFlights[0].date = flightDate.toISOString();

       // Immutable
       this.oldSchoolFlights[0] = {
         ...this.oldSchoolFlights[0],
         date: flightDate.toISOString(),
       };
     }
   }
   ```

   </p>
   </details>

   You can find some information about the object spread operator (e.g. `...oldFlight`) here:  
   https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html (scroll down to “Object Spread”)  
   and about the array spread operator here:  
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator

8. Make sure your implementation works. Switch to the browser and search for flights again. Click `Delay 1st Flight` one more time and verify that Angular now only checks and updates the first flight card.

### Bonus: Search for Change Detection cycles in your own project

Open an Angular workspace from your own work and use the same `blink()` method to search for unnecessary change detection cycles in your app. Alternatively, you can use the Angular DevTools Profiler.

If you find something, try to fix it with `ChangeDetectionStrategy.OnPush`. See if everything else still works or if you need to fix mutable updates.

## Zone Pollution by 3rd party lib

1. Just like in the first exercise, open the file `chart.component.ts` and uncomment the `blink()` method. Make sure all imports are added correctly and then add this to the HTML template:

   ```html
   {{ blink() }}
   ```

2. You should now see the effect of zone pollution by the chart library: endless change detection cycles.

3. Fix the zone pollution by wrapping the chart initialization in an `ngZone.runOutsideAngular()` call.

   <details>
   <summary>Show Code</summary>
   <p>

   ```typescript
   ngAfterViewInit(): void {
     this.ngZone.runOutsideAngular(() => {
       if (this.chart && this.container) {
         this.chart.container(this.container.nativeElement);
         this.chart.draw();
       }
     });
   }
   ```

   </p>
   </details>

   You might need to inject `NgZone` here as well.

### Bonus: Search for Zone Pollution in your own project

1. Open an Angular workspace of your own work and use the same `blink()` method to search for zone pollution in your app. Alternatively, you can use the Angular DevTools Profiler.

2. If you find something, try to fix it with `ngZone.runOutsideAngular()`. Check that everything still works afterward.

## Using @for track

When you resubmit the same search, you will notice that `@for` repaints all items from scratch. This is not necessary; instead, we can reuse existing items by setting an intelligent `track`.

**Important note**: With the new control flow syntax, life got really easy.

1. Open `flight-search.component.html` and look for the line that uses `@for`.

2. Set the `track` expression in the `@for` loop:

   ```html
   @for (flight of flights; track flight.id) [...]
   ```

   Try resubmitting the same search again and interpret your findings.

## Using Virtual Scrolling

1. To be able to use Virtual Scrolling we need to install `@angular/cdk` first:

   ```bash
   npm i @angular/cdk
   ```

   or

   ```bash
   yarn add @angular/cdk
   ```

   or

   ```bash
   pnpm i @angular/cdk
   ```

2. Now we need to import `CdkFixedSizeVirtualScroll`, `CdkVirtualForOf`, and `CdkVirtualScrollViewport` into the `ChartsComponent`:

   ```typescript
   imports: [ChartComponent, CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport],
   ```

3. Also, in `charts.component.ts` we want to change the number of charts from 8 to something bigger. We also need to adjust the data structure to have 4 columns in each chart row. Here is an example of how to do this:

   ```typescript
   chartRowsCount = 27; // 27 * 4 = 108
   chartRows: {
     col1: { id: number; data: string };
     col2: { id: number; data: string };
     col3: { id: number; data: string };
     col4: { id: number; data: string };
   }[] = [];

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
   ```

4. In the component’s view template `charts.component.html` we need to replace the `div.row` with a virtual scrolling viewport:

   ```html
   <cdk-virtual-scroll-viewport itemSize="264" class="viewport">
     <div *cdkVirtualFor="let chart of chartRows; let index = index" [id]="'row_' + index" class="row">
       <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
         <app-chart [id]="chart.col1.id" [data]="chart.col1.data" />
       </div>
       <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
         <app-chart [id]="chart.col2.id" [data]="chart.col2.data" />
       </div>
       <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
         <app-chart [id]="chart.col3.id" [data]="chart.col3.data" />
       </div>
       <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
         <app-chart [id]="chart.col4.id" [data]="chart.col4.data" />
       </div>
     </div>
   </cdk-virtual-scroll-viewport>
   ```

   Please note: By adding the height of each item as `itemSize` in `px`, we can optimize performance. Since we have 4 columns, we need to divide the real row height by 4 here to get a useful value.

5. Finally, in `charts.component.scss` we need to set a height for the virtual scrolling viewport:

   ```scss
   .viewport {
     width: 100%;
     height: calc(100vh - 280px);
   }
   ```

6. Check your solution and look into the DevTools Elements tab to verify that virtual scrolling is working.

## Bonus: RxJS subscription management

Open `flight-edit.component.ts` and look for subscriptions. You should find at least three of them. 😉

Do you still remember which one does not have to be managed?

Unsubscribe from the other two by using at least one of the recommended methods:

1. If possible, use the `AsyncPipe` (if that’s possible – probably not in this case).
2. Otherwise use Angular 16’s new `takeUntilDestroyed()`.

You should use `takeUntilDestroyed()` at least once.

Hint: If you are calling that operator in the `constructor`, you don’t need a `DestroyRef`.

Help: If you need a reference, open `flight-search.component.ts` – there you’ll find the two introduced methods of unsubscribing.
