using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DAL;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/data")]
    public class DataController : Controller
    {
        private readonly DataContext _context;

        public DataController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        [Route("users")]
        public IActionResult GetUsers()
        {
            
            return Ok(_context.Users.ToList());
        }

        [Authorize]
        [HttpGet]
        [Route("subs")]
        public IActionResult GetSubs()
        {
            var login = User.Identity!.Name;
            var result = from u in _context.Users
                         join sub in _context.Subscriptions on u.UserId equals sub.UserId
                         where u.Username == login
                         select new {sub.SubUser};

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost]
        [Route("posts")]

        public IActionResult AddPost(string data, int id)
        {
            _context.Posts.Add(new Models.Post
            {
                Data = data,
                TimeCreate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                LikesCount = 0,
                UserId = id
            });

            _context.SaveChanges();
            return Ok();
        }

        [HttpGet]
        [Route("subs_post")]

        public IActionResult GetPost(string login)
        {
            var result = from u in _context.Users
                         join sub in _context.Subscriptions on u.UserId equals sub.UserId
                         join p in _context.Posts on sub.SubUserId equals p.UserId
                         where u.Username == login
                         select new { p.User, p.TimeCreate, p.Data, p.LikesCount };

            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}
