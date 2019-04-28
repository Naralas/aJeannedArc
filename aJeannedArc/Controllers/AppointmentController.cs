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
    public class AppointmentController : ControllerBase
    {
        private readonly AppointmentContext appointmentContext;

        public AppointmentController(AppointmentContext context)
        {
            appointmentContext = context;

            if (appointmentContext.Appointments.Count() == 0)
            {
                // Create a new TodoItem if collection is empty,
                // which means you can't delete all TodoItems.
                appointmentContext.Appointments.Add(new Appointment{ Title = "User1", IsPublic = true });
                appointmentContext.SaveChanges();
            }
        }

        // GET: api/Appointment/Public
        [HttpGet("Public")]
        public  ActionResult<IEnumerable<Appointment>> GetPublicAppointment()
        {
            var appointment = appointmentContext.Appointments.Where(a => a.IsPublic).ToList();

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        // GET: api/Appointment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(long id)
        {
            var appointment = await appointmentContext.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        // PUT: api/Appointment/5
        [HttpPost("update/{id}")]
        public ActionResult<Appointment> Put(int id, [FromBody]Appointment appointment)
        {
            var appointmentBdd = appointmentContext.Appointments.First(app => app.Id == id);

            if (appointmentBdd == null)
                return NoContent();

            appointmentBdd.Id = appointment.Id;
            appointmentBdd.IsPublic = appointment.IsPublic;
            appointmentBdd.UserId = appointment.UserId;
            appointmentBdd.Title = appointment.Title;
            appointmentBdd.Notes = appointment.Notes;
            appointmentBdd.Start= appointment.Start;
            appointmentBdd.End = appointment.End;

            appointmentContext.SaveChanges();

            return appointment;
        }

        [HttpPost("create")]
        public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
        {
            appointmentContext.Appointments.Add(appointment);
            await appointmentContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }

        // Delete: api/Appointment/delete/id
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAppointment(long id)
        {
            var appointment = appointmentContext.Appointments.First(a => a.Id == id);

            if (appointment == null)
                return NotFound();

            appointmentContext.Appointments.Remove(appointment);
            await appointmentContext.SaveChangesAsync();

            return NoContent();
        }

        // Get for user : api/Appointment/ForUser/id
        [HttpGet("ForUser/{userId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentForUser(long userId)
        {
            var appointments = appointmentContext.Appointments.Where(a => a.UserId == userId).ToList();

            if (appointments == null)
            {
                return NotFound();
            }
        
            return appointments;
        }
    }
}