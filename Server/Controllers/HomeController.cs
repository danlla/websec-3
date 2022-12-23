using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Server.DAL;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Server.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHttpContextAccessor _context;
        private readonly DataContext _dataContext;

        public HomeController(IHttpContextAccessor context, DataContext dataContext)
        {
            _context = context;
            _dataContext = dataContext;
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login(string username, string password)
        {
            var user = from u in _dataContext.Users
                       where u.Username == username
                       select u;

            if (user.Count() == 0)
                return NotFound();

            
            if (user.First().PasswordHash != password)
                return BadRequest();

            var handler = new JwtSecurityTokenHandler();

            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            //var identity = new ClaimsIdentity(new GenericIdentity(username),
            //new[] { new Claim("user_id", user.First().UserId.ToString()) });
            var identity = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.NameIdentifier, username) });
            var token = handler.CreateJwtSecurityToken(subject: identity,
                                                       issuer: "localhost:7061",
                                                       signingCredentials: signingCredentials,
                                                       expires: DateTime.UtcNow.AddMinutes(60));
            return Ok(handler.WriteToken(token));
        }

        [HttpPost]
        [Route("register")]
        public IActionResult Register(string email,string username, string password)
        {
            var user = from u in _dataContext.Users
                       where u.Username == username
                       select u;
            if (user.Count() != 0)
                return BadRequest();

            _dataContext.Users.Add(new Models.User { Username = username, Email = email, PasswordHash = password});
            _dataContext.SaveChanges();
            return Ok();
        }
    }
}
