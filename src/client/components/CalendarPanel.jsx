import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalBody } from 'reactstrap';
import EventForm from './EventForm.jsx';
import EventDetails from './EventDetails.jsx';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

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
            currentImage: "/resources/img/default/default_group.png",
            customImageSelection: false
        };

        this.toggleEventDetails = this.toggleEventDetails.bind(this);
        this.toggleEventForm = this.toggleEventForm.bind(this);
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

    toggleEventDetails(e) {
        this.setState({ e: e });
        this.setState({ detailModal: !this.state.detailModal });
    }

    render() {
        const { events } = this.state;
        const { modal, toggleCalendar, user, isUserInGroup } = this.props;

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
                        <EventDetails
                            e={this.state.e || {}}
                            toggleEventDetails={this.toggleEventDetails}
                            detailModal={this.state.detailModal}
                            isUserInGroup={isUserInGroup}
                            events={this.props.events}
                            csrfToken={this.props.csrfToken}
                        />
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
}

export default CalendarPanel;