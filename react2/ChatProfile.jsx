import React from 'react';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import { Card, Dropdown, Button } from 'react-bootstrap';
import { FiMoreHorizontal } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import { MdAlternateEmail } from 'react-icons/md';
import { BsTelephone, BsGlobe2 } from 'react-icons/bs';
import { MdOutlineLocationOn } from 'react-icons/md';

const _logger = debug.extend('ChatProfile');

function ChatProfile(props) {
    _logger('Chat Profile', props);
    return (
        <Card>
            <Card.Body>
                <Dropdown className="float-end" align="end">
                    <Dropdown.Toggle variant="link" className="arrow-none card-drop p-0 shadow-none">
                        <FiMoreHorizontal />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>View Full</Dropdown.Item>
                        <Dropdown.Item>Edit Contact Info</Dropdown.Item>
                        <Dropdown.Item>Remove</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <div className="mt-3 text-center">
                    <img src={props.selectedUser.avatarUrl} alt="" className="img-thumbnail avatar-lg rounded-circle" />
                    <h4>{`${props.selectedUser.firstName} ${props.selectedUser.lastName}`}</h4>
                    <Button className="btn-sm mt-1" color="primary">
                        <HiOutlineMail /> Send Email
                    </Button>
                    <p className="text-muted mt-2 font-14">
                        Last Interacted: <strong>5:00</strong>
                    </p>
                </div>

                <div className="mt-3">
                    <hr className="" />

                    <p className="mt-4 mb-1">
                        <strong>
                            <MdAlternateEmail /> Email:
                        </strong>
                    </p>
                    <p>useremail@email.com</p>

                    <p className="mt-3 mb-1">
                        <strong>
                            <BsTelephone /> Phone Number:
                        </strong>
                    </p>
                    <p>(123)-456-7890</p>

                    <p className="mt-3 mb-1">
                        <strong>
                            <MdOutlineLocationOn /> Location:
                        </strong>
                    </p>
                    <p>Here</p>

                    <p className="mt-3 mb-1">
                        <strong>
                            <BsGlobe2 /> Languages:
                        </strong>
                    </p>
                    <p>English</p>
                </div>
            </Card.Body>
        </Card>
    );
}

ChatProfile.propTypes = {
    selectedUser: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        avatarUrl: PropTypes.string,
        mi: PropTypes.string,
        dateCreated: PropTypes.string,
        dateModified: PropTypes.string,
    }),
};
export default ChatProfile;
