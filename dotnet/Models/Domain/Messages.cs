using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Messages
{
    public class Message : Conversation
    {
        public int Id { get; set; }
        
        public string Subject { get; set; }
        
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public DateTime DateModified { get; set; }
        public DateTime DateCreated { get; set; }

    }
}
