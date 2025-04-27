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