using System.Text.Json;
using DCWS.MainSite.Web.Models;

namespace DCWS.MainSite.Web.Services;

public sealed class TestimonialService(
    IWebHostEnvironment environment,
    ILogger<TestimonialService> logger) : ITestimonialService
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    public async Task<IReadOnlyList<Testimonial>> GetPublishedAsync(CancellationToken cancellationToken = default)
    {
        var filePath = Path.Combine(environment.ContentRootPath, "Data", "testimonials.json");

        try
        {
            await using var stream = File.OpenRead(filePath);
            var testimonials = await JsonSerializer.DeserializeAsync<List<Testimonial>>(
                stream,
                SerializerOptions,
                cancellationToken) ?? [];

            return testimonials
                .Where(testimonial => testimonial.IsActive)
                .OrderBy(testimonial => testimonial.DisplayOrder)
                .ToList();
        }
        catch (Exception exception) when (exception is IOException or JsonException)
        {
            logger.LogError(exception, "Unable to load published testimonials from {FilePath}.", filePath);
            return [];
        }
    }
}
