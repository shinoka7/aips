import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Calendar from 'react-calendar';

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: newDate(),
            showCalendar: false,
        };

        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    toggleCalendar() {
        this.setState({ showCalendar: !this.state.showCalendar });
    }
    
    onChange(date) {
        this.setState({ date: date });
    }

    render() {
        return (
            <div>
                <Button onClick={this.toggleCalendar} size="lg" className="btn btn-outline btn-info">
                    <i className="fas fa-calendar-alt"></i>
                </Button>

                <Calendar onChange={this.onChange} value={this.state.date} />
            </div>
        );
    }
}

Calendar.propTypes = {

}

export default Calendar;