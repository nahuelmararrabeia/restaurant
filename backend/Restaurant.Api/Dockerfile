FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Restaurant.Domain/Restaurant.Domain.csproj Restaurant.Domain/
COPY Restaurant.Application/Restaurant.Application.csproj Restaurant.Application/
COPY Restaurant.Infrastructure/Restaurant.Infrastructure.csproj Restaurant.Infrastructure/
COPY Restaurant.Api/Restaurant.Api.csproj Restaurant.Api/
RUN dotnet restore Restaurant.Api/Restaurant.Api.csproj

COPY . .
RUN dotnet publish Restaurant.Api/Restaurant.Api.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Restaurant.Api.dll"]
