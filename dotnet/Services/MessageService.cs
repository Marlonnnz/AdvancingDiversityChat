using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests.Message;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class MessageService : IMessageService
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;
        public MessageService(IAuthenticationService<int> authServ, IDataProvider dataProvider)
        {
            _authenticationService = authServ;
            _dataProvider = dataProvider;
        }

        public Message Get(int id)
        {
            string procName = "[dbo].[Message_SelectById]";
            Message message = null;

            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                message = MapMessage(reader, ref startingIndex);
            });

            return message;
        }

        public Paged<Message> GetAll(int pageIndex , int pageSize)
        {
            string procName = "[dbo].[Message_SelectAll]";
            Paged<Message> pagedList = null;
            List<Message> list = null;
            int totalCount = 0;

            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Message message = MapMessage(reader, ref startingIndex);
                totalCount = startingIndex++;

                if(totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if(list == null)
                {
                    list = new List<Message>();
                }

                list.Add(message);

            });

            if(list != null)
            {
                pagedList = new Paged<Message>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public int Add(MessageAddRequest model, int senderId)
        {
            int id = 0;
            string procName = "[dbo].[Message_Insert]";

            _dataProvider.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@SenderId", senderId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);

            }, delegate(SqlParameterCollection returnCol)
            {
                object oId = returnCol["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        public void Update(MessageUpdateRequest model, int senderId)
        {
            string procName = "[dbo].[Message_Update]";
            _dataProvider.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
                AddCommonParams(model, col);
                col.AddWithValue("@SenderId", senderId);

            }, null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Message_Delete]";
            _dataProvider.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, null);
        }

        public Paged<Message> CreatedByGet(int id, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Message_Select_ByCreatedBy]";
            Paged<Message> pagedList = null;
            List<Message> list = null;
            int totalCount = 0;

            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@CreatedBy", id);
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Message message = MapMessage(reader, ref startingIndex);

                totalCount = reader.GetSafeInt32(startingIndex++);

                if(totalCount == 0)
                {
                  totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if(list == null)
                {
                    list = new List<Message>();
                }

                list.Add(message);
            });

            if (list != null)
            {
                pagedList = new Paged<Message>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
            
        }

        public List<Conversation> GetConvoMessages(int id)
        {
            string procName = "[dbo].[RecipientProfile]";
            List<Conversation> list = null;

            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@recipientId", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Conversation convo = MapConvo(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Conversation>();
                }

                list.Add(convo);

            });

            return list;
        }
        private static void AddCommonParams(MessageAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Message", model.MessageContent);
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@RecipientId", model.RecipientId);
        }

        

        private static Message MapMessage(IDataReader reader, ref int index)
        {
            Message message = new Message();

            message.Id = reader.GetSafeInt32(index++);
            message.MessageContent = reader.GetSafeString(index++);
            message.Subject = reader.GetSafeString(index++);
            message.RecipientId = reader.GetSafeInt32(index++);
            message.SenderId = reader.GetSafeInt32(index++);
            message.DateSent = reader.GetSafeDateTime(index++);
            message.DateRead = reader.GetSafeDateTime(index++);
            message.DateModified = reader.GetSafeDateTime(index++);
            message.DateCreated = reader.GetSafeDateTime(index++);

            return message;

        }

        private static Conversation MapConvo(IDataReader reader, ref int index)
        {
            Conversation convo = new Conversation();

            convo.SenderProfile = UserProfileMapper(reader, ref index);
            convo.MessageContent = reader.GetSafeString(index++);
            convo.DateSent = reader.GetSafeDateTime(index++);
            convo.DateRead = reader.GetSafeDateTime(index++);
            convo.RecipientProfile = UserProfileMapper(reader, ref index);

            return convo;

        }
        private static UserProfile UserProfileMapper(IDataReader reader, ref int startingIndex)
        {
            UserProfile profile = new UserProfile();

            profile.Id = reader.GetSafeInt32(startingIndex++);
            profile.UserId = reader.GetSafeInt32(startingIndex++);
            profile.FirstName = reader.GetSafeString(startingIndex++);
            profile.LastName = reader.GetSafeString(startingIndex++);
            profile.Mi = reader.GetSafeString(startingIndex++);
            profile.AvatarUrl = reader.GetSafeString(startingIndex++);
            profile.DateCreated = reader.GetSafeDateTime(startingIndex++);
            profile.DateModified = reader.GetSafeDateTime(startingIndex++);

            return profile;
        }

    }
}
