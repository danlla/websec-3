using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("userId")]
        public int UserId { get; set; }
        [Column("username")]
        public string? Username { get; set; }
        [Column("email")]
        public string? Email { get; set; }
        [Column("passwordHash")]
        public string? PasswordHash { get; set; }
    }
}
