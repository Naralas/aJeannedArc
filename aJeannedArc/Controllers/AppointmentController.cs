using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using aJeannedArc.Models;

namespace aJeannedArc.Controllers
{
    /**
     * Controller class for the Appointment model
     */
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

        /**
         * Get all the appointments
         * @return : all the appointments from he database
         */
        // GET: api/Appointment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            List<Appointment> appointments = await appointmentContext.Appointments.ToListAsync();
            for(int i = appointments.Count-1; i >= 0; i--)
            {
                if(appointments.ElementAt(i).End < System.DateTime.Now)
                {
                    appointmentContext.Remove(appointments.ElementAt(i));
                    appointments.RemoveAt(i);
                }
            }

            appointmentContext.SaveChanges();

            return appointments;
        }

        /**
         * Get public appointments
         * @return : all the public appointment
         */
        // GET: api/Appointment/Public
        [HttpGet("Public")]
        public ActionResult<IEnumerable<Appointment>> GetPublicAppointment()
        {
            var appointment = appointmentContext.Appointments.Where(a => a.IsPublic).ToList();

            if (appointment == null)
            {
                return NotFound();
            }

            for (int i = appointment.Count - 1; i >= 0; i--)
            {
                if (appointment.ElementAt(i).End < System.DateTime.Now)
                {
                    appointmentContext.Remove(appointment.ElementAt(i));
                    appointment.RemoveAt(i);
                }
            }
            appointmentContext.SaveChanges();


            return appointment;
        }

        /**
         * Get a appointments for a specific id
         * @param : Id, the id of the appointments we want to have
         * @return : the appointments we just created
         */
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

        /**
         * Update a appointments in the db
         * @param : id, the id of the appointments we want to update. appointments, the new object we want our appointments to be like (the data to change)
         * @return : the updated appointments
         */
        // PUT: api/Appointment/5
        [HttpPost("update/{id}")]
        public ActionResult<Appointment> Put(int id, [FromBody]Appointment appointment)
        {
            //Check if the dates are correct
            if (appointment.Start > appointment.End ||
                appointment.End < System.DateTime.Now ||
                appointment.Title == "")
                return NotFound();

            var appointmentBdd = appointmentContext.Appointments.First(app => app.Id == id);
      
            if (appointmentBdd == null)
                return NoContent();

            appointmentBdd.IsPublic = appointment.IsPublic;
            appointmentBdd.Title = appointment.Title;
            appointmentBdd.Notes = appointment.Notes;
            appointmentBdd.Start = appointment.Start;
            appointmentBdd.End = appointment.End;

            appointmentContext.SaveChanges();

            return appointment;
        }

        /**
         * Create and save a new appointments in the db
         * @param : the appointments created with the JSON data from the post request
         * @return : the appointments we just created
         */
        [HttpPost("create")]
        public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
        {
            //Check if the dates are correct
            if (appointment.Start > appointment.End ||
                appointment.End < System.DateTime.Now ||
                appointment.Title == "")
                return NotFound();

            appointmentContext.Appointments.Add(appointment);
            await appointmentContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }

        /**
         * delete a appointments for a given id
         * @param : id, the id of the appointments we want to delete
         * @return : JSON containing an error message or nothing
         */
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

        /**
         * Get all the appointments for a gicven user
         * @param : id, the id of the user we want to get all the appointments of
         * @return : the appointments of a specific user
         */
        // Get for user : api/Appointment/ForUser/id
        [HttpGet("ForUser/{userId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentForUser(long userId)
        {
            var appointments = appointmentContext.Appointments.Where(a => a.UserId == userId).ToList();

            if (appointments == null)
            {
                return NotFound();
            }

            for (int i = appointments.Count - 1; i >= 0; i--)
            {
                if (appointments.ElementAt(i).End < System.DateTime.Now)
                {
                    appointmentContext.Remove(appointments.ElementAt(i));
                    appointments.RemoveAt(i);
                }
            }
            appointmentContext.SaveChanges();

            return appointments;
        }
    }
}