using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace aJeannedArc.Models
{
    public class Appointment
    {
        public long Id { get; set; }
        public String Title { get; set; }
        public String Notes { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public bool IsPublic { get; set; }
        public bool HasPassed { get; set; }
        public int UserId { get; set; }
    }
}
