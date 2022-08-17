import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { HiSearch } from 'react-icons/hi';

function ChatUsers(props) {
    return (
        <Card>
            <Card.Body className="p-0">
                <div className="tab-content">
                    <div className="tab-pane show active">
                        <div className="app-search p-3">
                            <div className="form-group position-relative">
                                <HiSearch />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="People, groups & messages..."
                                    //onKeyUp={(e) => search(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <SimpleBar className="px-3" style={{ maxHeight: '550px', width: '100%' }}>
                    <Link
                        to="#"
                        //key={index}
                        className="text-body"
                        //   onClick={(e) => {
                        //       activateUser(user);
                        //   }}
                    >
                        <div className={classnames('d-flex', 'align-items-start', 'mt-1', 'p-2', 'bg-light')}>
                            <img
                                src={props.selectedUser.avatarUrl}
                                className="me-2 rounded-circle"
                                height="48"
                                alt=""
                            />

                            <div className="w-100 overflow-hidden">
                                <h5 className="mt-0 mb-0 font-14">
                                    <span className="float-end text-muted font-12">5:00</span>
                                    {`${props.selectedUser.firstName} ${props.selectedUser.lastName}`}
                                </h5>
                                <p className="mt-1 mb-0 text-muted font-14">
                                    <span className="w-25 float-end text-end">
                                        <span className="badge badge-danger-lighten">4</span>
                                    </span>
                                    <span className="w-75">Last Message</span>
                                </p>
                            </div>
                        </div>
                    </Link>
                </SimpleBar>
            </Card.Body>
        </Card>
    );
}

ChatUsers.propTypes = {
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

export default ChatUsers;
