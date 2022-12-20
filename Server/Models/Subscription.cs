using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("subscription")]
    public class Subscription
    {
        [Key]
        [Column("subscriptionId")]
        public int SubscriptionId { get; set; }
        [Column("userId")]
        public int UserId { get; set; }
        public User? User { get; set; }
        [Column("subUserId")]
        public int SubUserId { get; set; }
        public User? SubUser { get; set; }
    }
}
