using NSubstitute;
using Restaurant.Application.Common.Exceptions;
using Restaurant.Application.Products.Commands.CreateProduct;
using Restaurant.Application.Products.Commands.DeleteProduct;
using Restaurant.Application.Products.Commands.DisableProduct;
using Restaurant.Application.Products.Commands.EnableProduct;
using Restaurant.Application.Products.Commands.UpdateProduct;
using Restaurant.Application.Products.Queries.GetProductById;
using Restaurant.Application.Products.Queries.GetProducts;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Tests.Products;

public sealed class ProductHandlerTests
{
    private readonly IProductRepository _products =
        Substitute.For<IProductRepository>();
    private readonly IOrderItemRepository _orderItems =
        Substitute.For<IOrderItemRepository>();

    [Fact]
    public async Task Create_trims_and_persists_product()
    {
        var handler = new CreateProductCommandHandler(_products);

        await handler.Handle(
            new CreateProductCommand(" Burger ", " Tasty ", 1200),
            TestContext.Current.CancellationToken);

        await _products.Received(1).AddAsync(
            Arg.Is<Product>(product =>
                product.Name == "Burger" &&
                product.Description == "Tasty" &&
                product.Price == 1200),
            Arg.Any<CancellationToken>());
        await _products.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Update_changes_and_persists_product()
    {
        var product = new Product { Version = 1 };
        _products.GetByIdAsync(1, Arg.Any<CancellationToken>())
            .Returns(product);

        await new UpdateProductCommandHandler(_products).Handle(
            new UpdateProductCommand(1, " Coffee ", " Hot ", 900, 1),
            TestContext.Current.CancellationToken);

        Assert.Equal("Coffee", product.Name);
        Assert.Equal("Hot", product.Description);
        Assert.Equal(900, product.Price);
        await _products.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Update_rejects_a_stale_version()
    {
        var product = new Product { Version = 2 };
        _products.GetByIdAsync(1, Arg.Any<CancellationToken>())
            .Returns(product);

        var exception = await Assert.ThrowsAsync<ConflictException>(() =>
            new UpdateProductCommandHandler(_products).Handle(
                new UpdateProductCommand(
                    1,
                    "Coffee",
                    null,
                    900,
                    1),
                TestContext.Current.CancellationToken));

        Assert.Contains("modified by another operation", exception.Message);
        await _products.DidNotReceive().SaveChangesAsync(
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Enable_enables_product()
    {
        var product = new Product { Version = 1 };
        product.Disable();
        _products.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(product);

        await new EnableProductCommandHandler(_products).Handle(
            new EnableProductCommand(1, 1),
            TestContext.Current.CancellationToken);

        Assert.True(product.IsAvailable);
    }

    [Fact]
    public async Task Disable_disables_product()
    {
        var product = new Product { Version = 1 };
        _products.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(product);

        await new DisableProductCommandHandler(_products).Handle(
            new DisableProductCommand(1, 1),
            TestContext.Current.CancellationToken);

        Assert.False(product.IsAvailable);
    }

    [Fact]
    public async Task Delete_removes_unused_product()
    {
        var product = new Product { Id = 1, Version = 1 };
        _products.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(product);
        _orderItems.ExistsByProductIdAsync(1, Arg.Any<CancellationToken>())
            .Returns(false);

        await new DeleteProductCommandHandler(_products, _orderItems).Handle(
            new DeleteProductCommand(1, 1),
            TestContext.Current.CancellationToken);

        _products.Received(1).Delete(product);
        await _products.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Delete_rejects_product_used_in_orders()
    {
        _products.GetByIdAsync(1, Arg.Any<CancellationToken>())
            .Returns(new Product { Id = 1, Version = 1 });
        _orderItems.ExistsByProductIdAsync(1, Arg.Any<CancellationToken>())
            .Returns(true);

        await Assert.ThrowsAsync<ConflictException>(() =>
            new DeleteProductCommandHandler(_products, _orderItems).Handle(
                new DeleteProductCommand(1, 1),
                TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task GetById_maps_product()
    {
        _products.GetByIdAsync(1, Arg.Any<CancellationToken>())
            .Returns(new Product
            {
                Id = 1,
                Name = "Coffee",
                Description = "Hot",
                Price = 900
            });

        var result = await new GetProductByIdQueryHandler(_products).Handle(
            new GetProductByIdQuery(1),
            TestContext.Current.CancellationToken);

        Assert.Equal("Coffee", result.Name);
        Assert.Equal(900, result.Price);
    }

    [Fact]
    public async Task GetAll_maps_products()
    {
        _products.GetAllAsync(Arg.Any<CancellationToken>())
            .Returns([new Product { Id = 1, Name = "Coffee", Price = 900 }]);

        var result = await new GetProductsQueryHandler(_products).Handle(
            new GetProductsQuery(),
            TestContext.Current.CancellationToken);

        Assert.Single(result);
        Assert.Equal("Coffee", result[0].Name);
    }
}
