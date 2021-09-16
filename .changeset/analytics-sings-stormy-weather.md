---
'@backstage/core-app-api': patch
---

The Core App API now automatically instruments all route location changes using
the new Analytics API. Each location change triggers a `navigate` event, which
is an analogue of a "pageview" event in traditional web analytics systems. In
addition to the path, these events provide plugin-level metadata via the
analytics domain, which can be useful for analyzing plugin usage:

```json
{
  "verb": "navigate",
  "noun": "/the-path/navigated/to?with=params#and-hashes",
  "domain": {
    "componentName": "App",
    "pluginId": "id-of-plugin-that-exported-the-route",
    "routeRef": "associated-route-ref-id"
  }
}
```

These events can be identified and handled by checking for the verb `navigate`
and the componentName `App`.
