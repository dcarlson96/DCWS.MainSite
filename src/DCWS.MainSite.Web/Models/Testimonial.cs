namespace DCWS.MainSite.Web.Models;

public sealed class Testimonial
{
    public string Name { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string Review { get; set; } = string.Empty;
    public string? ProjectType { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}
