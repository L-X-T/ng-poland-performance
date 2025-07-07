# 03 Server-Side Rendering, SSG and Incremental Hydration

In this lab, we will further improve the initial load time of our _Angular app_ by adding **Server-Side Rendering (SSR)**. Once again, you should also apply the same optimizations to your own apps.

**Lab time:** 25–40 minutes

## Table of Contents

<!-- TOC -->

- [Add Angular SSR](#add-angular-ssr)
  - [Add RenderModes for certain routes](#add-rendermodes-for-certain-routes)
  - [Add SSR getPrerenderParams() via API \*](#add-ssr-getprerenderparams-via-api-)
- [Add Incremental Hydration](#add-incremental-hydration)
  - [Add more examples](#add-more-examples)
  - [Check the docs and find your favorite trigger](#check-the-docs-and-find-your-favorite-trigger)
  <!-- TOC -->

## Add Angular SSR

To begin, add Angular SSR to your project:

```
ng add @angular/ssr
```

Since we're using Angular >= 17, the `Hydration` feature is already added automatically to our `app.config.ts`. With Angular >= 19, **Event Replay** is also included:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    [...],
    provideClientHydration(withEventReplay()),
  ],
};
```

Now check your `package.json` for the new SSR script:

```json
"serve:ssr:ng-p3rf": "node dist/ng-p3rf/server/server.mjs"
```

or

```json
"serve:ssr:ng-b357": "node dist/ng-b357/server/server.mjs"
```

Now try SSR locally. Running a production build (`ng b`) creates a `server` folder with the server app inside it.

**Important note:**  
In recent Angular versions, **Prerendering is enabled by default**. No extra configuration is required. Just build your app and watch it prerender.

To disable prerendering, set `discoverRoutes` to `false` in `angular.json`:

```json
"server": "src/main.server.ts",
"prerender": {
  "discoverRoutes": false
},
"ssr": {
  "entry": "server.ts"
}
```

### Add RenderModes for certain routes

You can configure specific routes to use **CSR**, **SSR**, or **Prerendering** by editing `app.server.routes.ts`.

Example:

```typescript
export const serverRoutes: ServerRoute[] = [
  {
    path: 'deferred-charts',
    renderMode: RenderMode.Client, // render on client only
  },

  {
    path: 'dynamic-chart',
    renderMode: RenderMode.Server, // server-render on demand
  },

  {
    path: 'flights/flight-edit/:id',
    renderMode: RenderMode.Client, // :id requires getPrerenderParams for prerender
    /*async getPrerenderParams(): Promise<{ id: string }[]> {
      // API call to get the user IDs
      const flightIds = await inject(FlightService).getFlightIds();
      // build an array like [{ id: '1' }, { id: '2' }, { id: '3' }]
      return flightIds.map((id) => ({ id: '' + id }));
    },*/
  },

  {
    path: '**',
    renderMode: RenderMode.Prerender, // default prerendering
  },
];
```

Rebuild your app and verify that the specified routes have been excluded from prerendering.

### Add SSR getPrerenderParams() via API \*

You can use `getPrerenderParams()` to fetch all valid values for route parameters and automatically prerender all variations.

Full example:

```typescript
// added imports:
import { inject } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { FlightService } from './flights/flight.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'flights/flight-edit/:id',
    renderMode: RenderMode.Prerender, // use getPrerenderParams for prerender
    async getPrerenderParams(): Promise<{ id: string }[]> {
      // API call to get the user IDs
      return await lastValueFrom(
        inject(FlightService)
          .getAllIds()
          // build an array like [{ id: '1' }, { id: '2' }, { id: '3' }]
          .pipe(map((ids) => ids.map((id) => ({ id: '' + id })))),
      );
    },
  },
];
```

Add the required method to your `FlightService` (`src/app/flights/flight.service.ts`):

```typescript
export class FlightService {
  getAllIds(): Observable<number[]> {
    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.get<Flight[]>(this.url, { headers }).pipe(map((flights) => flights.map((f) => f.id)));
  }
}
```

Rebuild your application and verify that all edit routes have been prerendered correctly.

## Add Incremental Hydration

1. Replace `withEventReplay()` with `withIncrementalHydration()`.  
   This implicitly includes **Event Replay**.

2. If you completed the earlier lab on `@defer`, you can now attach hydration triggers.

Examples:

```angular2html
@case (1) {
  @defer (on immediate; hydrate never) {}
}

@case (2) {
  @defer (on viewport; hydrate on viewport) {}
}

@case (3) {
  @defer (on timer(4200ms); hydrate on hover) {}
}

@case (4) {
  @defer (on hover; hydrate on interaction) {}
}
```

3. Start your app using the `--no-hmr` flag to test hydration behavior.

4. Open Angular DevTools → Component Tree to inspect hydration state.

   Note: When using `hydrate never`, components do not appear in DevTools until hydrated manually.

### Add more examples

Open `FlightSearchComponent` and consider which sections could benefit from incremental hydration.

Add additional `@defer (hydrate on ...)` examples and be ready to present them.

### Check the docs and find your favorite trigger

Check out the ways to use `hydrate on` in the [official docs](https://angular.dev/guide/incremental-hydration).

What's your favorite trigger for hydration? Is it different to `@defer`? Prepare to report to the group.
