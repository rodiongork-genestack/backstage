# Analytics Module: Google Analytics

This plugin provides an opinionated implementation of the Backstage Analytics
API for Google Analytics. Once installed and configured, analytics events will
be sent to GA as your users navigate and use your Backstage instance.

This plugin contains no (and will never contain any) other functionality.

## Installation

1. Install this plugin in your Backstage app:
   `cd packages/app && yarn add @backstage/plugin-analytics-module-ga`
2. Register the plugin with your App. In most instances of Backstage, this is
   as simple as adding `export { analyticsModuleGA } from '@backstage/plugin-analytics-module-ga';`
   to your `packages/app/src/plugins.ts` file.
3. Configure the plugin (see below).

## Configuration

The following is the minimum configuration required to start sending analytics
events to GA. All that's needed is your Universal Analytics tracking ID:

```yaml
# app-config.yaml
app:
  analytics:
    provider: ga
    ga:
      trackingId: UA-0000000-0
```

### Plugin Analytics

In order to be able to analyze usage of your Backstage instance _by plugin_, we
strongly recommend configuring at least one custom dimension to capture Plugin
IDs associated with events, including page views.

1. First, [configure the custom dimension in GA][configure-custom-dimension].
   Be sure to set the Scope to `hit`, and name it something like `Plugin`. Note
   the index of the dimension you just created (e.g. `1`, if this is the first
   custom dimension you've created in your GA property).
2. Then, add a mapping to your `app.analytics.ga` configuration that instructs
   the plugin to capture Plugin IDs on the custom dimension you just created.
   It should look like this:

```yaml
app:
  analytics:
    provider: ga
    ga:
      trackingId: UA-0000000-0
      customDimensionsMetrics:
        - type: dimension
          index: 1
          source: domain
          attribute: pluginId
```

You can configure additional custom dimension and metric collection by adding
more entries to the `customDimensionsMetrics` array:

```yaml
app:
  analytics:
    ga:
      customDimensionsMetrics:
        - type: dimension
          index: 1
          source: domain
          attribute: pluginId
        - type: dimension
          index: 2
          source: domain
          attribute: routeRef
        - type: metric
          index: 1
          source: context
          attribute: someEventContextAttr
```

### Debugging and Testing

In pre-production environments, you may wish to set additional configurations
to turn off reporting to Analytics and/or print debug statements to the
console. You can do so like this:

```yaml
app:
  analytics:
    ga:
      testMode: true # Prevents data being sent to GA
      debug: true # Logs analytics event to the web console
```

## Development

If you would like to contribute improvements to this plugin, the easiest way to
make and test changes is to do the following:

1. Clone the main Backstage monorepo `git clone git@github.com:backstage/backstage.git`
2. Install all dependencies `yarn install`
3. If one does not exist, create an `app-config.local.yaml` file in the root of
   the monorepo and add config for this plugin (see below)
4. Enter this plugin's working directory: `cd plugins/analytics-provider-ga`
5. Start the plugin in isolation: `yarn start`
6. Navigate to the playground page at [/ga](http://localhost:3000/ga)
7. Open the web console to see events fire when you navigate or when you
   interact with instrumented components.

Code for the isolated version of the plugin can be found inside the [/dev](./dev)
directory. Changes to the plugin are hot-reloaded.

#### Recommended Dev Config

Paste this into your `app-config.local.yaml` while developing this plugin:

```yaml
app:
  analytics:
    provider: ga
    ga:
      trackingId: UA-0000000-0
      debug: true
      testMode: true
      customDimensionsMetrics:
        - type: dimension
          index: 1
          source: domain
          attribute: pluginId
```

[configure-custom-dimension]: https://support.google.com/analytics/answer/2709828?hl=en#configuration
