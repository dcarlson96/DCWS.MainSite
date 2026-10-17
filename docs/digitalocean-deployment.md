# DigitalOcean preview deployment

This branch contains a Dockerfile and a sample App Platform spec at `.do/app.yaml`. The spec points to `feature/digitalocean-migration`, disables deploy-on-push, and has no production domain. Creating an App Platform app or changing DNS is a separate deployment step.

Build from the repository root:

```sh
docker build -t dcws-mainsite:preview .
docker run --rm -p 8080:8080 dcws-mainsite:preview
```

Check `http://localhost:8080/`, `/css/site.css`, `/js/Layout.Main.js`, and `/fonts/dm-sans-latin.woff2`. The Node stage runs `npm ci` and Gulp from the lockfile. The .NET publish target is skipped only inside Docker because those assets have already been built and copied into the SDK stage. Normal `dotnet publish` still runs npm/Gulp.

For a DigitalOcean preview, create an app from `.do/app.yaml` and set `Apis__StatusApi`, `Apis__AddressLookupApi`, and `Apis__TestimonialsApi` to the preview API URL. Set `ArcGis__ApiKey` as a runtime secret if address lookup requires it. This key is rendered to browser HTML by `_ApiConfig.cshtml`; use a browser-restricted key, never a private server credential. Keep preview hosts separate from the production domain.

The container listens on HTTP port 8080 behind the platform TLS proxy. Check HTTPS redirects and canonical host behavior against the preview URL before changing production traffic. The existing Azure workflow is unchanged and still targets main. Record current DNS and Azure deployment details before any later cutover.
