using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace aJeannedArc.Models
{
    public class Reminder
    {
        public long Id { get; set; }
        public String Title { get; set; }
        public DateTime Date { get; set; }
        public Boolean IsFinished { get; set; }
    }
}
