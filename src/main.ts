import { enableProfiling } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

enableProfiling();

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
