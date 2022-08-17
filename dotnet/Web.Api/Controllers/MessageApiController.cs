using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests.Message;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageApiController : BaseApiController
    {
        private IMessageService _service = null;
        private IAuthenticationService<int> _authService = null;
        
        public MessageApiController(IMessageService service
            , ILogger<PingApiController> logger
            ,IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Message>> GetById(int id)
        {
            int code = 200;
            Message message = null;
            BaseResponse response = null;

            try
            {
                message = _service.Get(id);

                if (message == null)
                {
                    code = 404;
                    response = new ErrorResponse("Message not found.");
                }
                else
                {
                    response = new ItemResponse<Message>() { Item = message };
                }
            }catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<Message>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Message> paged = _service.GetAll(pageIndex, pageSize);
                if(paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Message Resources Not Found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Message>> { Item = paged };
                }
            }catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("conversations/{id:int}")]
        public ActionResult<ItemResponse<List<Conversation>>> GetConvo(int id)
        {
            int code = 200;
            BaseResponse response = null;
            List<Conversation> list= null;
            try
            {
              list = _service.GetConvoMessages(id);
              if(list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Messages not found");
                }
              else
                {
                    response = new ItemResponse<List<Conversation>>() { Item = list };
                }
            }catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response); 
        }       

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(MessageAddRequest model, int senderId)
        {
            ObjectResult result = null;
            senderId = 0;

            try
            {
                senderId = _authService.GetCurrentUserId();
                if (senderId == 0)
                {
                    ErrorResponse response2 = new ErrorResponse("User not logged in");
                    result = StatusCode(500, response2);
                }
                else
                {
                    int id = _service.Add(model, senderId);

                    ItemResponse<int> response = new ItemResponse<int> { Item = id };

                    result = Created201(response);
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(MessageUpdateRequest model, int senderId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                senderId = _authService.GetCurrentUserId();
                if (senderId == 0)
                {
                    code = 500;
                    response = new ErrorResponse("User not logged in");
                }
                else
                {
                    _service.Update(model, senderId);
                }

                response = new SuccessResponse();
            }catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("createdby")]
        public ActionResult<ItemResponse<Paged<Message>>> CreatedBy(int id, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            Paged<Message> paged = null;

            try
            {
                paged = _service.CreatedByGet(id, pageIndex, pageSize);

                if(paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Messages Not Found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Message>>() { Item = paged };
                }
            }catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}
