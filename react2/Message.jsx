import React from 'react';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import classnames from 'classnames';
import { Dropdown } from 'react-bootstrap';
import { CgMoreVerticalO } from 'react-icons/cg';

const _logger = debug.extend('Message');

function Message(props) {
    _logger(props);
    return (
        <li
            key={props.key}
            className={classnames('clearfix', { odd: props.message.from.userId === props.toUser.userId })}>
            <div className="chat-avatar">
                <img src={props.message.from.avatarUrl} className="rounded" alt="" />
                <i>{new Date().getHours() + ':' + new Date().getMinutes()}</i>
            </div>

            <div className="conversation-text">
                <div className="ctext-wrap">
                    <i>{`${props.message.from.firstName} ${props.message.from.lastName}`}</i>
                    <p>{props.message.message}</p>
                </div>
            </div>

            <Dropdown className="conversation-actions" align="end">
                <Dropdown.Toggle variant="link" className="btn btn-sm btn-link arrow-none shadow-none">
                    <CgMoreVerticalO />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item>Copy Message</Dropdown.Item>
                    <Dropdown.Item>Edit</Dropdown.Item>
                    <Dropdown.Item>Delete</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </li>
    );
}

Message.propTypes = {
    key: PropTypes.number,
    message: PropTypes.shape({
        to: PropTypes.shape({
            id: PropTypes.number,
            userId: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            avatarUrl: PropTypes.string,
            mi: PropTypes.string,
            dateCreated: PropTypes.string,
            dateModified: PropTypes.string,
        }),
        message: PropTypes.string,
        from: PropTypes.shape({
            id: PropTypes.number,
            userId: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            avatarUrl: PropTypes.string,
            mi: PropTypes.string,
            dateCreated: PropTypes.string,
            dateModified: PropTypes.string,
        }),
    }),
    toUser: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        mi: PropTypes.string,
        dateCreated: PropTypes.string,
        dateModified: PropTypes.string,
    }),
};

export default Message;
