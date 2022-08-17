import React, { useState } from 'react';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { messageFormSchema } from '../../schema/messageFormSchema';
import { Link } from 'react-router-dom';
import { TbPaperclip } from 'react-icons/tb';
import { FaSmileWink } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import messagesService from '../../services/messagesService';

const _logger = debug.extend('Input');

const Input = (props) => {
    _logger('input props', props);
    const [message] = useState({
        message: '',
    });

    const onHandleSubmit = (e) => {
        _logger('handle ', e.message, props.selectedUser);
        const newMessage = e.message;
        const isMessageProvided = newMessage && newMessage !== '';
        _logger(newMessage);
        if (isMessageProvided) {
            props.sendMessage(props.selectedUser, newMessage);
        } else {
            _logger('Please insert a message.');
        }

        let messageObj = {
            messageContent: newMessage,
            subject: 'new message',
            recipientId: props.selectedUser.userId,
        };

        messagesService.newMessage(messageObj).then(onNewMessageSuccess).catch(onNewMessageError);
    };

    const onNewMessageSuccess = (response) => {
        _logger(response.item);
    };

    const onNewMessageError = (error) => {
        _logger(error);
    };

    return (
        <Row className="px-3 pb-3">
            <Col>
                <div className="mt-2 bg-light p-3 rounded">
                    <Formik
                        enableReinitialize={true}
                        initialValues={message}
                        onSubmit={onHandleSubmit}
                        validationSchema={messageFormSchema}>
                        <Form>
                            <div className="row">
                                <div className="col mb-2 mb-sm-0">
                                    <div className="form-group">
                                        <Field name="message" placeholder={'Enter your text'} />
                                        <ErrorMessage name="message" />
                                    </div>
                                </div>
                                <div className="col-sm-auto">
                                    <div className="btn-group">
                                        <Link to="#" className="btn btn-light">
                                            <TbPaperclip />
                                        </Link>
                                        <Link to="#" className="btn btn-light">
                                            {' '}
                                            <FaSmileWink />{' '}
                                        </Link>
                                        <button type="submit" className="btn btn-success chat-send btn-block">
                                            <IoSend />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </Col>
        </Row>
    );
};

Input.propTypes = {
    toUser: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        mi: PropTypes.string,
        dateCreated: PropTypes.string,
        dateModified: PropTypes.string,
    }),
    selectedUser: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        mi: PropTypes.string,
        dateCreated: PropTypes.string,
        dateModified: PropTypes.string,
    }),
    sendMessage: PropTypes.func,
};

export default Input;
