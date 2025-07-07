# Lab 01 Performance Audits

In this lab, we'll get to know my favorite **audit tools** for _Angular_ performance measurement.

**Lab time:** 30–45 minutes

## Table of Contents

<!-- TOC -->

- [Web Performance Audit](#web-performance-audit)
  - [Bonus: Analyze results](#bonus-analyze-results)
  - [Bonus: Add gzip locally (only Linux & Mac)](#bonus-add-gzip-locally-only-linux--mac)
- [Angular Build Analysis](#angular-build-analysis)
  - [Source Map Explorer](#source-map-explorer)
  - [or use Webpack Bundle Analyzer (if still using webpack)](#or-use-webpack-bundle-analyzer-if-still-using-webpack)
- [Bonus: Import Graph Visualizer](#bonus-import-graph-visualizer)
<!-- TOC -->

## Web Performance Audit

The first task is to measure the overall web performance of an _Angular_ application.

1. Choose an _Angular App_ for this lab. You need the source code. The best option is a workspace from your own work, your team, or your company. If you currently don't have access to any _Angular workspace_, you can use the example application.
2. Check the configuration in `angular.json` and then run a production build. Typically, if production is the default configuration, run:

   ```shell
   ng b
   ```

   Otherwise (assuming "production" is the name of the build configuration):

   ```shell
   ng b -c production
   ```

3. Serve your _Angular build_ on localhost. You can either:
   - use something like MAMP/WAMP/XAMPP,
   - edit your hosts file manually, or
   - use `serve` with these commands:

   ```shell
   npm i -g serve
   ```

   Now switch to the directory containing the build (e.g. `dist/[app-name]/browser`) and run:

   ```shell
   serve -s
   ```

   Note: the `-s` parameter rewrites all requests to `index.html`, which is what we want for an _Angular App_ **without SSR**. Alternatively, you can use this handy command:

   ```shell
   npx serve dist/ng-b357/browser -s
   ```

4. Now open the _Angular App_ in Chrome and make sure you have the _Lighthouse_ extension installed.
5. Optionally prepare an _Audit Document_. You can copy my **[Google Docs Template](https://docs.google.com/document/d/1AQgAwHoHvasmT43HUlSr3THifj-WHD_wwJQRhd0KG64/edit)** into your Google Drive account or - if you don't have Drive - use one of the templates in this folder. Fill in the _[X]_, _[Y]_, and _[Z]_ placeholders.
6. Open Chrome DevTools, switch to the _Lighthouse_ tab, and run it for "**Mobile**" and "**Performance**".
7. Optionally fill in the metrics in the _Audit Document_ and identify things to improve.
8. Prepare to share your findings.
9. Stop your `serve` process with `Ctrl+C`.

### Bonus: Analyze results

Interpret your Lighthouse results and identify the issues.

### Bonus: Add gzip locally (only Linux & Mac)

1. Install **Caddy**: https://caddyserver.com/docs/install
2. Check the `Caddyfile` in the project’s root directory. It adds **gzip** compression for all files by using a local reverse proxy.
3. Build and serve your app again:

   ```shell
   ng b && npx serve dist/ng-b357/browser -s
   ```

4. Start Caddy:

   ```shell
   caddy start
   ```

5. Access your app at http://localhost:4210.
6. Stop Caddy:

   ```shell
   caddy stop
   ```

7. Stop `serve` with `Ctrl+C`.

## Angular Build Analysis

### Source Map Explorer

The `Source Map Explorer` helps analyze the size of your JavaScript bundles.

1. Create the source maps and explore them by running this commands (replace `ng-b357` with your App's name):

   ```shell
   ng b --source-map
   npx source-map-explorer dist/ng-b357/browser/**/*.js --no-border-checks
   ```

2. Analyse your build and prepare to share your findings with the other workshop participants

### or use Webpack Bundle Analyzer (if still using webpack)

#### For NG < 16 (or >= 16 and not yet using Vite/esbuild)

Look into your `package.json` again. There you'll find some scripts to build the app including a `stats.json` file which will then be used by `Webpack Bundle Analyzer` to create a nice tree map of your build.

1. Create the treemap by running the commands (replace `ng-b357` with your App's name):

   ```shell
   ng b --stats-json
   npx webpack-bundle-analyzer dist/ng-b357/stats.json
   ```

2. Analyse your build and prepare to share your findings with the other workshop participants

## Bonus: Import Graph Visualizer

In your `package.json` there is another script for running the `Import Graph Visualizer` (from my friends at [RxAngular](https://github.com/rx-angular/import-graph-visualizer)). Once it starts, you should select your `src/main.ts` as the **Import source** to see all imports in the whole app. You can then select an **Import target**, like for example `@angular/core/rxjs-interop` - to see if the app is already using that package.

Note that `Import Graph Visualizer` even follows lazy-loading imports via the `app.routes.ts` and shows them with dashed lines.

```shell
npx @rx-angular/import-graph-visualizer --entry-points src/main.ts --ts-config tsconfig.app.json
```

Please note: If you want to run the `Import Graph Visualizer` for your own _Angular App_, you may need to adjust the paths of the `main.ts` and the `tsconfig.json` from the command.
