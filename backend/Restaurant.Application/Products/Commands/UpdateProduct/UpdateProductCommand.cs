using MediatR;

namespace Restaurant.Application.Products.Commands.UpdateProduct;

public sealed record UpdateProductCommand(
    int Id,
    string Name,
    string? Description,
    decimal Price
) : IRequest;