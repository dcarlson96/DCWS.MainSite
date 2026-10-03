using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DCWS.MainSite.Web.Tests;

public sealed class TestimonialsPageTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TestimonialsPageTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            AllowAutoRedirect = false
        });
    }

    [Fact]
    public async Task TestimonialsPage_RedirectsToHomeWhileHidden()
    {
        var response = await _client.GetAsync("/testimonials");

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal("/", response.Headers.Location?.OriginalString);
    }

    [Theory]
    [InlineData("/")]
    [InlineData("/Portfolio")]
    [InlineData("/address-lookup")]
    public async Task SharedNavigation_HidesDesktopAndMobileTestimonialsLinks(string path)
    {
        var response = await _client.GetAsync(path);
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.DoesNotContain(">Testimonials</a>", html);
        Assert.DoesNotContain("href=\"/testimonials\"", html);
    }

    [Fact]
    public async Task HomePage_HidesTestimonialsSectionAndViewAllLink()
    {
        var response = await _client.GetAsync("/");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.DoesNotContain("class=\"home-testimonials\"", html);
        Assert.DoesNotContain("What Clients Say", html);
        Assert.DoesNotContain("href=\"/testimonials\"", html);
        Assert.DoesNotContain("Replace this inactive example", html);
    }
}
