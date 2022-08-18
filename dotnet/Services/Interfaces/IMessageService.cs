using Sabio.Models;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests.Message;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IMessageService
    {
        Message Get(int id);

        Paged<Message> GetAll(int pageIndex, int pageSize);

        int Add(MessageAddRequest model, int senderId);

        void Update(MessageUpdateRequest model, int senderId);

        void Delete(int id);

        Paged<Message> CreatedByGet(int id, int pageIndex, int pageSize);

        public List<Conversation> GetConvoMessages(int id);


    }
}
