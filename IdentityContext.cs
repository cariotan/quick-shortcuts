using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

	public class IdentityContext : IdentityDbContext
	{
		private static string DbPath = "C:\\Database\\IdentityContext.db";

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			optionsBuilder.UseSqlite($"Data Source={DbPath};Pooling=false");
		}
	}
