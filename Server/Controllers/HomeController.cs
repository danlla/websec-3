using Microsoft.AspNetCore.Cryptography.KeyDerivation;
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

            var hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(password, new byte[] { 0xAA, 0xBB, 0xCC, 0xDD }, KeyDerivationPrf.HMACSHA256, 10000, 64));

            if (user.First().PasswordHash != hashed)
                return BadRequest();

            var handler = new JwtSecurityTokenHandler();

            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            //var identity = new ClaimsIdentity(new GenericIdentity(username),
            //new[] { new Claim("user_id", user.First().UserId.ToString()) });
            var identity = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.NameIdentifier, user.First().UserId.ToString()) });
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

            var hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(password, new byte[] { 0xAA, 0xBB, 0xCC, 0xDD }, KeyDerivationPrf.HMACSHA256, 10000, 64));

            _dataContext.Users.Add(new Models.User { Username = username, Email = email, PasswordHash = hashed});
            _dataContext.SaveChanges();
            return Ok();
        }
    }
}
