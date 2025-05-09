using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace StudentsApi.Data
{
    public class SchoolDbContext : DbContext // inherits dbcontext
    {
        public DbSet<Student> Students => Set<Student>(); // one collection = one table

        public SchoolDbContext(DbContextOptions<SchoolDbContext> options)
                : base(options) { } // constructor

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Student>().HasData(GetStudents());
        } // onmodelcreating method that will seed sample data
        // the students object is used to seed the database

        private static IEnumerable<Student> GetStudents() // gives data to the onmodelcreating method
        {
            string[] p = { Directory.GetCurrentDirectory(), "wwwroot", "students.csv" };
            var csvFilePath = Path.Combine(p); // reads the students.csv file

            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                PrepareHeaderForMatch = args => args.Header.ToLower()
            };

            var data = new List<Student>().AsEnumerable(); // constructs a list of students objects and returns it
            using (var reader = new StreamReader(csvFilePath))
            {
                using (var csvReader = new CsvReader(reader, config))
                {
                    data = (csvReader.GetRecords<Student>()).ToList();
                }
            }

            return data;
        }

    }

}