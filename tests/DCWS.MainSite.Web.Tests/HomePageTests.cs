using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DCWS.MainSite.Web.Tests;

public sealed class HomePageTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public HomePageTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost")
        });
    }

    [Fact]
    public async Task HomePage_RendersBrandingMetadataAndSections()
    {
        var response = await _client.GetAsync("/");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/html", response.Content.Headers.ContentType?.MediaType);
        Assert.Contains("<title>DC Web Systems | Custom Web Applications</title>", html);
        Assert.Contains("Custom web applications, customer portals, APIs, and system integrations built in Boise, Idaho.", html);
        Assert.Contains("id=\"top\"", html);
        Assert.Contains("id=\"services\"", html);
        Assert.Contains("id=\"work\"", html);
        Assert.Contains("id=\"about\"", html);
        Assert.Contains("dylan@dcwebsystems.com", html);
        Assert.Contains($"© {DateTime.UtcNow.Year} DC Web Systems", html);
    }

    [Theory]
    [InlineData("/css/site.css", "text/css")]
    [InlineData("/fonts/dm-sans-latin.woff2", "font/woff2")]
    [InlineData("/fonts/manrope-latin.woff2", "font/woff2")]
    [InlineData("/images/favicon.svg", "image/svg+xml")]
    public async Task StaticAssets_AreServed(string path, string expectedMediaType)
    {
        var response = await _client.GetAsync(path);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(expectedMediaType, response.Content.Headers.ContentType?.MediaType);
    }
}
