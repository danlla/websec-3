using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("posts")]
    public class Post
    {
        [Key]
        [Column("postId")]
        public int PostId { get; set; }
        [Column("data")]
        public string? Data { get; set; }
        [Column("timeCreate")]
        public string? TimeCreate { get; set; }
        [Column("userId")]
        public int UserId { get; set; }
        public User? User { get; set; }
        [Column("likesCount")]
        public int LikesCount { get; set; }
    }
}
