import { Route } from '@angular/router';

// import { HomeComponent } from './home/home.component';

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

  /*{
    path: '**',
    redirectTo: '',
  },*/
];
