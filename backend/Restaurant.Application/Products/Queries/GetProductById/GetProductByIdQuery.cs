using MediatR;
using Restaurant.Application.Products.Responses;

namespace Restaurant.Application.Products.Queries.GetProductById;

public sealed record GetProductByIdQuery(
    int Id
) : IRequest<ProductResponse>;