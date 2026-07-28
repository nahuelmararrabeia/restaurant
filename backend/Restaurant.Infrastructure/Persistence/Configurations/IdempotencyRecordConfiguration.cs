using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Restaurant.Domain.Entities;

namespace Restaurant.Infrastructure.Persistence.Configurations;

public sealed class IdempotencyRecordConfiguration
    : IEntityTypeConfiguration<IdempotencyRecord>
{
    public void Configure(
        EntityTypeBuilder<IdempotencyRecord> builder)
    {
        builder.ToTable("IdempotencyRecords");
        builder.HasKey(record => record.Id);

        builder.Property(record => record.Operation)
            .HasMaxLength(50)
            .IsRequired();
        builder.Property(record => record.Key)
            .HasMaxLength(100)
            .IsRequired();
        builder.Property(record => record.RequestHash)
            .HasMaxLength(64)
            .IsRequired();

        builder.HasIndex(record => new
            {
                record.Operation,
                record.Key
            })
            .IsUnique();

        builder.HasOne(record => record.Order)
            .WithMany()
            .HasForeignKey(record => record.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
