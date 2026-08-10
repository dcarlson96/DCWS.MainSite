# DCWS.MainSite

The public website for **DC Web Systems**, implemented as a conventional server-rendered ASP.NET Core MVC application.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Visual Studio with the **ASP.NET and web development** workload, or any editor that supports the .NET CLI

Node.js and npm are not required.

## Run with Visual Studio

1. Clone the repository and open `DCWS.MainSite.sln`.
2. Confirm `DCWS.MainSite.Web` is the startup project.
3. Select the `DCWS.MainSite.Web` launch profile.
4. Press **F5** or the green Start button.

Visual Studio restores NuGet packages, starts the ASP.NET Core development server, opens the site in your configured browser, and supports normal C# breakpoints. The project launch profile uses `https://localhost:7173` and `http://localhost:5173`.

## Run with the .NET CLI

From the repository root:

```powershell
dotnet restore DCWS.MainSite.sln
dotnet build DCWS.MainSite.sln
dotnet test DCWS.MainSite.sln
dotnet run --project src/DCWS.MainSite.Web/DCWS.MainSite.Web.csproj
```

For automatic reload while editing:

```powershell
dotnet watch --project src/DCWS.MainSite.Web/DCWS.MainSite.Web.csproj
```

## Project structure

```text
DCWS.MainSite.sln
src/
  DCWS.MainSite.Web/
    Controllers/
    Models/
    Properties/
    Views/
      Home/
      Shared/
    wwwroot/
      css/
      fonts/
      images/
    Program.cs
    appsettings.json
    DCWS.MainSite.Web.csproj
tests/
  DCWS.MainSite.Web.Tests/
docs/
  deployment-migration.md
```

The site uses Razor views and plain CSS. It has no SPA, React, Vite, TypeScript, or client-side package-manager runtime. Add JavaScript under `wwwroot` only when a feature actually requires browser-side behavior.

## Tests

`DCWS.MainSite.Web.Tests` starts the MVC application in memory and verifies:

- the home page returns successful HTML;
- branding, metadata, navigation targets, and primary sections render; and
- CSS, fonts, and the favicon are served successfully.

Run the suite from Test Explorer or with `dotnet test DCWS.MainSite.sln`.

## Deployment

The previous implementation produced a Vinext/Cloudflare Worker artifact for ChatGPT Sites. ASP.NET Core runs as a .NET server process and cannot be deployed with that build pipeline. The former Sites/Vinext manifest, Worker entrypoint, and npm build scripts have therefore been removed from this application branch.

The existing production deployment is not changed by running this branch. Before directing `dcwebsystems.com` to the MVC application, provision a .NET-capable host and complete a controlled DNS cutover. Azure App Service is the recommended first option because it has direct ASP.NET Core and Visual Studio support. Cloudflare can remain the DNS, proxy, CDN, and WAF layer in front of the new origin.

See [docs/deployment-migration.md](docs/deployment-migration.md) for the migration and rollback plan.
