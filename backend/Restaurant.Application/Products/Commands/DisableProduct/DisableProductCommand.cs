using MediatR;

namespace Restaurant.Application.Products.Commands.DisableProduct;

public sealed record DisableProductCommand(
    int ProductId,
    long Version
) : IRequest;
