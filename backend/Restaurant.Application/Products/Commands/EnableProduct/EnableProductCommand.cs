using MediatR;

namespace Restaurant.Application.Products.Commands.EnableProduct;

public sealed record EnableProductCommand(
    int ProductId
) : IRequest;