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
        Assert.Contains("src=\"/images/dylan-carlson-headshot.webp\"", html);
        Assert.Contains("alt=\"Dylan Carlson, founder and software developer at DC Web Systems\"", html);
        Assert.Contains("loading=\"lazy\"", html);
        Assert.Contains("dylan@dcwebsystems.com", html);
        Assert.Contains($"© {DateTime.UtcNow.Year} DC Web Systems", html);
    }

    [Fact]
    public async Task HomePage_FeaturesOnlyTheTwoPublishedProjects()
    {
        var response = await _client.GetAsync("/");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("Address &amp; District Lookup", html);
        Assert.Contains("Utility Outage Map", html);
        Assert.Contains("href=\"/address-lookup\"", html);
        Assert.Contains("href=\"/Portfolio\"", html);
        Assert.Contains("Professional contribution to an Idaho Power product.", html);
        Assert.Contains("DC Web Systems is not affiliated with or endorsed by Idaho Power.", html);
        Assert.Contains("href=\"https://tools.idahopower.com/outage\" target=\"_blank\" rel=\"noopener noreferrer\"", html);
        Assert.DoesNotContain("Customer information transition", html);
        Assert.DoesNotContain("Secure access management", html);
        Assert.Equal(2, CountOccurrences(html, "<article class=\"work-"));
    }

    [Theory]
    [InlineData("/")]
    [InlineData("/Portfolio")]
    [InlineData("/address-lookup")]
    public async Task SharedNavigation_IncludesDesktopAndMobileHomeLinks(string path)
    {
        var response = await _client.GetAsync(path);
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(2, CountOccurrences(html, ">Home</a>"));
        Assert.Contains("href=\"/\">Home</a>", html);
        Assert.Matches(
            "<a(?=[^>]*href=\"/\")(?=[^>]*data-bind=\"click: closeNav\")[^>]*>Home</a>",
            html);
    }

    [Theory]
    [InlineData("/css/site.css", "text/css")]
    [InlineData("/fonts/dm-sans-latin.woff2", "font/woff2")]
    [InlineData("/fonts/manrope-latin.woff2", "font/woff2")]
    [InlineData("/images/favicon.svg", "image/svg+xml")]
    [InlineData("/images/dylan-carlson-headshot.webp", "image/webp")]
    public async Task StaticAssets_AreServed(string path, string expectedMediaType)
    {
        var response = await _client.GetAsync(path);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(expectedMediaType, response.Content.Headers.ContentType?.MediaType);
    }

    private static int CountOccurrences(string value, string searchValue) =>
        value.Split(searchValue, StringSplitOptions.None).Length - 1;
}
