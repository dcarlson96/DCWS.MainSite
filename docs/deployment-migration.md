# Deployment migration

## Current and target hosting models

| Area | Previous site | ASP.NET Core MVC site |
| --- | --- | --- |
| Application runtime | Vinext/Next-compatible Cloudflare Worker | ASP.NET Core 10 hosted by Kestrel |
| Build | npm, Vite, Vinext, Wrangler/Sites scripts | `dotnet restore`, `dotnet build`, `dotnet publish` |
| Hosting manifest | `.openai/hosting.json` | Host-specific configuration created during deployment setup |
| Static files | Vinext asset output | `wwwroot` served by ASP.NET Core |
| Database | Optional D1/Drizzle starter; not configured or used | None |

The old `.openai/hosting.json` declared both `d1` and `r2` as `null`. `db/schema.ts` was intentionally empty, and the website never read from `getDb()`. There is therefore no production data or schema to migrate and no reason to add EF Core at this stage.

## Why the old deployment files were removed

ChatGPT Sites expects an ECMAScript Worker artifact with a `fetch` entrypoint. A native ASP.NET Core process does not produce that artifact and cannot run in the existing Worker execution model. Keeping the Vinext, Wrangler, Node, and Drizzle configuration in the active application would imply that the old deployment path still works when it does not.

Removing the source manifest does not delete or alter the currently deployed version. It does mean future releases from this repository need a new .NET-capable deployment target.

## Recommended hosting strategy

Use **Azure App Service** as the first production target:

1. Create a Linux or Windows App Service using the .NET 10 runtime.
2. Deploy `src/DCWS.MainSite.Web/DCWS.MainSite.Web.csproj` from Visual Studio or a GitHub Actions deployment workflow.
3. Configure the production environment and health checks.
4. Add and validate `dcwebsystems.com` as a custom domain on the App Service.
5. Create the validation record in Cloudflare as DNS-only when the host requires it.
6. Point the website record to the App Service origin and enable Cloudflare proxying after origin validation.
7. Verify HTTPS, redirects, assets, email links, responsive layouts, logs, and rollback access.
8. Retain the existing Sites deployment until the new origin has been stable, then retire it separately.

Useful references:

- [Publish an ASP.NET Core app to Azure with Visual Studio](https://learn.microsoft.com/aspnet/core/tutorials/publish-to-azure-webapp-using-vs?view=aspnetcore-10.0)
- [Host and deploy ASP.NET Core](https://learn.microsoft.com/aspnet/core/host-and-deploy/?view=aspnetcore-10.0)
- [Cloudflare DNS proxy status](https://developers.cloudflare.com/dns/proxy-status/)

## Alternatives

Azure Container Apps, AWS App Runner/ECS, Google Cloud Run, Render, Fly.io, a Windows IIS server, or a Linux server behind Nginx can also host the published ASP.NET Core application. They add varying levels of container, server, and deployment management. For this small MVC site and a Visual Studio-centered workflow, App Service is the least surprising starting point.

## Rollback

Do not remove the current production deployment during the code migration. If the new origin has a problem after cutover, restore the previous Cloudflare DNS record or route while the issue is corrected. DNS values and the active production target should be recorded immediately before cutover.
