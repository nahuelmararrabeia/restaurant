using MediatR;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Application.Orders.Commands.AddOrderItem;
using Restaurant.Application.Orders.Commands.CancelOrder;
using Restaurant.Application.Orders.Commands.CreateOrder;
using Restaurant.Application.Orders.Commands.DeliverOrder;
using Restaurant.Application.Orders.Commands.MarkOrderReady;
using Restaurant.Application.Orders.Commands.RemoveOrderItem;
using Restaurant.Application.Orders.Commands.StartPreparingOrder;
using Restaurant.Application.Orders.Commands.UpdateOrderItem;
using Restaurant.Application.Orders.Queries.GetOrderById;
using Restaurant.Application.Orders.Queries.GetOrders;
using Restaurant.Application.Orders.Responses;
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
        CancellationToken cancellationToken,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 9)
    {
        var response = await _sender.Send(
            new GetOrdersQuery(status, page, pageSize),
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
        [FromHeader(Name = "Idempotency-Key")] string idempotencyKey,
        CancellationToken cancellationToken)
    {
        command = command with { IdempotencyKey = idempotencyKey };

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
        [FromHeader(Name = "Idempotency-Key")] string idempotencyKey,
        CancellationToken cancellationToken)
    {
        command = command with
        {
            OrderId = id,
            IdempotencyKey = idempotencyKey
        };

        var response = await _sender.Send(command, cancellationToken);

        return Ok(response);
    }

    [HttpPut("{id:int}/items/{orderItemId:int}")]
    [ProducesResponseType(typeof(OrderDetailsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<OrderResponse>> UpdateItem(
    int id,
    int orderItemId,
    [FromBody] UpdateOrderItemCommand command,
    CancellationToken cancellationToken)
    {
        var response = await _sender.Send(
            new UpdateOrderItemCommand(
                id,
                orderItemId,
                command.Quantity,
                command.Notes,
                command.Version,
                command.ItemVersion),
            cancellationToken);

        return Ok(response);
    }

    [HttpDelete("{id:int}/items/{orderItemId:int}")]
    [ProducesResponseType(typeof(OrderDetailsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveItem(
        int id,
        int orderItemId,
        [FromQuery] long version,
        [FromQuery] long itemVersion,
        CancellationToken cancellationToken)
    {
        var response = await _sender.Send(
            new RemoveOrderItemCommand(
                id,
                orderItemId,
                version,
                itemVersion),
            cancellationToken);

        return Ok(response);
    }

    [HttpPatch("{id:int}/preparing")]
    [ProducesResponseType(typeof(OrderDetailsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> StartPreparing(
        int id,
        [FromBody] Restaurant.Api.Models.VersionRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _sender.Send(
            new StartPreparingOrderCommand(id, request.Version),
            cancellationToken);

        return Ok(response);
    }

    [HttpPatch("{id:int}/ready")]
    [ProducesResponseType(typeof(OrderDetailsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> MarkReady(
        int id,
        [FromBody] Restaurant.Api.Models.VersionRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _sender.Send(
            new MarkOrderReadyCommand(id, request.Version),
            cancellationToken);

        return Ok(response);
    }

    [HttpPatch("{id:int}/deliver")]
    [ProducesResponseType(typeof(OrderDetailsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Deliver(
        int id,
        [FromBody] Restaurant.Api.Models.VersionRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _sender.Send(
            new DeliverOrderCommand(id, request.Version),
            cancellationToken);

        return Ok(response);
    }

    [HttpPatch("{id:int}/cancel")]
    [ProducesResponseType(typeof(OrderDetailsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Cancel(
        int id,
        [FromBody] Restaurant.Api.Models.VersionRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _sender.Send(
            new CancelOrderCommand(id, request.Version),
            cancellationToken);

        return Ok(response);
    }
}
