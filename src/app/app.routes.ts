import { Route } from '@angular/router';

// import { HomeComponent } from './home/home.component';
import { DynamicChartComponent } from './dynamic-chart/dynamic-chart.component';

// import flightRoutes from './flights/flights.routes';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
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
    component: DynamicChartComponent, // omit lazy loading to demonstrate dynamic loading
  },

  /*{
    path: '**',
    redirectTo: '',
  },*/
];
