import React from 'react';
import PropTypes from 'prop-types';

import { Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EventForm from './EventForm.jsx';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';

const localizer = momentLocalizer(moment);

class CalendarPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formModal: false,
            e: {},
            detailModal: false,
            unmountOnClose: false,
            events: [],
            selectedEvent: {},
        };

        this.toggleEventDetails = this.toggleEventDetails.bind(this);
        this.toggleEventForm = this.toggleEventForm.bind(this);
        this.addToGoogleCalendarHandler = this.addToGoogleCalendarHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const events = props.events.map((event) => {

            const start = convertStringsToInsertFormat(event.startDate, event.startTime);
            const end = convertStringsToInsertFormat(event.endDate, event.endTime);

            return (
                {
                    start: start,
                    end: end,
                    title: event.name,
                }
            );
        });
        
        return { events: events };
    }

    toggleEventForm(e) {
        this.setState({ e: e });
        this.setState({ formModal: !this.state.formModal });
    }

    async toggleEventDetails(e) {
        const selectedEvent = await this.props.events.filter((event) => (
            event.name === e.title
        ));
        await this.setState({ selectedEvent: selectedEvent[0], detailModal: !this.state.detailModal });
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

    async addToGoogleCalendarHandler() {
        // https://developers.google.com/calendar/create-events
        // verify whether user is true && connected with google calendars
        // const { googleCalendar } = this.props;
        // const { selectedEvent } = this.state;
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

    render() {
        const { events, selectedEvent, } = this.state;
        const { modal, toggleCalendar, user, isUserInGroup, googleCalendar } = this.props;

        const googleButton = (
            <Button outline color="primary" onClick={this.addToGoogleCalendarHandler}>
                Add to <i className="fab fa-google"></i> <i className="fas fa-calendar-alt"></i>
            </Button>
        );

        return (
            <div>
                <Modal size="lg" isOpen={modal} toggle={toggleCalendar} unmountOnClose={this.state.unmountOnClose}>
                    <ModalBody>
                        <div className="pb-2">
                            <Calendar 
                                localizer={localizer}
                                defaultDate={new Date()}
                                defaultView="month"
                                events={events}
                                style={{ height: "80vh" }}
                                views={[ 'month', 'day' ]}
                                selectable={true}
                                onSelectSlot={this.toggleEventForm}
                                onSelectEvent={this.toggleEventDetails}
                            />
                        </div>
                        <EventForm 
                            toggleEventForm={this.toggleEventForm}
                            formModal={this.state.formModal}
                            e={this.state.e || {}}
                            groups={this.props.groups || []}
                            csrfToken={this.props.csrfToken}
                            images={this.props.images}
                        />
                        { selectedEvent && selectedEvent.Group &&
                            <Modal isOpen={this.state.detailModal} toggle={this.toggleEventDetails} unmountOnClose={this.state.unmountOnClose}>
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
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

// returns new Date Type
function convertStringsToInsertFormat(date, time) {
    // yyyy/MM/dd to [yyyy, MM, dd]
    const dateArray = date.split('-');
    // hh:mm to [hh, mm]
    const timeArray = time.split(':');

    return new Date(
        Number(dateArray[0]),
        Number(dateArray[1] - 1),
        Number(dateArray[2]),
        Number(timeArray[0]),
        Number(timeArray[1])
        );
}

CalendarPanel.propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
    toggleCalendar: PropTypes.func.isRequired,
    modal: PropTypes.bool.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    user: PropTypes.object.isRequired,
    isUserInGroup: PropTypes.bool,
    googleCalendar: PropTypes.object.isRequired,
}

export default CalendarPanel;