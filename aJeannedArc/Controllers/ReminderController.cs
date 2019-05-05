using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using aJeannedArc.Models;
using System.Diagnostics;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace aJeannedArc.Controllers
{
    /**
     * Controller class for the Appointment model
     */
    [Route("api/[controller]")]
    [ApiController]
    public class ReminderController : Controller
    {
        private readonly ReminderContext _context;

        public ReminderController(ReminderContext context)
        {
            _context = context;

            if (_context.Reminders.Count() == 0)
            {
                // Create a new TodoItem if collection is empty,
                // which means you can't delete all TodoItems.
                _context.Reminders.Add(new Reminder { Title = "Reminder1" });
                _context.SaveChanges();
            }
        }

        /**
         * Get all the reminder
         * @return : all the reminder from he database
         */
        // GET: api/Reminder
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reminder>>> GetReminders()
        {
            List<Reminder> reminders = await _context.Reminders.ToListAsync();
            for (int i = reminders.Count - 1; i >= 0; i--)
            {
                if (reminders.ElementAt(i).Date < System.DateTime.Now)
                {
                    _context.Remove(reminders.ElementAt(i));
                    reminders.RemoveAt(i);
                }
            }
            _context.SaveChanges();

            return reminders;
        }

        /**
         * Get a reminder for a specific id
         * @param : Id, the id of the remidner we want to have
         * @return : the reminder we just created
         */
        // GET: api/Reminder/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Reminder>> GetReminder(long id)
        {
            var reminder = await _context.Reminders.FindAsync(id);

            if (reminder == null)
            {
                return NotFound();
            }

            return reminder;
        }

        /**
         * Create and save a new reminder in the db
         * @param : the reminder created with the JSON data from the post request
         * @return : the reminder we just created
         */
        // POST: api/Reminder/Create
        [HttpPost("Create")]
        public async Task<ActionResult<Reminder>> CreateReminder(Reminder reminder)
        {
            _context.Reminders.Add(reminder);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetReminder), new { id = reminder.Id }, reminder);
        }

        /**
         * Update a reminder in the db
         * @param : id, the id of the reminder we want to update. reminder, the new object we want our reminder to be like (the data to change)
         * @return : the updated reminder
         */
        // PUT: api/Reminder/update/5
        [HttpPost("update/{id}")]
        public ActionResult<Reminder> Put(long id, [FromBody]Reminder reminder)
        {
            if (reminder.Date < System.DateTime.Now ||
                reminder.Title == "")
                return NotFound();

            var reminderBdd = _context.Reminders.Find(id);

            if (reminderBdd == null)
                return NoContent();
            
            reminderBdd.Title = reminder.Title;
            reminderBdd.Date = reminder.Date;
            reminderBdd.UserId = reminder.UserId;
            reminderBdd.IsFinished = reminder.IsFinished;

            _context.SaveChanges();

            return reminder;
        }

        /**
         * delete a reminder for a given id
         * @param : id, the id of the reminder we want to delete
         * @return : JSON containing an error message or nothing
         */
        // Delete: api/Reminder/delete/id
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteReminder(long id)
        {
            var appointment = _context.Reminders.First(a => a.Id == id);

            if (appointment == null)
                return NotFound();

            _context.Reminders.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /**
         * Get all the reminders for a gicven user
         * @param : id, the id of the user we want to get all the reminder of
         * @return : the remidners of a specific user
         */
        // Get for user : api/Reminder/ForUser/id
        [HttpGet("ForUser/{userId}")]
        public async Task<ActionResult<IEnumerable<Reminder>>> GetReminderForUser(long userId)
        {
            var reminders = _context.Reminders.Where(a => a.UserId == userId).ToList();

            if (reminders == null)
            {
                return NotFound();
            }

            return reminders;
        }
    }
}
