import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';

import { lastValueFrom, map } from 'rxjs';

import { FlightService } from './flights/flight.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'deferred-charts',
    renderMode: RenderMode.Client, // render on client
  },

  {
    path: 'dynamic-chart',
    renderMode: RenderMode.Server, // on-demand render on server
  },

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

  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
