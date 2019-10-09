import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalBody } from 'reactstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

class CalendarPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            unmountOnClose: false,
            events: [
                {
                    start: new Date(),
                    end: new Date(moment().add(1, "days")),
                    title: "First Event",
                },
            ],
        };

        this.toggleCalendar = this.toggleCalendar.bind(this);
    }

    toggleCalendar() {
        this.setState({ modal: !this.state.modal });
    }
    
    onChange(date) {
        this.setState({ date: date });
    }

    render() {
        const { modal, events } = this.state;

        return (
            <div className="d-flex flex-row-reverse pr-4">
                <Button onClick={this.toggleCalendar} className="btn-floating btn-lg btn-info">
                    <i className="fas fa-calendar-alt"></i>
                </Button>

                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggleCalendar} unmountOnClose={this.state.unmountOnClose}>
                    <ModalBody>
                        <div className="pb-5">
                            <Calendar 
                                localizer={localizer}
                                defaultDate={new Date()}
                                defaultView="month"
                                events={events}
                                style={{ height: "80vh" }}
                                views={['month', 'day', 'agenda']}
                            />
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

CalendarPanel.propTypes = {

}

export default CalendarPanel;