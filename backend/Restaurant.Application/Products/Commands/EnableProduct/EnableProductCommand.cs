using MediatR;

namespace Restaurant.Application.Products.Commands.EnableProduct;

public sealed record EnableProductCommand(
    int ProductId,
    long Version
) : IRequest;
