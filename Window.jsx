import React from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import debug from 'sabio-debug';
//import { /*Card , Row, Col */ } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';

const _logger = debug.extend('Window');
function Window(props) {
    _logger('window props', props);
    const chat = props.chat.map((m, i) => <Message key={i} message={m} toUser={props.toUser} />);

    return (
        <SimpleBar style={{ height: '538px', width: '100%' }}>
            <ul className="conversation-list px-3">{chat}</ul>
        </SimpleBar>
    );
}

Window.propTypes = {
    userId: PropTypes.number,
    chat: PropTypes.arrayOf(
        //change props
        PropTypes.shape({
            user: PropTypes.string,
            message: PropTypes.string,
        })
    ),
    toUser: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        mi: PropTypes.string,
        avatarUrl: PropTypes.string,
        dateCreated: PropTypes.string,
        dateModified: PropTypes.string,
    }),
};

export default Window;
