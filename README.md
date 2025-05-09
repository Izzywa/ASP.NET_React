# Tutorial: Create an ASP.NET Core app with React in Visual Studio
 - use brew to install 
 ```
 brew install --cask dotnet-sdk
 ```
 - just the `dotnet` is the runtime, will not allow you to build anything
 - check with `dotnet --version` to see if dotnet is installed on the computer


IDE
- Jetbrain rider
    - best option on Mac
    - cannot run the full visual studio on here

- install C# extension

test the app
- create a new directory for the app
```
dotnet new <template> -o <name of application>
```
- generate a new application
    - microsoft have templates to create application
    - ex: webapi


install SQL server
- use Microsoft 
- basic installation
- install SSMS

if using React 
- can have the frontend at a separate folder

## make sure you are in the api project folder
```
dotnet watch run
```
- start to make sure it is working
- will see Swagger, used to map API end points
- as of .NET9 could no longger open swagger with this
    - instead is using OpenAPI as in project.cs

    ```
    builder.Services.AddOpenApi();
    ```

- add new package `swashbuckle`
```
dotnet add TodoApi.csproj package Swashbuckle.AspNetCore -v 6.6.2
```

- add swagger UI in `Program.cs` and define where is the documentation that is generated
```
app.UseSwaggerUI();
```
- go to `{route}/swagger/index.html`
- will first get an error that will not be able to fetch API definition
- `{route}/openapi/v1.json` to see the specification needed for swagger UI
    - this is the default route microsoft use for openAPI document
    - specify to swagger that it needs to go to this particular location to get the documentation

```
app.SwaggerUI(o=>o.SwaggerEndpoint("/openapi/v1.json", "Swagger Demo"));
```
- the second parameter is the title
- now swagger use the openapi provided as default

benefit
- can have a feel of the api endpoints
- visualise the route and see that it is up and running

alter the default route of the api
- `launchSettings.json`
- (not working starting here)
- just clone the `launchSettings.json` file.
    - the default file does not include IISsettings

## `program.cs`
- where settings are set
- interface to plug things in
- things you want to add to your program
- where middleware will be

## Extensions
- C# dev kit
- .NET extension pack
- .NET Install Tool
- NuGet Gallery
- Prettier
- C# Extension pack by JosKreativ


# Models
Why do we need API?
- API = code that sits on top of database
- allow to interact with databases in a safe and self-contained way

database
- data linked together
- models no different from excel spreadsheet
    - can link together

## create models
inside app folder `api` (or whatever it was named) > create the `Models` folder
- inside `Models` folder, create your models
- right click > new C# > Class > Name the file

inside the `Stock` model class
- `prop` + Tab = will get a property
```
public int Id {get; set;}
public string Symbol {get; set;} = string.Empty;
```
- `Id` = when creating data, want to uniquely identify them
- `Symbol` = identify the stock, some kind of word here
    - put an empty string, or else will get null reference errors
    - want to put an empty string instead of null in the database

```
[Column(TypeName = "decimal(18,2)")]
public decimal Purchase {get; set;}
```
- This tells SQL that this data can only have 18 digits and 2 decimal places
    - represent monetary amount
- the TypeName prevents the Purchase field to be over 2 decimal places
- copy and paste the same for Dividend field


```
public long MarketCap {get; set;}
```
- `long` beause market caps can be in the trillion

### one to many relationships
```
public List<Comment> Comments {get; set;} = new List<Comment>();
```
- comment will have a one to many relationship
- need to have to tie them together 
- need primary key and foreign key relaitonship
- `List` is a data structure that allows us to have many of something
    - need to form the relationship in the `Comments` model too
    - If have a `Stock` will have many `Comments`

link `Comments` and `Stocks` by convention
- in `Comments` model:
```
public int? StockId {get; set;} // navigation property
public Stock? Stock {get; set;}
```
- convention = Entity Framework .NET core
    - will search through code and form this relationship
    - this will connect the stock to the comment

- this will form the relationship within the database

- navigation property = allow us to access this part
    - allow to navigate within the model
    - can access the other side of the model

```
public DateTime CreatedOn {get; set;} = DateTime.Now
```
- this automatically fills with the current datetime whenever the data is created

# entity framework
ORM = object relational mapper
- called Entity framework in .NET
- take db tables and turn into object

need to install entity framework
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Tools
- Microsoft.EntityFrameworkCore.Design

Command + shift + p = open NuGet Gallery
- install `EntityFrameworkCore.SqlServer` = install everything for you
- make sure it mathces 
    - open `api.csproj`
    - check `<TargetFrameword>` and get the correct version

- install `EntityFrameworkCore.Tools`

- install `Microsoft.EntityFrameworkCore.Design`

## create a `data` foler in the project folder
- create a new C# folder named `ApplicationDBContext`
    - will be a giant class that will allow you to search your individual tables
    - ORM will transform database tables into objects
    - this will allow us to specify the table that we want

```
public class ApplicationDBContext : DBContext
{
    public ApplicationDBContext(DbContextOptions dbContextOptions)
    : base(dbContextOptions)
    {

    }

    public DbSet<Stock> Stock {get; set;}
    public DbSet<Comment> Comments {get; set;}

}
```
- inherit from `DBContext`
    - it will bring all types of things that will allow this to happen

- press `ctor` = create a constructor
    - bring in `DbContextOptions`, naming it as `dbContextOptions`
    - bring in a base
        - base = allow to pass DB context into the `dbContext`
        - we have our own `dbContext` but the base will pass it up into the actual inherited `DBContext` (the one at the top)

- add the tables
    - wrap the table in the `DbSet`
        - `DbSet` will grab something out of the database 
        - you will do something with it
        - will return the data in whatever form you want
        - whenever using this you are manipulating the whole entire table
        - deferred execution 

- The `ApplicationDBContext` is what will allow us to create the table
    - with entitiy framework, going into and finding your tables and creates the database
    - this is where we will keep the `Stocks` and `Comments`
    - linking up the database to the actual code 

## hook up the database context
before the `var app = builder.build()` in the `Program.cs` file
```
builder.Services.AddDbContext<ApplicationDBContext>(options => {
    options.useSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
```
- pass in the application that we just built
- in the options, we choose which type of DB we decided to use
    - `GetConnectionString("DefaultConnection")` will search in the app settings json
    - need to add the connection to the app settings

## SQL Server management Studio
- open up SQL Server management studio
- add new database with a name
- in `appsettings.json` add the database that was just created to the connection string
```
{
    "ConnectionStrings": {
        "DefaultConnection": 
    },
    "Logging":{
        "LogLevel":{
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
        }
    }.
    "AllowedHosts": "*"
}
```
- add what was added withing the `program.cs`
    - have `DefaultConnection`
    - can add as many as you want to
    - add a connection string
- template connection string
```
"Data Source=DESKTOP-U39R90D\\SQLEXPRESS;Initial Catalog=finshark;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"
```
- to change:
    - the `source=DESKTOP-u3R90D`
        - get the desktop by checking the properties of the database that was just created
    - `Catalog=Finshark`
        - this is the name of the database
        - change to the name of the database

- every different database will use different connection string
    - need to format the connection string based on that

```
dotnet ef migrations add <migrationname>
dotnet ef database update
```
***Could not use SQL Server management Studio as being on Mac***

***attempt to use MySQL result in failure to update database although could create a migration***

# attempt to use SQLite for database 

packages
```
Microsoft.EntityFrameworkCore.SQLite
Microsoft.EntityFrameworkCore.SQLite.Design
CsvHelper
```
- the `CsvHelper` will halp read a CSV file

folder to be added to the project folder
- Data
    - need to have a database context class since using entity framework
    - create SchoolDbContext class file



- Models
    - create Student class file
    ```
    public int StudentId (get; set;)
    public string? LastName (get; set;)
    public string? FirstName (get; set;)
    public string? School (get; set;)
    ```

- wwwroot
    - place the csv file containing the data to be populated to the databaese

- add connection string to SQLite database on `appsettings.json`
```
"ConnectionStrings": {
    "DefaultConnection": "DataSource=school.db"
}
```

- prepare studentdbcontext in the data file
( for some reason, csvconfiguration causing error. resolved by installing through terminal with `dotnet add package CsvHelper` even when package added with NuGet package manager )

in program.cs file
- add some code to associate the database context class with the connection string

do migrations
```
dotnet ef migrations add m1 -o Data/Migrations --context SchoolDbcontext
```
- make the migration named `m1` and output it to the `Data/Migraitons` folder
- since have more than one context, use `--context` to specify 

apply the migrations
```
dotnet ef database update --context SchoolDbContext
```
- this will create the database and put some data into it

# creating API endpoints
add endpoints before `app.Run()` in the `Program.cs`

- try out the endpoints with `dotnet watch`
    - When using post to insert new student data, does not need to insert student ID as it is automatically generatd by the database
    