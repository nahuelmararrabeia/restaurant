using MediatR;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Application.Orders.Commands.AddOrderItem;
using Restaurant.Application.Orders.Commands.CancelOrder;
using Restaurant.Application.Orders.Commands.CreateOrder;
using Restaurant.Application.Orders.Commands.DeliverOrder;
using Restaurant.Application.Orders.Commands.MarkOrderReady;
using Restaurant.Application.Orders.Commands.RemoveOrderItem;
using Restaurant.Application.Orders.Commands.StartPreparingOrder;
using Restaurant.Application.Orders.Queries.GetOrderById;
using Restaurant.Application.Orders.Queries.GetOrders;
using Restaurant.Domain.Enums;

namespace Restaurant.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class OrdersController : ControllerBase
{
    private readonly ISender _sender;

    public OrdersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] OrderStatus? status,
        CancellationToken cancellationToken)
    {
        var response = await _sender.Send(
            new GetOrdersQuery(status),
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
        var response = await _sender.Send(
            new GetOrderByIdQuery(id),
            cancellationToken);

        return Ok(response);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        CreateOrderCommand command,
        CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id },
            new { id });
    }

    [HttpPost("{id:int}/items")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddItem(
        int id,
        AddOrderItemCommand command,
        CancellationToken cancellationToken)
    {
        command = command with { OrderId = id };

        var response = await _sender.Send(command, cancellationToken);

        return Ok(response);
    }

    [HttpDelete("{id:int}/items/{orderItemId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveItem(
        int id,
        int orderItemId,
        CancellationToken cancellationToken)
    {
        await _sender.Send(
            new RemoveOrderItemCommand(id, orderItemId),
            cancellationToken);

        return NoContent();
    }

    [HttpPatch("{id:int}/preparing")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> StartPreparing(
        int id,
        CancellationToken cancellationToken)
    {
        await _sender.Send(
            new StartPreparingOrderCommand(id),
            cancellationToken);

        return NoContent();
    }

    [HttpPatch("{id:int}/ready")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> MarkReady(
        int id,
        CancellationToken cancellationToken)
    {
        await _sender.Send(
            new MarkOrderReadyCommand(id),
            cancellationToken);

        return NoContent();
    }

    [HttpPatch("{id:int}/deliver")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Deliver(
        int id,
        CancellationToken cancellationToken)
    {
        await _sender.Send(
            new DeliverOrderCommand(id),
            cancellationToken);

        return NoContent();
    }

    [HttpPatch("{id:int}/cancel")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Cancel(
        int id,
        CancellationToken cancellationToken)
    {
        await _sender.Send(
            new CancelOrderCommand(id),
            cancellationToken);

        return NoContent();
    }
}