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
        };

        this.toggle = this.toggle.bind(this);
        this.addToGoogleCalendarHandler = this.addToGoogleCalendarHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
    }

    componentDidUpdate(prevProps){
        if(prevProps.detailModal !== this.props.detailModal){
            const { e } = this.props;
            const selectedEvent = this.props.events.filter((event) => (
                event.name === e.title
            ));
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
        // https://developers.google.com/calendar/create-events
        // verify whether user is true && connected with google calendars
        // const { googleCalendar } = this.props;
        // const { selectedEvent } = this.props;
        // if (googleCalendar.events && selectedEvent.groupId) {
        //     const newEvent = {
        //         summary: selectedEvent.name,
        //         description: selectedEvent.description,
        //         organizer: {
        //             displayName: selectedEvent.Group.name,
        //             email: selectedEvent.Group.groupEmail
        //         },
        //         start: {
        //             date: selectedEvent.startDate
        //         },
        //         end: {
        //             date: selectedEvent.endDate
        //         },
        //     };
        //     await googleCalendar.Events.insert({
        //         calendarId: 'primary',
        //         resource: newEvent,
        //       }, function(err, newEvent) {
        //         if (err) {
        //           console.log('There was an error contacting the Calendar service: ' + err);
        //           return;
        //         }
        //         console.log('Event created: %s', newEvent.htmlLink);
        //       });
        // }
        // THIS ===================================================
        // https://www.npmjs.com/package/react-google-calendar-api
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

    render() {
        const { isUserInGroup } = this.props;
        const { selectedEvent } = this.state;

        const googleButton = (
            <Button outline color="primary" onClick={this.addToGoogleCalendarHandler}>
                Add to <i className="fab fa-google"></i> <i className="fas fa-calendar-alt"></i>
            </Button>
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
                            <b>
                            <h5>{selectedEvent.description}</h5>
                            <br />
                            Starts: [{selectedEvent.startDate}] at {selectedEvent.startTime}
                            <br />
                            Ends: [{selectedEvent.endDate}] at {selectedEvent.endTime}
                            </b>
                            <div className="text-right">
                                Hosted by <a href={`/group/${selectedEvent.Group.id}`}>{selectedEvent.Group.name}</a>
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