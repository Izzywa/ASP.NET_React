using api.data;
using api.Models;
using Microsoft.EntityFrameworkCore;
using StudentsApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(); // supported by Microsoft

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection"); // reads the connection string
builder.Services.AddDbContext<SchoolDbContext>(option => option.UseSqlite(connectionString)); 
// associating the connectionstring with the schooldbcontext class
// registers schooldbcontext as a singleton

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseSwaggerUI(o=>o.SwaggerEndpoint("/openapi/v1.json", "Swagger UI"));

app.MapGet("/api/students", async (SchoolDbContext db) =>
    await db.Students.ToListAsync()); // returns list of all the students

app.MapGet("/api/students/school/{school}", async (string school, SchoolDbContext db) =>
    await db.Students.Where(t => t.School!.ToLower() == school.ToLower()).ToListAsync());
// school = parameter passed by the user
// return the students that belong to a specific school

app.MapGet("/api/students/{id}", async( int id, SchoolDbContext db) =>
    await db.Students.FindAsync(id)
        is Student student ? Results.Ok(student) : Results.NotFound());
    // returns a student by id
app.MapPost("/api/students", async (Student student, SchoolDbContext db) =>
{
    db.Students.Add(student);
    await db.SaveChangesAsync();

    return Results.Created($"/students/{student.StudentId}", student);
});
// inserting data. student object passed and added to the database
// return = status code 201 (created) will return the student object

app.MapPut("/api/students/{id}", async (int id, Student inputStudent, SchoolDbContext db) =>
    {
        var student = await db.Students.FindAsync(id); // find the student

        if (student is null) return Results.NotFound();
        // if not found = 404 

        student.FirstName = inputStudent.FirstName;
        student.LastName = inputStudent.LastName;
        student.School = inputStudent.School;
        // otherwise pass the input to the student object that was found

        await db.SaveChangesAsync();
        // save the changes

        return Results.NoContent();
    }); // update: id passed to the URL line. student object passed 

app.MapDelete("/api/students/{id}", async (int id, SchoolDbContext db) =>
{
    if (await db.Students.FindAsync(id) is Student student)
    {
        db.Students.Remove(student);
        await db.SaveChangesAsync();
        return Results.Ok(student);
    }

    return Results.NotFound();
}); // find the student and delete, if not found = return 404

app.Run();

