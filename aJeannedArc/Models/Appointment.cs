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
        public String Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsPublic { get; set; }
        public bool HasPassed { get; set; }
    }
}
