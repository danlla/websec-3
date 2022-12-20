using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.DAL
{
    public class DataContext: DbContext
    {
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<User> Users { get; set; }
        public DataContext(DbContextOptions<DataContext> options): base(options) { }
    }
}
