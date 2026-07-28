using MediatR;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Application.Tables.Commands.CreateTable;
using Restaurant.Application.Tables.Commands.DeleteTable;
using Restaurant.Application.Tables.Commands.DisableTable;
using Restaurant.Application.Tables.Commands.EnableTable;
using Restaurant.Application.Tables.Commands.OccupyTable;
using Restaurant.Application.Tables.Commands.ReleaseTable;
using Restaurant.Application.Tables.Commands.ReserveTable;
using Restaurant.Application.Tables.Commands.UpdateTable;
using Restaurant.Application.Tables.Commands.UpdateTablePosition;
using Restaurant.Application.Tables.Queries.GetTableById;
using Restaurant.Application.Tables.Queries.GetTables;

namespace Restaurant.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TablesController : ControllerBase
{
    private readonly ISender _sender;

    public TablesController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var response = await _sender.Send(new GetTablesQuery(), cancellationToken);
        return Ok(response);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(new GetTableByIdQuery(id), cancellationToken);
        return Ok(response);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create(
        [FromBody] CreateTableCommand command,
        CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id },
            new { id });
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateTableCommand command,
        CancellationToken cancellationToken)
    {
        command = command with { Id = id };

        await _sender.Send(command, cancellationToken);

        return NoContent();
    }

    [HttpPatch("{id:int}/reserve")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Reserve(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new ReserveTableCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:int}/occupy")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Occupy(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new OccupyTableCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:int}/release")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Release(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new ReleaseTableCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:int}/enable")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Enable(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new EnableTableCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:int}/disable")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Disable(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DisableTableCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:int}/position")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdatePosition(
        int id,
        [FromBody] UpdateTablePositionCommand command,
        CancellationToken cancellationToken)
    {
        command = command with { Id = id };

        await _sender.Send(command, cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteTableCommand(id), cancellationToken);
        return NoContent();
    }
}
