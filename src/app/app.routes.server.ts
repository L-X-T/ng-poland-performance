import { RenderMode, ServerRoute } from '@angular/ssr';

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
    renderMode: RenderMode.Client, // :id needs getPrerenderParams for prerender
    /*async getPrerenderParams(): Promise<{ id: string }[]> {
      // API call to get the user IDs
      const flightIds = await inject(FlightService).getFlightIds();
      // build an array like [{ id: '1' }, { id: '2' }, { id: '3' }]
      return flightIds.map((id) => ({ id: '' + id }));
    },*/
  },

  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
