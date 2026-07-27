using MediatR;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Application.Products.Commands.CreateProduct;
using Restaurant.Application.Products.Commands.DeleteProduct;
using Restaurant.Application.Products.Commands.DisableProduct;
using Restaurant.Application.Products.Commands.EnableProduct;
using Restaurant.Application.Products.Commands.UpdateProduct;
using Restaurant.Application.Products.Queries.GetProductById;
using Restaurant.Application.Products.Queries.GetProducts;

namespace Restaurant.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(
            new GetProductsQuery(),
            cancellationToken);

        return Ok(response);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(
            new GetProductByIdQuery(id),
            cancellationToken);

        return Ok(response);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        CreateProductCommand command,
        CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(
            command,
            cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = response },
            response);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        int id,
        UpdateProductCommand command,
        CancellationToken cancellationToken)
    {
        command = command with { Id = id };

        await _mediator.Send(command, cancellationToken);

        return NoContent();
    }

    [HttpPatch("{id:int}/enable")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Enable(
        int id,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new EnableProductCommand(id),
            cancellationToken);

        return NoContent();
    }

    [HttpPatch("{id:int}/disable")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Disable(
        int id,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new DisableProductCommand(id),
            cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(
        int id,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new DeleteProductCommand(id),
            cancellationToken);

        return NoContent();
    }
}
