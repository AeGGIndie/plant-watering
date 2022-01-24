using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

/* Injections */
var connectionString = builder.Configuration["ConnectionStrings:DefaultConnection"];
var PORT = builder.Configuration["PORT"];

builder.Services.AddCors(options =>
{
  options.AddPolicy(name: MyAllowSpecificOrigins,
                    builder =>
                    {
                      builder.WithOrigins("http://localhost:3000")
                      .AllowAnyMethod();
                    });
});

builder.Services.AddDbContext<ApiDbContext>(options =>
  options.UseSqlite(connectionString));

// builder.Services.AddSingleton<PlantRepository>();
var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);

app.MapGet("/plants", async (ApiDbContext db) =>
{
  return await db.Plants.ToListAsync();
});

app.MapGet("/plants/{id}", async (ApiDbContext db, int id) =>
{
  var plant = await db.Plants.FirstOrDefaultAsync(p => p.Id == id);
  return plant == null ? Results.NotFound() : Results.Ok(plant);
});

app.MapGet("/remind", async (ApiDbContext db) =>
{
  var plants = await db.Plants.ToListAsync();
  if (plants == null)
  {
    return Results.BadRequest();
  }

  DateTime current = DateTime.UtcNow;
  var plantsExceeding = plants.Where(plant =>
  {
    TimeSpan interval = current - plant.LastWatered;
    return (interval.TotalHours >= 6);
  });
  if (plantsExceeding == null)
  {
    return Results.BadRequest();
  }

  return Results.Ok(plantsExceeding);
});

app.MapPost("/plants", async (ApiDbContext db, int id) =>
{
  if (await db.Plants.FirstOrDefaultAsync(p => p.Id == id) != null)
  {
    return Results.BadRequest();
  }

  Plant newPlant = new Plant(id, DateTime.UtcNow);
  db.Plants.Add(newPlant);
  await db.SaveChangesAsync();

  return Results.Created($"/plants/{newPlant.Id}", newPlant);
});

app.MapPut("/plants/{id}", async (ApiDbContext db, int id) =>
{
  var plant = await db.Plants.FirstOrDefaultAsync(p => p.Id == id);
  if (plant == null)
  {
    return Results.NotFound();
  }

  plant.LastWatered = DateTime.UtcNow;
  await db.SaveChangesAsync();

  return Results.Ok(plant);
});

app.MapDelete("/plants/{id}", async (ApiDbContext db, int id) =>
{
  var plant = await db.Plants.FirstOrDefaultAsync(p => p.Id == id);
  if (plant == null)
  {
    return Results.BadRequest();
  }

  db.Plants.Remove(plant);
  await db.SaveChangesAsync();
  return Results.NoContent();
});
app.Run($"http://localhost:{PORT}");


class Plant
{
  public int Id { get; set; }
  public DateTime LastWatered { get; set; }

  public Plant(int Id, DateTime LastWatered)
  {
    this.Id = Id;
    this.LastWatered = LastWatered;
  }
}

/* In-memory database */
// class PlantRepository
// {
//   private Dictionary<int, Plant> plants = new Dictionary<int, Plant>();

//   /* Repository */
//   public PlantRepository()
//   {
//     var plant1 = new Plant(1, DateTime.UtcNow);
//     var plant2 = new Plant(2, DateTime.UtcNow);
//     var plant3 = new Plant(3, DateTime.UtcNow);

//     plants.Add(plant1.id, plant1);
//     plants.Add(plant2.id, plant2);
//     plants.Add(plant3.id, plant3);
//   }

//   public IEnumerable<Plant> GetAll() => plants.Values;

//   public Plant GetById(int id)
//   {
//     if (plants.ContainsKey(id))
//     {
//       return plants[id];
//     }
//     return null;
//   }

//   public void Add(Plant plant) => plants.Add(plant.id, plant);
//   public void Update(Plant plant) => plants[plant.id] = plant;

// }

/* Database */
class ApiDbContext : DbContext
{
  public DbSet<Plant> Plants { get; set; }

  public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options) { }
}