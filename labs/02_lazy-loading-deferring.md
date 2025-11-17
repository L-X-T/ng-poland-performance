# 02 Lazy Loading & Deferring

In this lab, we will improve the initial load time of our _Angular app_ by using lazy loading. Of course, you should also apply these optimizations to your own application.

**Lab time:** 45–60 minutes

## Table of Contents

<!-- TOC -->

- [Using ngOptimizedImage for images](#using-ngoptimizedimage-for-images)
  - [Use a responsive image loading provider](#use-a-responsive-image-loading-provider)
  - [Bonus: Use a preconnect tag](#bonus-use-a-preconnect-tag)
  - [Bonus: Create a custom loader](#bonus-create-a-custom-loader)
- [Router-based Lazy Loading of JS](#router-based-lazy-loading-of-js)
  - [For a feature (routes array in a folder – formerly an NgModule)](#for-a-feature-routes-array-in-a-folder--formerly-an-ngmodule)
  - [For a component](#for-a-component)
  - [Add PreloadingStrategy](#add-preloadingstrategy)
  - [Use ngx-quicklink for smarter preloading \*](#use-ngx-quicklink-for-smarter-preloading-)
  - [Bonus: Implementing a Custom PreloadingStrategy \*\*](#bonus-implementing-a-custom-preloadingstrategy-)
- [Template-driven Lazy Loading with @defer](#template-driven-lazy-loading-with-defer)
  - [Check the docs and find your favorite trigger](#check-the-docs-and-find-your-favorite-trigger)
  - [Bonus: Lazy Loading without the router before @defer \*\*](#bonus-lazy-loading-without-the-router-before-defer-)
  <!-- TOC -->

## Using ngOptimizedImage for images

1. Check out the `HomeComponent`, which is shown on the app’s front page.

   You can find several `<img>` tags in it. The first one is above the fold, so it should be loaded eagerly. The other two are below the fold, so we can use lazy loading for them.

2. To activate image lazy loading, we need to import the `NgOptimizedImage` directive into the `HomeComponent`:

   ```typescript
   @Component({
       [...],
       imports: [NgOptimizedImage],
       [...]
   })
   export class AppModule {}
   ```

   Also, make sure the corresponding import statement was added.

3. Now replace each image’s `src` attribute with `ngSrc` (rename "src" to "ngSrc" without changing its value).

4. For the first image, which loads above the fold, add the `priority` attribute. Check the Elements tab in your browser’s DevTools to see the effect.

### Use a responsive image loading provider

A `loader` is a function that generates an image transformation URL for a given image file. When appropriate, `NgOptimizedImage` sets the size, format, and image quality transformations for an image.

`NgOptimizedImage` provides:

- a generic loader (no transformations),
- loaders for various image CDNs,
- support for writing your own custom loader.

You can find the documentation here:  
https://angular.io/guide/image-directive#configuring-an-image-loader-for-ngoptimizedimage

1. To use `imagekit.io` as your image loader, register an account at https://imagekit.io/registration/ (unless you already have one).
2. After registration, upload your images to the provider.
3. Register the provider inside `app.config.ts`:

   ```typescript
   export const appConfig: ApplicationConfig = {
     providers: [
       [...],
       provideImageKitLoader('https://ik.imagekit.io/LXT'),
       [...],
     ],
   };
   ```

   Make sure you have imported `provideImageKitLoader` from `@angular/common`.

4. Adjust the image `ngSrc` paths from local assets to the new CDN path:

   ```html
   <img
     width="2596"
     height="1890"
     ngSrc="grimming_from_glaeserkoppe.jpg"
     alt="Photo showing Grimming from the Gläserkoppe"
     priority />
   ```

5. Add `ngSrcset` and `sizes` for responsive images:

   ```html
   <img
     width="2596"
     height="1890"
     ngSrc="grimming_from_glaeserkoppe.jpg"
     ngSrcset="324w, 649w, 1298w, 1947w, 2596w"
     sizes="(max-width:991px) 98vw, 88vw"
     alt="Photo showing Grimming from the Gläserkoppe"
     priority />
   ```

6. For the two images below the fold, insert the following values:

   ```html
   <img [...] ngSrcset="320w, 640w, 914w" sizes="(max-width:991px) 48vw, 38vw" [...] />
   ```

7. Test your solution.

8. Make sure you understand how `ngSrcset` and `sizes` work together.

### Bonus: Use a preconnect tag

Check your browser console for a warning about a missing preconnect tag.

Then add this tag to `index.html`:

```html
<link rel="preconnect" href="https://ik.imagekit.io" />
```

### Bonus: Create a custom loader

Add the following to your `app.config.ts`:

```typescript
    // provideImageKitLoader('https://ik.imagekit.io/LXT'),
    {
      provide: IMAGE_LOADER, useValue: (config: ImageLoaderConfig) => {
        return `https://ik.imagekit.io/LXT/tr:w-${config.width}/${config.src}`;
      },
    },
```

## Router-based Lazy Loading of JS

### For a feature (routes array in a folder – formerly an NgModule)

Implement lazy loading for the `flightRoutes` folder in your `app.routes.ts`.

Keep in mind that lazy loading only works if the components (or the module if you're still using `NgModules`) in question isn't referenced directly but only with a string in the router configuration.

1. Open the file `app.routes.ts` and change the route with the path `flights`.
   It should be using the `loadChildren` now.

    <details>
    <summary>Show Code</summary>
    <p>

   ```typescript
   [...]
   {
       path: 'flights',
       // children: flightRoutes,
       loadChildren: () => import('./flights/flights.routes').then((f) => f.flightRoutes),
   },
   {
       // This route needs to be the last one!
       path: '**',
       [...]
   }
   [...]
   ```

    </p>
    </details>

2. Make sure your sidebar link to flight-search still works (something like `routerLink="/flights/flight-search"`).

3. Also make sure your `Edit` Button in your `FlightCardComponent` still works.

4. Find out that webpack splits off an own chunk for the `flightRoutes` after implementing lazy loading.
   If this works, you will see another chunk at the console (e.g. `flights.routes-LTPRBJOK.js` depending on the used version of the CLI)

5. Try it out in the browser and use the network tab within the dev tools (F12) to make sure that it is only loaded on demand.
   If it doesn't work, have a look to the console tab within the dev tools.

### For a component

Now try to add the Lazy Loading also for the **ChartsComponent**.

Hint: You'll need `loadComponent` with the component instead of `loadChildren` with the routes.

Make sure everything still works. If yes, then this might be the time to **check** our results by running the `webpack bundle analyzer` or the `source map explorer`!

### Add PreloadingStrategy

In this exercise you will implement Preloading using Angular's `PreloadAllModules` strategy.

1. Open the file `app.config.ts` and register the `PreloadAllModules` strategy by calling `withPreloading()`.

   <details>
   <summary>Show Code</summary>
   <p>

   ```typescript
   [...]
     provideRouter(
       appRoutes,
       [...],
       withPreloading(PreloadAllModules),
     ),
   [...]
   ```

   </p>
   </details>

   Also, ensure all imports have been added correctly.

   For antique apps still using the `AppModule` use:

   ```typescript
   imports: [
      RouterModule.forRoot(
          appRoutes, { preloadingStrategy: PreloadAllModules }
      );
   ]
   ```

2. Make sure it works using the network tab within Chrome DevTools. If it works, the lazy bundles are loaded **after** the app has been initializes. If this is the case, the chunks show up quite late in the water fall diagram.

### Use ngx-quicklink for smarter preloading \*

1. [Look at ngx-quicklink](https://www.npmjs.com/package/ngx-quicklink) on npmjs.com to get started with `ngx-quicklink`.

2. First you need to install `ngx-quicklink`:

   ```
   npm i ngx-quicklink
   ```

3. Now replace the `PreloadAllModules` with the `QuicklinkStrategy` and add the `quicklinkProviders`:

   <details>
   <summary>Show Code</summary>
   <p>

   ```typescript
   [...]
     provideRouter(
       appRoutes,
       [...],
       withPreloading(QuicklinkStrategy),
     ),
     quicklinkProviders,
   [...]
   ```

   </p>
   </details>

4. Attention: To recognize the router links, it's also necessary to add the `QuicklinkModule` to the `SidebarComponent`s imports:

   <details>
   <summary>Show Code</summary>
   <p>

   ```typescript
   import { QuicklinkModule } from 'ngx-quicklink';

   @Component({
     selector: 'app-sidebar',
     standalone: true,
     imports: [RouterModule, QuicklinkModule],
     templateUrl: 'sidebar.component.html',
   })
   ```

   </p>
   </details>

5. Make sure it still works using the network tab within Chrome's dev tools.

6. Also, try to remove one of the 2 bundles from the preloading by removing its link from the sidebar.

7. Learn more about `ngx-quicklink` - like how to apply it with good old `NgModules` - here: https://github.com/mgechev/ngx-quicklink

### Bonus: Implementing a Custom PreloadingStrategy \*\*

1. [Here](https://www.angulararchitects.io/aktuelles/performanceoptimierung/) you find some information about creating a custom preloading strategy. Have a look at it.

2. Create a custom preloading strategy that only preloads modules that have been marked with the `data` attribute in the router configuration.

3. Configure the system to make use of it and test it.

## Template-driven Lazy Loading with @defer

1. Create a new component called `DeferredChartsComponent`:

   ```
   ng g c deferred-charts
   ```

2. Add the new component to the `sidebar.html`:

   <details>
   <summary>Show Code</summary>
   <p>

   ```html
   <li routerLinkActive="active">
     <a routerLink="/deferred-charts">
       <p>Deferred Charts</p>
     </a>
   </li>
   ```

   </p>
   </details>

3. Also add the route to the `app.routes.ts`:

   <details>
   <summary>Show Code</summary>
   <p>

   ```typescript
     {
       path: 'deferred-charts',
       component: DeferredChartsComponent,
     },
   ```

   </p>
   </details>

4. Now open your `deferred-charts.component.ts` and replace the content with this:

   ```typescript
   import { ChangeDetectionStrategy, Component } from '@angular/core';
   import { ChartComponent } from '../charts/chart/chart.component';

   @Component({
     selector: 'app-deferred-chart',
     standalone: true,
     imports: [ChartComponent],
     templateUrl: './deferred-charts.component.html',
     styleUrl: './deferred-charts.component.scss',
     changeDetection: ChangeDetectionStrategy.OnPush,
   })
   export class DeferredChartsComponent {
     title = 'Charts';

     chartsCount = 12;
     charts: { id: number; data: string }[] = [];

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
   ```

5. Now open your `deferred-charts.component.html` and replace the content with this:

   ```html
   <div class="header">
     <h1>{{ title }}</h1>
   </div>

   <div class="container">
     <div class="row">
       @for (chart of charts; track chart) {
       <div class="col-12 col-sm-6 col-md-4 col-lg-3">
         @defer (on viewport) {
         <app-chart [id]="chart.id" [data]="chart.data" />
         } @placeholder {
         <p>Chart is loading on viewport.</p>
         }
       </div>
       }
     </div>
   </div>
   ```

6. Test to see if your component is working as expected.

   Please note: When testing `@defer` with `ng serve` you should disable hot module reloading:

   ```
   ng s --no-hmr
   ```

### Check the docs and find your favorite trigger

Check out the ways to use `@defer` in the [official docs](https://angular.dev/guide/templates/defer).

What's your favorite trigger? Prepare to report to the group.

### Bonus: Lazy Loading without the router before @defer \*\*

1. Create a new component called `DynamicChartComponent`:

   ```
   ng g c dynamic-chart
   ```

2. Add the new component to the `sidebar.html`:

   <details>
   <summary>Show Code</summary>
   <p>

   ```html
   <li routerLinkActive="active">
     <a routerLink="/dynamic-chart">
       <p>Dynamic Chart</p>
     </a>
   </li>
   ```

   </p>
   </details>

3. Also add the route to the `app.routes.ts`:

   <details>
   <summary>Show Code</summary>
   <p>

   ```typescript
     {
       path: 'dynamic-chart',
       component: DynamicChartComponent,
     },
   ```

   </p>
   </details>

4. Now open your `dynamic-chart.component.html` and replace the content with this:

   ```html
   <h1>{{ title }}</h1>

   <ng-container #cnt></ng-container>
   ```

   Hint: We will use the `ng-container` with the handle `#cnt` to create our dynamic chart.

5. Now switch to `dynamic-chart.component.ts` and add the `AfterViewInit` interface and a `ViewContainerRef`:

   ```typescript
   export class DynamicChartComponent implements AfterViewInit {
     title = 'Dynamic Chart';

     @ViewChild('cnt', { read: ViewContainerRef }) viewContainerRef!: ViewContainerRef;

     private readonly cdr = inject(ChangeDetectorRef);

     ngAfterViewInit(): void {
       console.log(this.viewContainerRef);
     }
   }
   ```

6. Okay, so now let's implement the dynamic creation of the chart. We do this by switching `ngAfterViewInit` to async mode:

   ```typescript
   async ngAfterViewInit(): Promise<void> {
     await this.createChartDynamically();
   }
   ```

7. Of course, we also need that new method:

   ```typescript
   private async createChartDynamically(): Promise<void> {
     const esm = await import('../charts/chart/chart.component');
     const chartRef = this.viewContainerRef.createComponent(esm.ChartComponent);
     this.cdr.markForCheck();
   }
   ```

8. Now everything should work, but where is our chart you ask? Well probably your component was created with `ChangeDetectionStrategy.OnPush`. We'll talk about that later on, but for now it's okay to just comment that out. Alternatively, if you know what you're doing, you could add a `markForCheck()` of the injected `ChangeDetectorRef` just below the creation of the chart.

9. Once you see the chart, it might be time for a final round of build analyzing.

   Please note: Dynamically loaded parts will not be preloaded.
