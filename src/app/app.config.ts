import { ApplicationConfig, isDevMode, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withViewTransitions(),
      // withDebugTracing(),
      // withEnabledBlockingInitialNavigation()
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
