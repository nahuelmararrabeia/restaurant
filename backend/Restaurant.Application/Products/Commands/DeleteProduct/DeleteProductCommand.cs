using MediatR;

namespace Restaurant.Application.Products.Commands.DeleteProduct;

public sealed record DeleteProductCommand(
    int Id,
    long Version
) : IRequest;
