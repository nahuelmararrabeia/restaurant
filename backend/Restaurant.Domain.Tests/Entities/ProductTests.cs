using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Tests.Entities;

public sealed class ProductTests
{
    [Fact]
    public void New_product_is_available()
    {
        var product = new Product();

        Assert.True(product.IsAvailable);
    }

    [Fact]
    public void Disable_marks_product_as_unavailable()
    {
        var product = new Product();

        product.Disable();

        Assert.False(product.IsAvailable);
    }

    [Fact]
    public void Enable_marks_product_as_available()
    {
        var product = new Product();
        product.Disable();

        product.Enable();

        Assert.True(product.IsAvailable);
    }

    [Fact]
    public void Update_replaces_product_data()
    {
        var product = new Product();

        product.Update("Coffee", "Hot drink", 1250);

        Assert.Equal("Coffee", product.Name);
        Assert.Equal("Hot drink", product.Description);
        Assert.Equal(1250, product.Price);
    }
}
