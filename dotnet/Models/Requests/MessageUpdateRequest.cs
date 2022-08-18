using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Message
{
    public class MessageUpdateRequest : MessageAddRequest, IModelIdentifier
    {
        [Required]
        [Range(1, 100)]
        public int Id { get; set; }
    }
}
