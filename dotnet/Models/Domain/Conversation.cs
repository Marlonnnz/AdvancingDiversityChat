using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Messages
{
    public class Conversation
    {    
        public UserProfile SenderProfile { get; set; }
        public string MessageContent { get; set; }
        public DateTime DateSent { get; set; }
        public DateTime DateRead { get; set; }
        public UserProfile RecipientProfile { get; set; }
    }
}
