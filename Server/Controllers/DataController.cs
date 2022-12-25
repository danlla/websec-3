using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
            var result = from u in _context.Users
                         select new { u.UserId, u.Username };

            return Ok(result);
        }

        [Authorize]
        [HttpGet]
        [Route("profile")]
        public IActionResult Profile()
        {
            var id = Convert.ToInt32(User.Claims.First().Value);
            var posts = from p in _context.Posts
                        where p.UserId == id
                        orderby p.TimeCreate descending
                        select new { p.PostId, p.Data, p.TimeCreate, p.LikesCount };
            return Ok(posts);
        }

        [Authorize]
        [HttpGet]
        [Route("other_profile")]
        public IActionResult OtherProfile(int userId)
        {
            var posts = from p in _context.Posts
                        where p.UserId == userId
                        orderby p.TimeCreate descending
                        select new { p.PostId, p.Data, p.TimeCreate, p.LikesCount };
            return Ok(posts);
        }

        [Authorize]
        [HttpGet]
        [Route("username")]
        public IActionResult Username()
        {
            var id = Convert.ToInt32(User.Claims.First().Value);
            var user = from u in _context.Users
                       where u.UserId == id
                       select u;
            return Ok(user.First().Username);
        }

        [Authorize]
        [HttpGet]
        [Route("other_username")]
        public IActionResult Username(int userId)
        {
            var user = from u in _context.Users
                       where u.UserId == userId
                       select u;
            return Ok(user.First().Username);
        }

        [Authorize]
        [HttpGet]
        [Route("subs")]
        public IActionResult Subs()
        {
            var id = Convert.ToInt32(User.Claims.First().Value);
            var result = from u in _context.Users
                         join sub in _context.Subscriptions on u.UserId equals sub.UserId
                         where u.UserId == id
                         select new { sub.SubUser!.UserId, sub.SubUser.Username };

            if (!result.Any())
                return NotFound();

            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        [Route("subscribe")]
        public IActionResult Subscribe(int idSub)
        {
            var id = Convert.ToInt32(User.Claims.First().Value);
            var result = from s in _context.Subscriptions
                         where s.UserId == id && s.SubUserId == idSub
                         select s;

            if (result.Any())
                return BadRequest();

            _context.Subscriptions.Add(new Models.Subscription { UserId = id, SubUserId = idSub });
            _context.SaveChanges();

            return Ok();
        }


        [Authorize]
        [HttpPost]
        [Route("add_post")]
        public IActionResult AddPost(string data)
        {
            var id = Convert.ToInt32(User.Claims.First().Value);
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

        [Authorize]
        [HttpGet]
        [Route("subs_posts")]

        public IActionResult SubsPosts()
        {
            var id = Convert.ToInt32(User.Claims.First().Value);
            var result = from u in _context.Users
                         join sub in _context.Subscriptions on u.UserId equals sub.UserId
                         join p in _context.Posts on sub.SubUserId equals p.UserId
                         where u.UserId == id
                         orderby p.TimeCreate descending
                         select new { p.User!.UserId, p.PostId, p.User.Username, p.TimeCreate, p.Data, p.LikesCount };

            if (result == null)
                return NotFound();

            return Ok(result.Take(100));
        }

        [Authorize]
        [HttpGet]
        [Route("user_posts")]
        public IActionResult UserPosts()
        {
            var id = Convert.ToInt32(User.Claims.First().Value);
            var result = from p in _context.Posts
                         where p.UserId == id
                         orderby p.TimeCreate descending
                         select new { p.PostId, p.User!.UserId, p.User.Username, p.TimeCreate, p.Data, p.LikesCount };

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [Authorize]
        [HttpGet]
        [Route("random_post")]
        public IActionResult RandomPost()
        {
            var id = Convert.ToInt32(User.Claims.First().Value);
            var result = from p in _context.Posts
                         where p.UserId != id
                         orderby p.TimeCreate descending
                         select new { p.PostId, p.UserId, p.User!.Username, p.TimeCreate, p.Data, p.LikesCount };

            if (!result.Any())
                return NotFound();

            return Ok(result.Take(100));
        }

        [Authorize]
        [HttpGet]
        [Route("post")]
        public IActionResult Post(int postId)
        {
            var result = from p in _context.Posts
                         where p.PostId == postId
                         select new { p.PostId, p.User!.Username, p.TimeCreate, p.Data, p.LikesCount };

            if (!result.Any())
                return NotFound();

            return Ok(result.First());
        }

        [Authorize]
        [HttpPost]
        [Route("like_post")]
        public IActionResult LikePost(int idPost)
        {
            var id = Convert.ToInt32(User.Claims.First().Value);
            var check = from l in _context.Likes
                        where l.UserId == id && l.PostID == idPost
                        select l;

            var exist = false;
            if (check.Any())
                exist = true;

            if (!exist)
                _context.Likes.Add(new Models.Like { PostID = idPost, UserId = id });
            else
            {
                var p = _context.Likes.Find(check.First().LikeId);
                if (p == null)
                    return BadRequest();
                _context.Likes.Remove(p);
            }

            var post = from p in _context.Posts
                       where p.PostId == idPost
                       select p;

            post.First().LikesCount += exist?-1:1;

            _context.SaveChanges();

            return Ok();
        }

        [Authorize]
        [HttpGet]
        [Route("comments")]
        public IActionResult CommentsPost(int postId)
        {
            var result = from c in _context.Comments
                         where c.PostId == postId
                         select new { c.PostId, c.Data, c.TimeCreate, c.User!.Username };

            if (!result.Any())
                return NotFound();

            return Ok(result.Take(50));
        }

        [Authorize]
        [HttpPost]
        [Route("comment_post")]
        public IActionResult CommentPost(int postId, string data)
        {
            var id = Convert.ToInt32(User.Claims.First().Value);
            _context.Comments.Add(new Models.Comment { UserId = id, Data = data, PostId = postId, TimeCreate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") });

            _context.SaveChanges();

            return Ok();
        }
    }
}
