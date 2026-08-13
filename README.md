# DCWS.MainSite

The public website for DC Web Systems, built as a conventional server-rendered ASP.NET Core MVC application to showcase services, highlight portfolio projects, and provide information for prospective clients.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Visual Studio with the **ASP.NET and web development** workload, or any editor that supports the .NET CLI
- [Node.js](https://nodejs.org/) (LTS) and npm, only if you plan to edit front-end source (TypeScript/SCSS) under `Scripts/`/`Styles/` and rebuild the generated assets

Generated CSS/JS under `wwwroot/css` and `wwwroot/js` are committed to the repository, so Node.js is **not** required just to build and run the site.

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
      Portfolio/
      Shared/
    Scripts/
      site.ts
    Styles/
      site.scss
      _variables.scss
      _base.scss
      home/
        _home.scss
      portfolio/
        _portfolio.scss
    wwwroot/
      css/
      fonts/
      images/
      js/
    Program.cs
    appsettings.json
    gulpfile.js
    package.json
    tsconfig.json
    DCWS.MainSite.Web.csproj
tests/
  DCWS.MainSite.Web.Tests/
docs/
  deployment-migration.md
```

The site uses Razor views for markup. There is no SPA, React, Vite, or client-side module runtime shipped to the browser.

## Front-end asset workflow

Front-end source lives outside `wwwroot`:

- `Scripts/**/*.ts` — hand-authored TypeScript, compiled and minified into `wwwroot/js`
- `Styles/**/*.scss` — hand-authored Sass, compiled and minified into `wwwroot/css`

[Gulp](https://gulpjs.com/) drives the build. Edit the `.ts`/`.scss` source files, **not** the generated files under `wwwroot/css`/`wwwroot/js` — those are build output and will be overwritten.

From `src/DCWS.MainSite.Web`:

```powershell
cd src/DCWS.MainSite.Web
npm install
npm run build
```

`npm run build` compiles `Styles/site.scss` → `wwwroot/css/site.css` and `Scripts/site.ts` → `wwwroot/js/site.js`, with source maps for debugging.

While actively editing front-end source, run the watcher to rebuild on save:

```powershell
npm run watch
```

Generated assets under `wwwroot/css` and `wwwroot/js` are currently committed to the repository so the site can be built and run from Visual Studio without Node.js installed. `dotnet publish` (including the CI/CD pipeline) automatically runs `npm ci` and `npm run build` before publishing, so published output always reflects the latest front-end source — see the `BuildFrontendAssets` MSBuild target in `DCWS.MainSite.Web.csproj`. This does not run during normal incremental `dotnet build`/F5, so local C# development is unaffected.

## Tests

`DCWS.MainSite.Web.Tests` starts the MVC application in memory and verifies:

- the home page returns successful HTML;
- branding, metadata, navigation targets, and primary sections render; and
- CSS, fonts, and the favicon are served successfully.

Run the suite from Test Explorer or with `dotnet test DCWS.MainSite.sln`.

## Deployment

`.github/workflows/azure-app-service.yml` restores, builds, tests, and publishes the .NET 10 MVC web project, signs in to Azure with GitHub Actions OpenID Connect (OIDC), and deploys the published output to the Windows App Service `dcwebsystems-prod`. It runs after a push to `main` and can also be started manually from the GitHub Actions page. Manual runs must use the `main` branch; runs from any other ref are skipped.

Create these repository secrets under **Settings > Secrets and variables > Actions**:

| Secret | Value |
| --- | --- |
| `AZURE_CLIENT_ID` | Client ID of the Azure user-assigned managed identity |
| `AZURE_TENANT_ID` | Microsoft Entra directory (tenant) ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID containing the App Service |

No publish profile, client secret, service-principal password, GitHub PAT, or basic-authentication credential is used.

### Azure identity and access setup

1. In resource group `DCWebSystems`, create a user-assigned managed identity for this deployment workflow.
2. On that identity, add a federated credential for GitHub Actions with:
   - Issuer: `https://token.actions.githubusercontent.com`
   - Audience: `api://AzureADTokenExchange`
   - Subject: `repo:dcarlson96@62816103/DCWS.MainSite@1329375297:ref:refs/heads/main`
3. On App Service `dcwebsystems-prod`, open **Access control (IAM)** and assign the identity the **Website Contributor** role. Scope the assignment to this App Service resource, not the resource group or subscription.
4. Copy the identity's client ID, tenant ID, and subscription ID into the three GitHub repository secrets listed above.

The subject uses GitHub's immutable owner and repository IDs and permits Azure login only for workflows running from `main`. If the repository's GitHub OIDC settings preview a different subject, use that exact preview value for the Azure federated credential.

To deploy manually after the workflow is present on `main`, open **Actions > Deploy to Azure App Service > Run workflow**, select `main`, and choose **Run workflow**.

See [docs/deployment-migration.md](docs/deployment-migration.md) for the hosting migration and rollback plan.
