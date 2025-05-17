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
    

# NEXT.JS
creating react app with `npx create-react-app <appname>` is now deprecated
- documentation supports creating with frameworks
- there are limitations that make it difficult to build high performance production app

migrate existing apps to 
- Next.js
- React Router
- Expo

build tools are missing tools needed to build a real production app

- production apps need solutions to problems like
    - routing
        - most apps solve by adding a routing library like `React Router`

    - data fetching
        - common to use fetch in effect to load data
        - but this means data is fetched after the component renders = can cause network waterfalls
        - caused by fetching data when app renders instead of in parallel while the code is loading
        - fetching in an effect = user has to wait longer to see the content
        - the data could have been fetched earlier
        - to solve this can use data fetching library = options to prefetch data = request is started before the component renders
        - libraries work best when integrated with routing "loader" pattern = specify data dependencies at the route level
        - however this requires correctly configuring the loaders in your app = trades off complexity for performance 

    - code splitting
        - app is shiped as a single bundle
        - should split code into separate bundles = user only needs to download what they need
        - only downloading the code user need to see the page they are on = decreases the time the user needs to wait to load your app

    - accessibility
    - asset loading
    - authentication
    - caching
    - error handling
    - mutating data
    - optimistic updates
    - progressive enhancement
    - server-side rendering
    - static site generation
    - streaming

frameworks

- impose some opinions about structuring your app
- provide a much better user experience

- recommended:
    - Next.js
    - React Router
    - Expo

# getting started with Next.js
## app router and pages router

Next.js has 2 different routers:
- **App Router**: the newer router that supports new React features like Server Components
- **Pages Router**: The original router, still supported and being improved

## setting up

system requirements
- latest Node.js

**automatic installation**
```
npx create-next-app@latest
```

**create the `app` directory**

- Next.js uses file-sytem routing
    - routes in your app are determined by how you structure your files
- create `app` folder > `layout.tsx` file
    - this is the root layout
    - required
    - must contain the `<html>` and `<body>` tags

- create a homepage `app/page.tsx`

- both will be rendered when the user visit the root of app (`/`)

- if forget to create the root layout
    - Next.js will automatically create this file when running the development server with `next dev`
    - can optionally use a `src` folder in the root of the project = separate app's code from configuration files

create the `public` folder (optional)
- store static assets 
    - images
    - fonts
    - etc
- files inside `public` can be referenced by your code starting from the URL (`/`)
    - ex: `public/profile.png` can be referenced as `/profile.png`

**Run the development server**

1. run `npm run dev` 
2. visit `http://localhost:3000`
3. edit `app/page.tsx` file and save to see the updated result in the browser

**set up TypeScript**

- next.js comes with built in typescript support
- to add TypeScript to project, rename a file to `.ts` or `.tsx`
- next.js will automatically install the necessary dependencies and add `tsconfig.json` file

IDE plugin
- next.js includes custom TypeScript plugin and type checker
- VSCode can use for advanced type-checking and auto-completion
- enable plugin
    - open command palette (ctrl + shift + p)
    - searching for "TypeScript: Select TypeScript Version"
    - selecting "Use Workspace Version"

**set up ESLint**

- built in 

**setup absolute imports and module path aliases**

- next.js has in built support for the `"paths"` and `"baseUrl"` options of `tsconfig.json` and `jsconfig.json` files
- these options allow to alias project directories to absolute paths
- cleaner to import modules

```
// Before
import { Button } from '../../../components/button'
 
// After
import { Button } from '@/components/button'
```

- configure absolute imports:
    - add `baseUrl` configuration option to `tsconfig.json` file 
    - can use `"paths"` to `"alias"` module paths

```
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/styles/*": ["styles/*"],
      "@/components/*": ["components/*"]
    }
  }
}
```
- this configuration maps `@/components/*` to `components/*`
- each of the `"paths"` are relative to the `baseUrl` location

## project structure and organisation
**folder ad file conventions**

top level folders = organise app's code and static assets
- `app` = app router
- `pages` = pages router
- `public` = static assets to be servd
- `src` = optinal app source folder

top level files
- configure app
- manage dependencies
- run middleware
- integrate monitoring tools
- define env var

* `next.config.js` = configuration file for Next.js
* `package.json` = Project dependencies and scripts
* `instrumentation.ts` = OpenTelemetry and instrumentation file
* `middleware.ts` = Next.js request middleware
* `.env` = environment variables
* `.env.local` = local env var
* `.env.production` = production env var
* `.env.development` = development env var
* `.eslintrc.json` = config file for ESLint
* `.gitignore` = git files and folders to ignore
* `next-env.d.ts` = TypeScript declaration file for Next.js
* `tsconfig.json` = Config file for TypeScript
* `jsconfig.json` = config file for JavaScript

routing files
- `layout` .js/.jsx/.tsx = Layout
- `page` .js/.jsx/.tsx = Page
- `loading` .js/.jsx/.tsx = Loading UI
- `not-found` .js/.jsx/.tsx = Not found UI
- `error` .js/.jsx/.tsx = Error UI
- `gloabal-error` .js/.jsx/.tsx = global error UI
- `route` .js/.ts = API endpoint
- `template` .js/.jsx/.tsx = re-rendered layout
- `default` .js/.jsx/.tsx = parallel route fallback page

**organising your project**
Next.js is unopinionated about how you organise and colocate your project files
- does provide several features to help organise project

component hierarchy
- components defined in special fiels are rendered in a specific hierarchy
    - `layout.js`
    - `template.js`
    - `error.js`
    - `loading.js`
    - `not-found.js`
    - `page.js` or nested `layout.js`

- components of a route segment will be nested inside the components of its parent segment

colocation
- in `app` directory, nested folders define route structure
- each folder represents a route segment that is mapped to a corresponding segment in a URL path
- route is not publicly accessible until a `page.js` or `route.js` file is added to a route segment
- only the content returned by `page.js` or `route.js` is sent to the clinet
    - project files can be safely colocated inside route segments in the `app` directory without accidentally being routable
- can also keep project files outside the `app` directory

private flders
- prefixing folder with and underscore: `_folderName`
- should not be considered by the routing system
- useful for
    - separating UI logic from routing logic
    - organising internal files across a project and Next.js ecosystem
    - sorting and grouping files in code editors
    - avoiding potential naming conflicts with future Next.js file conventions

- can mark files outside private folders as private by ysing the same underscore pattern


route groups
- created by wrapping a folder in parenthesis: `(foldername)`
- indicates the folder is for organisational purpose
    - should not be included in the route's URL path
- ex: `(admin)/dashboard/page.js` ==> `/dashboard`
- useful for
    - organising routes by site section, intent, or team
    - enabling nested layouts in the same route segment level

`src` folder
- support storing app code inside an optional `src` folder
- this separates app code from project config files 
    - these live in the root of a project 

_the simplest takeaway is to choose a strategy that works for you and your team and be consistent across the project_


## how to create layouts and pages

Next.js uses _file-system based routing_
- can use folders and files to define routes

### creating a page
page = UI rendered on a specific route
- add a `page` file inside the `app` directory
- default export a React component
- create an index at page(`/`)

### creating a layout
layout = UI shared between multiple pages
- on navigation, layouts:
    - preserve state
    - remain interactive
    - do not rerender

- default export a react component from a layout file
- the commponent should accept a children prop
    - children can be a page or another layout

**root layout**
- defined at the root of the app directory
- required and must contain html and body tags

### creating a nested route
nested route = route composed of multiple URL segments

`/blog/[slug]` route is composed of 3 segments
- `/` (root segment)
- `blog` (segment)
- `[slug]` (leaf segment) 

folders = define the route segments that map to URL segments
files = create UI that is shown for a segment

create nested routes = nest folders inside each other
- add `page.tsx` file makes the nested route publicly acccessible
- continue nesting folders to create nested routes

wrapping a folder name in square brackets (`[slug]`) = creates a dynamic route segment
- generate multiple pages from data

### nesting layouts
layouts are also nested 
- wrap child layouts via the `children` prop
- nest layouts by adding `layout` inside specific route segments (folders)

### linking between pages
use `<Link>` component to navigate between routes
- built in Next.js components
- extend the `<a>` tag
- provide prefetching and client side navigation
- the primary recommended way to navigate between routes 
- can also use the `useRouter` hook for more advanced navigation

## layout.js
- used to define a layout in app

the root layout in the root `app` directory is used to define the `<html>` and `<body>` tags and other globally shared UI

**reference**

_props_
- `children` (required)
    - layout components should accept and use a `children` prop
    - during rendering, `children` will be populated with the route segments the layout is wrapping
    - this will be component of a child layout (if it exists) or page
    - could also be other special viles like Loading or error when applicable

- `params` (optional)
    - a promise
    - resolves to an object containing the dynamic route parameters object from the root segment down to that layout

example route
- `app/dashboard/[team]/layout.js` = URL `/dashboard/1` = `{ team: '1' }`
- `app/dashboard/[team]/[item]/layout.js` = URL `/dashboard/1/2` = `{ team: '1', item: '2' }`
- `app/dashboard/[...slug]/layout.js` = URL `/dashboard/1/2` = `{ slug: ['1','2'] }`

params prop is a promise
- must use `async/await` or React's `use` funtion to access the values

**root layout**
- `app` directory must include a root `app/layout.js`
- must define `<html>` and `<body>` tags
- should not manually add `<head>` tags
    - use `MetaData API`
    - automatically handles advanced requirements 
    - streaming and de-duplicating `<head>` elements

- use route groups to create multiple root layouts
    - navigating acros multiple root layouts will cause a full page load
    - unlike a client side navigation


**caveats**
- intentionally cannot access the raw request object in a layout
- can access headers and cookies through server only functions

layouts do not rerender
- can be cached and reused to avoid unnecessary computation when navigating between pages
- restricting layouts from accessing the raw request = prevent execution of potentially slow or expensive user code 
- enforces consistenct and predictable behaviour for layouts
- simplifies development and debugging

layouts do not receive `searchParams`
- pages do
- a shared layout is not rerendered during navigation = stale `searchParams` between navigations
- client side nav = only renders the part of the bage below the common layout between 2 routes
    - `dashboard/layout.tsx` = common layout for `/dashboard/settings` and `/dashboard/analytics`
    - navigating from `settings` to `analytics`
        - `page.tsx` in `analytics` will rerender on the server
        - `dashboard/layout.tsx` will not rerender because its a common UI shared between the 2 routes

- navigation between pages quicker
    - because `dashboard/layout.tsx` doesn't re-render = `searchParams` prop in the layout might become stale after navigation
        - use the Page `searchParams` prop 
        - or `useSearchParams` hook in a client component within the layout which is rerendered on the client with the latest searchParams

**layouts cannot access `pathname`**
- layouts are server components by default = don't rerender  = `pathname` becoming stale
- extract the logic that depends on pathname into a client component + inport it inot your layouts
- can use `usePathname` to access the current pathname and prevent staleness

## page.js
allows to define UI that is unique to a route
- a `page` is always the leaf of the route subtree
- a `page` file is required to make a route segment publicly accessible
- pages are server components by default, but can be set to a client component

**reference**

_props_
- `params` (optional)
    - a promise that resolves to an object
    - containing the dynamic route parameters 

- `searchParams` (optional)
    - promise that resolves to an object containing the search parameters of the current URL
    - `/shop?a=1` = {a: '1'}
    - `/shop?a=1&b=2` = {a: '1', b: '2'}
    - `/shop?a=1&a=2` = {a: ['1', '2']}

    - a Dynamic API whose values cannot be known ahead of time
        - using it = page into dynamic rendering at request time

    - a plain JavaScript object

**handling filtering with `searchParams`**

- handle filtering, pagination, or sorting based on the query string of the URL
- Client Component cannt be async
    - use React's `use` function to read the promise

### Link
- `href` = required
- `replace`
    - defaults to false 
    - true = `next/link` will replace the current history state instead of adding a new URL into into the browser's history
- `scroll`
    - default = true
    - default scrolling behavior = maintain scroll position 
    - when navigate to a new page, scroll position will stay the same as long as the page is visible in the viewport
    - if page not visible in the keyboard = will scroll to the top of the first page element
    - `scroll = {false}` = will not attempt to scroll to the first page element

## how to optimise images
- size optimmisation
    - automatically serving correctly sized images for each device
- visual stability
    - preventing layout shift automatically when images are loading
- faster page loads
    - only loading images when they enter te viewport using native browser lazy loading
    - optional blur up placeholdrs
- asset flexibility
    - resizing images on demand

## fetching data

fetch data using:
- the `fetch` API
- an ORM or database

**with the fetch API**
- turn the component into an asynhronous function

**streaming**
- `dynamicIO` config option need to be enabled in the app

when using `async/await` = next.js will opt into dynamic rendering
- data will be fetched and rendered on the server for every user request
- slow data requests = whole route will be blocked from rendering

implementing streaming in app
- `loading.js` file
- react's `<suspense>` component

with `loading.js`
- can create a `loading.js` file in the same folder as your page to stream the entire page while the data is being fetched
- user will immediately see the layout and a loading state while the page is being rendered
- `loading.js` will be nested inside `layout.js`
- will automatically wrap the `page.js` file and any children below in a `<Suspense>` boundary

with `<Suspense>`
- allows to be more granular about what parts of the page to srream
- can immediately show any page content that falls outside of the `<Suspense>` boundary

an instant loading state is a fallback UI that shows immediately to the user after navigation
- best user experience = design loading states that are meaningful and help users understand the app is responding

## how to update data
**creating server functions**

- use the `use server` directive
- place at the top of an asynchronous function


**client components**
- can invoke server functions in client components
