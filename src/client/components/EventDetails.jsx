import React from 'react';
import PropTypes from 'prop-types';

import { Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

class EventDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            detailModal: false,
            selectedEvent: {},
            userIsGoing: false,
            authUrl: '',
            user: {},
        };

        this.toggle = this.toggle.bind(this);
        this.addToGoogleCalendarHandler = this.addToGoogleCalendarHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.goingHandler = this.goingHandler.bind(this);
        this.authorizeGoogleCalendar = this.authorizeGoogleCalendar.bind(this);
    }

    async componentDidUpdate(prevProps){
        if(prevProps.detailModal !== this.props.detailModal){
            const { e } = this.props;
            const selectedEvent = this.props.events.filter((event) => (
                event.name === e.title
            ));
            const res = await axios.get(`/user/isGoing/${selectedEvent[0].id}`);
            const result = await axios.get('/auth/google/authUrl');

            this.setState({ user: res.data.user });
            this.setState({ authUrl: result.data.url });
            this.setState({ userIsGoing: res.data.userIsGoing });
            this.setState({ selectedEvent: selectedEvent[0] });
            this.setState({ detailModal: this.props.detailModal });
        }
    }

    toggle() {
        const { e } = this.props;
        const selectedEvent = this.props.events.filter((event) => (
            event.name === e.title
        ));
        this.setState({ selectedEvent: selectedEvent[0] });
        this.props.toggleEventDetails(e);
    }

    async addToGoogleCalendarHandler() {
        const { selectedEvent } = this.state;
        
        await Swal.fire({
            title: 'Add Event to Google Calendar',
            type: 'question',
            text: 'Are you sure?',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: 'primary',
            preConfirm: async() => {
                return await axios.get(`/auth/google/addEvent/${selectedEvent.id}`)
                .then((res) => {
                    if (res.status !== 200) {
                        throw new Error(res.statusText);
                    }
                    return res;
                })
                .catch((err) => {
                    Swal.showValidationMessage(
                        `Action Failed: ${err}`
                    );
                });
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
        .then((result) => {
            if (result.value) {
                Swal.fire({
                    title: 'Added!',
                    type: 'success'
                });
            }
        });
    }

    async deleteHandler() {
        const { selectedEvent } = this.state;
        const params = {
            eventId: selectedEvent.id,
            _csrf: this.props.csrfToken,
        };

        await Swal.fire({
            title: 'Delete Event',
            type: 'warning',
            text: 'Are you sure that you want to permanently delete this item',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#d33',
            cancelButtonColor: 'secondary',
            preConfirm: async() => {
                try {
                    return await axios.post('/event/delete', params);
                }
                catch(err) {
                    console.log(err);
                }
            }
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    'Deleted!',
                    'Your event has been deleted',
                    'success'
                ).then((res) => {
                    if (!res.dismiss) {
                        window.location.reload();
                    }
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Your event is safe',
                    'error'
                );
            }
        });
    }

    async goingHandler() {
        const { selectedEvent } = this.state;

        await axios.post('/event/going', {
            eventId: selectedEvent.id,
            _csrf: this.props.csrfToken,
        })
        .then((res) => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            else {
                this.setState({ userIsGoing: true });
            }
        })
        .catch((err) => {
            Swal.showValidationMessage(
                `Failed: ${err}`
            );
        });
    }

    authorizeGoogleCalendar() {
        window.location = this.state.authUrl;
    }

    render() {
        const { isUserInGroup } = this.props;
        const { selectedEvent, userIsGoing, user } = this.state;

        const googleButton = (
            user.googleToken ? (
                <Button outline color="primary" onClick={this.addToGoogleCalendarHandler}>
                    Add to <i className="fab fa-google"></i> <i className="fas fa-calendar-alt"></i>
                </Button>
            ) : (
                <Button disabled={!user.id} outline color="primary" onClick={this.authorizeGoogleCalendar}>
                    Allow usage for <i className="fab fa-google"></i> <i className="fas fa-calendar-alt"></i>
                </Button>
            )
        );

        const peopleGoing = (
            selectedEvent.goingCount === 1 ? (
                <React.Fragment>
                    {selectedEvent.goingCount} person going
                </React.Fragment> ) : 
                (
                    <React.Fragment>
                        {selectedEvent.goingCount} people going
                    </React.Fragment>
                )
        );

        return (
            <React.Fragment>
                { selectedEvent && selectedEvent.Group &&
                    <Modal isOpen={this.state.detailModal} toggle={this.toggle} unmountOnClose={this.state.unmountOnClose}>
                        <ModalHeader close={googleButton}>{selectedEvent.name}</ModalHeader>
                        <ModalBody>
                            { selectedEvent.image !== '' &&
                                <div>
                                    <img src={`/resources/img/buildings/${selectedEvent.image}`} className="image_preview" alt="Event Image"></img>
                                    <hr />
                                </div>
                            }
                            <h5>{selectedEvent.description}</h5>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <b>
                                    from {selectedEvent.startTime}, {selectedEvent.startDate}
                                    <br />
                                    to {selectedEvent.endTime}, {selectedEvent.endDate}
                                    </b>
                                </div>
                                <div className="ml-auto">
                                    <br />
                                    {peopleGoing}
                                </div>
                            </div><hr />
                            <div className="d-flex justify-content-between">
                                <div>
                                    Hosted by <a href={`/group/${selectedEvent.Group.id}`}>{selectedEvent.Group.name}</a>
                                </div>
                                <div className="ml-auto">
                                    <Button disabled={userIsGoing} onClick={this.goingHandler} size="sm" outline color="secondary">Going</Button>
                                </div>
                            </div>
                        </ModalBody>
                        { isUserInGroup &&
                            <ModalFooter>
                                <Row>
                                    <Col xs="6" sm="6" md="6">
                                        <Button color="link"><i className="fas fa-user-edit"></i> Edit</Button>
                                    </Col>
                                    <Col xs="6" sm="6" md="6">
                                        <Button color="link" onClick={this.deleteHandler}><i className="fas fa-trash-alt"></i> Delete</Button>
                                    </Col>
                                </Row>
                            </ModalFooter>
                        }
                    </Modal>
                }
            </React.Fragment>
        );
    }
}

EventDetails.propTypes = {
    e: PropTypes.object.isRequired,
    toggleEventDetails: PropTypes.func.isRequired,
    detailModal: PropTypes.bool.isRequired,
    isUserInGroup: PropTypes.bool,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default EventDetails;