using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using aJeannedArc.Models;

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
                    Username = "User1",
                    Appointments = new List<Appointment>
                                    {
                                        new Appointment{ Title = "a 1"},
                                        new Appointment{ Title = "a 3"}
                                    }
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


        // GET: api/User
        [HttpGet("calendar/{id}")]
        public ActionResult<ICollection<Appointment>> GetCalendar(long id)
        {
            ICollection<Appointment> calendar = _context.Users.First(u => u.Id == id).Appointments;

            if (calendar == null)
                return NotFound();

            return new JsonResult(calendar);
        }

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

        // POST: api/User
        [HttpPost("register")]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
    }
}