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

        //// PUT: api/Appointment/5
        //[HttpPost("{id}/update")]
        //public ActionResult<Appointment> Put(int id, [FromBody]Appointment appointment)
        //{
        //    var appointmentBdd = appointmentContext.Appointments.First(app => app.Id == id);

        //    if (appointmentBdd == null)
        //        return NoContent();

        //    TryUpdateModelAsync<Appointment>(appointmentBdd, "", a => a.T)


        //    return appointment;
        //}

        // POST: api/Appointment/Create
        [HttpPost("Create")]
        public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
        {
            appointmentContext.Appointments.Add(appointment);
            await appointmentContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }

        // Delete: api/Appointment/id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(long id)
        {
            var appointment = appointmentContext.Appointments.First(a => a.Id == id);

            if (appointment == null)
                return NotFound();

            appointmentContext.Appointments.Remove(appointment);
            await appointmentContext.SaveChangesAsync();

            return NoContent();
        }
    }
}