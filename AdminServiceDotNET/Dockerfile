FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 7097

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["AdminServiceDotNET.csproj", "."]
RUN dotnet restore "./AdminServiceDotNET.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "AdminServiceDotNET.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AdminServiceDotNET.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AdminServiceDotNET.dll"]