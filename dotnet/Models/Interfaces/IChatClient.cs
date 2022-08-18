using Sabio.Models.Domain.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Interfaces
{
    public interface IChatClient
    {
        Task ReceiveMessage(Conversation message);
    }
}
