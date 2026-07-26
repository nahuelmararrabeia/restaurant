using MediatR;
using Restaurant.Application.Products.Responses;

namespace Restaurant.Application.Products.Queries.GetProducts;

public sealed record GetProductsQuery : IRequest<List<ProductResponse>>;