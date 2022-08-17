using Microsoft.AspNetCore.SignalR;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Interfaces;
using System.Threading.Tasks;


namespace Sabio.Web.Api.Controllers
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessage(Conversation message)
        {
            await Clients.All.ReceiveMessage(message);
        }
    }
}
