using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Server.DAL;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
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

            if (!user.Any())
                return NotFound();

            var hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(password, new byte[] { 0xAA, 0xBB, 0xCC, 0xDD }, KeyDerivationPrf.HMACSHA256, 10000, 64));

            if (user.First().PasswordHash != hashed)
                return BadRequest();

            if(user.First().ConfirmedEmail == 0)
                return BadRequest();

            var handler = new JwtSecurityTokenHandler();

            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

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
            if (user.Any() && user.First().ConfirmedEmail == 1)
                return BadRequest();

            var hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(password, new byte[] { 0xAA, 0xBB, 0xCC, 0xDD }, KeyDerivationPrf.HMACSHA256, 10000, 64));

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

            var random = new Random();

            var code = new string(Enumerable.Repeat(chars, 8).Select(s => s[random.Next(s.Length)]).ToArray());

            var from = new MailAddress("test_email_sender1@rambler.ru", "Confirm");
            var to = new MailAddress(email);
            var m = new MailMessage(from, to);
            m.Subject = "Confirm email";
            m.Body = code;
            var smpt = new SmtpClient("smtp.rambler.ru", 25);
            smpt.Credentials = new NetworkCredential("test_email_sender1@rambler.ru", "123456789Abcd");
            try
            {
                smpt.Send(m);
            }catch(Exception)
            {
                return BadRequest();
            }

            if(!user.Any())
                _dataContext.Users.Add(new Models.User { Username = username,
                                                         Email = email,
                                                         PasswordHash = hashed,
                                                         ConfirmedEmail = 0,
                                                         Code = code});
            else
            {
                var u = _dataContext.Users.Find(user.First().UserId);
                if (u == null)
                    return BadRequest();
                u.Code = code;
            }
            _dataContext.SaveChanges();
            return Ok();
        }

        [HttpPost]
        [Route("send")]
        public IActionResult Send(string code, string username)
        {
            var users = from u in _dataContext.Users
                       where u.Username == username
                       select u;
            var user = _dataContext.Users.Find(users.First().UserId);
            if (user == null)
                return BadRequest();

            if (user.Code != code)
                return BadRequest();

            user.ConfirmedEmail = 1;
            _dataContext.SaveChanges();
            return Ok();
        }
    }
}
