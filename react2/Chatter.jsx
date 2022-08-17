import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import debug from 'sabio-debug';
import Window from './Window';
import Input from './Input';
import PropTypes from 'prop-types';
import { API_HOST_PREFIX } from '../../services/serviceHelpers';
import messagesService from '../../services/messagesService';
import { Card, Row, Col } from 'react-bootstrap';
import ChatProfile from './ChatProfile';
import ChatUsers from './ChatUsers';

const _logger = debug.extend('Chatter');

function Chatter(props) {
    _logger('chatter props', props);

    const onGetConvoSuccess = (response) => {
        _logger('chatter convos', response);
        let selectedUserId = null;

        setToUser(() => {
            let user = {};

            if (response.item[0].senderProfile.userId === props.currentUser.id) {
                user = response.item[0].senderProfile;
                selectedUserId = response.item[0].recipientProfile;
            } else {
                user = response.item[0].recipientProfile;
                selectedUserId = response.item[0].senderProfile;
            }

            return user;
        });

        setSelectedUser(selectedUserId);

        setChat((prevState) => {
            let convo = [...prevState];
            let newConvo = response.item;

            for (let i = 0; i < newConvo.length; i++) {
                let message = {
                    to: newConvo[i].recipientProfile,
                    message: newConvo[i].messageContent,
                    from: newConvo[i].senderProfile,
                    dateSent: newConvo[i].dateSent,
                    dateRead: newConvo[i].dateRead,
                };
                convo.push(message);
            }
            return convo;
        });
    };

    const onGetConvoError = (error) => {
        _logger('error', error);
    };

    useEffect(() => {
        _logger('Chatter props', props);
        messagesService.getConvo(props.currentUser.id).then(onGetConvoSuccess).catch(onGetConvoError);
    }, [props.currentUser.id]);

    const [connection, setConnection] = useState(null);
    const [chat, setChat] = useState([]);
    const latestChat = useRef(null);
    const [toUser, setToUser] = useState({});
    const [selectedUser, setSelectedUser] = useState({});

    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${API_HOST_PREFIX}/hubs/chat`)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then((result) => {
                    _logger('Connected!', result);

                    connection.on('ReceiveMessage', (message) => {
                        _logger('recieve message', message);
                        setChat((prevState) => {
                            let nChat = [...prevState];
                            nChat.push({
                                to: message.recipientProfile,
                                message: message.messageContent,
                                from: message.senderProfile,
                            });

                            return nChat;
                        });
                    });
                })
                .catch((e) => _logger('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async (user, message) => {
        const chatMessage = {
            senderProfile: { ...toUser },
            messageContent: message,
            recipientProfile: { ...user },
        };

        if (connection._connectionStarted) {
            try {
                await connection.send('SendMessage', chatMessage);
            } catch (e) {
                _logger(e);
            }
        } else {
            _logger('No connection to server yet.');
        }
    };

    const onUserChange = (user) => {
        _logger('changed user', user);
    };

    return (
        <React.Fragment>
            <br />
            <div className="center">
                <Row>
                    <Col xxl={{ span: 3, order: 1 }} xl={{ span: 6, order: 1 }}>
                        <ChatProfile selectedUser={selectedUser} />
                    </Col>

                    <Col xxl={5} xl={{ span: 12, order: 2 }}>
                        <Card>
                            <Card.Body className="position-relative px-0 pb-0">
                                <Window chat={chat} toUser={toUser} />
                                <Input sendMessage={sendMessage} toUser={toUser} selectedUser={selectedUser} />
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xxl={3} xl={{ span: 6, order: 2 }}>
                        <ChatUsers onUserSelect={onUserChange} selectedUser={selectedUser} />
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
}

Chatter.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        conversations: PropTypes.arrayOf(
            PropTypes.shape({
                senderProfile: PropTypes.shape({
                    userId: PropTypes.number,
                    avatarUrl: PropTypes.string,
                    firstName: PropTypes.string,
                    lastName: PropTypes.string,
                }),
                messageContent: PropTypes.string,
                recipientProfile: PropTypes.shape({
                    userId: PropTypes.number,
                    avatarUrl: PropTypes.string,
                    firstName: PropTypes.string,
                    lastName: PropTypes.string,
                }),
            })
        ),
    }),
};

export default Chatter;
