using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("likes")]
    public class Like
    {
        [Key]
        [Column("likeId")]
        public int LikeId { get; set; }
        [Column("postId")]
        public int PostID { get; set; }
        public Post? Post { get; set; }
        [Column("userId")]
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
