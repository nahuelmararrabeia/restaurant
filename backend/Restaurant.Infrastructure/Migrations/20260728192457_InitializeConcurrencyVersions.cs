using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitializeConcurrencyVersions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """UPDATE "Orders" SET "Version" = 1 WHERE "Version" = 0;""");
            migrationBuilder.Sql(
                """UPDATE "OrderItems" SET "Version" = 1 WHERE "Version" = 0;""");
            migrationBuilder.Sql(
                """UPDATE "Tables" SET "Version" = 1 WHERE "Version" = 0;""");
            migrationBuilder.Sql(
                """UPDATE "Products" SET "Version" = 1 WHERE "Version" = 0;""");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
