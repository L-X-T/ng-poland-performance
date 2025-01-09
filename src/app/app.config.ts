import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideImageKitLoader('https://ik.imagekit.io/LXT'),
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig): string => {
        return `https://ik.imagekit.io/LXT/tr:w-${config.width}/${config.src}`;
      },
    },
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      // withDebugTracing(),
      // withEnabledBlockingInitialNavigation()
    ),
  ],
};
