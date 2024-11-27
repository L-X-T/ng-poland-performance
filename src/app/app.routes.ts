import { Route } from '@angular/router';

import { HomeComponent } from './home/home.component';
// import flightRoutes from './flights/flights.routes';
// import { ChartsComponent } from './charts/charts.component';
// import { DynamicChartComponent } from './dynamic-chart/dynamic-chart.component';
// import { DeferredChartsComponent } from './deferred-charts/deferred-charts.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
  },

  {
    path: 'flights',
    // children: flightRoutes,
    loadChildren: () => import('./flights/flights.routes'),
  },

  {
    path: 'charts',
    // component: ChartsComponent,
    loadComponent: () => import('./charts/charts.component'),
  },

  {
    path: 'dynamic-chart',
    loadComponent: () => import('./dynamic-chart/dynamic-chart.component'),
  },

  {
    path: 'deferred-charts',
    loadComponent: () => import('./deferred-charts/deferred-charts.component'),
  },

  /*{
    path: '**',
    redirectTo: '',
  },*/
];
