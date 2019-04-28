using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using aJeannedArc.Models;
using System;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;

namespace aJeannedArc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserContext _context;

        public UserController(UserContext context)
        {
            _context = context;

            if (_context.Users.Count() == 0)
            {
                // Create a new TodoItem if collection is empty,
                // which means you can't delete all TodoItems.
                User a = new User
                {
                    Username = "User1"
                };
                _context.Users.Add(a);

                _context.SaveChanges();
            }
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }


        /*
        // GET: api/User
        [HttpGet("calendar/{id}")]
        public ActionResult<ICollection<Appointment>> GetCalendar(long id)
        {
            ICollection<Appointment> calendar = _context.Users.First(u => u.Id == id).Appointments;

            if (calendar == null)
                return NotFound();

            return new JsonResult(calendar);
        }*/

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST: api/User/Create
        [HttpPost("Create")]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: user.Password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));

            user.Password = hash;
            user.Salt = salt;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // POST: api/User/Login
        [HttpPost("Login")]
        public async Task<ActionResult<User>> Login(User user)
        {
            var userLogin = _context.Users.SingleOrDefault(x => x.Username == user.Username);

            if (userLogin == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: user.Password,
            salt: userLogin.Salt,
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));

            if (hash != userLogin.Password)
                return BadRequest(new { message = "Username or password is incorrect" });

            // todo retourner id et token
            return Ok(new
            {
                Id = userLogin.Id
            });
        }
    }
}