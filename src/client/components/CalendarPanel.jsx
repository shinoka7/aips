import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';

const localizer = momentLocalizer(moment);

class CalendarPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            nestedModal: false,
            unmountOnClose: false,
            events: [],
            newEvent: {
                groupId: undefined,
                start: new Date(),
                end: new Date(),
                name: '',
                description: '',
            },
        };

        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.toggleEventForm = this.toggleEventForm.bind(this);
        this.generateGroupOptions = this.generateGroupOptions.bind(this);
        this.setGroupId = this.setGroupId.bind(this);
        this.setName = this.setName.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.createHandler = this.createHandler.bind(this);
        this.validate = this.validate.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const events = props.events.map((event) => {
            return (
                {
                    start: new Date(event.startAt),
                    end: new Date(event.endAt),
                    title: event.name,
                }
            );
        });
        
        return { events: events };
    }

    toggleCalendar() {
        this.setState({ modal: !this.state.modal });
    }

    toggleEventForm(e) {
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                start: e.start,
                end: e.end,
            }
        }));
        this.setState({ nestedModal: !this.state.nestedModal });
    }

    generateGroupOptions(groups) {
        const groupOptions = groups.map((group) => {
            return (
                <option key={group.id} value={group.id}>{group.name}</option>
            );
        });
        
        return groupOptions;
    }
    
    setGroupId(e) {
        const groupId = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                groupId: groupId,
            }
        }));
    }

    setName(e) {
        const name = e.target.value.trim();
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                name: name,
            }
        }));
    }

    setStartDate(e) {
        const date = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                start: date,
            }
        }));
    }

    setEndDate(e) {
        const date = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                end: date,
            }
        }));
    }

    setDescription(e) {
        const description = e.target.value.trim();
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                description: description,
            }
        }));
    }
    
    async createHandler() {
        const { groupId, start, end, name, description } = this.state.newEvent;
        const res = await axios.post('/event', {
            groupId,
            start: new Date(start),
            end: new Date(end),
            name,
            description,
            _csrf: this.props.csrfToken
        });
        window.location.reload();
    }

    validate() {
        const { start, end, name, groupId } = this.state.newEvent;
        return start && end && name !== '' && groupId;
    }

    render() {
        const { modal, events } = this.state;

        const groups = this.props.groups || [];
        const groupOptions = this.generateGroupOptions(groups);

        return (
            <div className="d-flex flex-row-reverse pr-4">
                <Button onClick={this.toggleCalendar} className="btn-floating btn-lg btn-info">
                    <i className="fas fa-calendar-alt"></i>
                </Button>

                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggleCalendar} unmountOnClose={this.state.unmountOnClose}>
                    <ModalBody>
                        <div className="pb-5 mb-2">
                            <Calendar 
                                localizer={localizer}
                                defaultDate={new Date()}
                                defaultView="month"
                                events={events}
                                style={{ height: "80vh" }}
                                views={[ 'month', 'week' ]}
                                selectable={true}
                                onSelectSlot={this.toggleEventForm}
                            />
                        </div>
                        <Modal isOpen={this.state.nestedModal} toggle={this.toggleEventForm} unmountOnClose={this.state.unmountOnClose}>
                            <ModalHeader toggle={this.toggleEventForm}>Create Event</ModalHeader>
                            <ModalBody>
                                <AvForm>
                                    <AvField
                                        type="select"
                                        name="group"
                                        label="Group"
                                        helpMessage="Choose the group you will create as"
                                        onChange={this.setGroupId}
                                        value={'default'}
                                    >
                                        <option value="default" disabled>--Select the Group--</option>
                                        {groupOptions}
                                    </AvField>
                                    <AvField name="name" label="Event Name" onChange={this.setName} required />
                                    <AvField
                                        name="startDateTime"
                                        label="Start Date"
                                        value={this.state.newEvent.start}
                                        type="text"
                                        onChange={this.setStartDate}
                                    />
                                    <AvField
                                        name="endDateTime"
                                        label="End Date"
                                        value={this.state.newEvent.end}
                                        type="text"
                                        onChange={this.setEndDate}
                                    />
                                    <AvField
                                        name="description"
                                        label="Description"
                                        value={this.state.newEvent.description}
                                        type="textarea"
                                        onChange={this.setDescription}
                                    />
                                </AvForm>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={this.createHandler} color="primary" disabled={!this.validate()}>Post</Button>
                                <Button onClick={this.toggleEventForm} color="secondary">Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

CalendarPanel.propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
}

export default CalendarPanel;