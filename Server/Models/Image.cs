using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("images")]
    public class Image
    {
        [Key]
        [Column("imageId")]
        public int ImageId { get; set; }
        [Column("postId")]
        public int PostID { get; set; }
        public Post? Post { get; set; }
        [Column("path")]
        public string? Path { get; set; }
    }
}
