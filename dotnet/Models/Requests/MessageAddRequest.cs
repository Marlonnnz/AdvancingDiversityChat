using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Message
{
    public class MessageAddRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string MessageContent { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Subject { get; set; }
        [Required]
        [Range(1, 300)]
        public int RecipientId { get; set; }
        
    }
}
