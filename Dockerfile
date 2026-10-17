FROM node:22-bookworm-slim AS frontend
WORKDIR /src/src/DCWS.MainSite.Web
COPY src/DCWS.MainSite.Web/package.json src/DCWS.MainSite.Web/package-lock.json ./
RUN npm ci
COPY src/DCWS.MainSite.Web/gulpfile.js src/DCWS.MainSite.Web/tsconfig.json ./
COPY src/DCWS.MainSite.Web/Scripts ./Scripts
COPY src/DCWS.MainSite.Web/Styles ./Styles
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY global.json ./
COPY src/DCWS.MainSite.Web/DCWS.MainSite.Web.csproj src/DCWS.MainSite.Web/
RUN dotnet restore src/DCWS.MainSite.Web/DCWS.MainSite.Web.csproj
COPY . .
COPY --from=frontend /src/src/DCWS.MainSite.Web/wwwroot/ src/DCWS.MainSite.Web/wwwroot/
RUN dotnet publish src/DCWS.MainSite.Web/DCWS.MainSite.Web.csproj \
    --configuration Release --no-restore --output /app/publish \
    -p:SkipFrontendBuild=true

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./
ENV ASPNETCORE_HTTP_PORTS=8080 \
    ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
USER $APP_UID
ENTRYPOINT ["dotnet", "DCWS.MainSite.Web.dll"]
