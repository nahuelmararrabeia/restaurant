using MediatR;

namespace Restaurant.Application.Products.Commands.CreateProduct;

public sealed record CreateProductCommand(
    string Name,
    string? Description,
    decimal Price
) : IRequest<int>;