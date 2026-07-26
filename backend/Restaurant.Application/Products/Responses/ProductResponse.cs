namespace Restaurant.Application.Products.Responses;

public sealed record ProductResponse(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    bool IsAvailable);