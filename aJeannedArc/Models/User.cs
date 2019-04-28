using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace aJeannedArc.Models
{
    public class User
    {
        public long Id { get; set; }
        public String Username { get; set; }
        public String Email { get; set; }
        public String Password { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
    }
}
