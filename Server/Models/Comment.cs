using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("comments")]
    public class Comment
    {
        [Key]
        [Column("commentId")]
        public int CommentId { get; set; }
        [Column("postId")]
        public int PostID { get; set; }
        public Post? Post { get; set; }
        [Column("userId")]
        public int UserId { get; set; }
        public User? User { get; set; }
        [Column("timeCreate")]
        public string? TimeCreate { get; set; }
        [Column("data")]
        public string? Data { get; set; }
    }
}
