import React from 'react';
import PropTypes from 'prop-types';

import Swiper from 'swiper';

/* This component manages and renders the event
preview panel on the main page of the AIPS web app,
which contains a slider displaying upcoming events.  */
class Preview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentEvent: 0,
            calendarIsOpen: false,
            detailModal: false,
        };

        this.swiper = new Swiper('.blog-slider', {
            spaceBetween: 30,
            effect: 'fade',
            loop: true,
            mousewheel: {
              invert: false,
            },
            // autoHeight: true,
            pagination: {
              el: '.blog-slider__pagination',
              clickable: true,
            }
          });

        // Swap events every 10 seconds
        this.timer = 10000;
        this.toggleEventDetails = this.toggleEventDetails.bind(this);
    }

    /* This function advances the slider to the next event. */
    advance() {
        this.setState((state) => {
            if (state.currentEvent >= this.props.events.length - 1)
                return {currentEvent: 0};
            return {currentEvent: state.currentEvent + 1};
        });

        setTimeout(this.advance.bind(this), this.timer);
    }

    componentDidMount() {
        setTimeout(this.advance.bind(this), this.timer);
    }

    /* This function toggles the event details modal view
    when an event is clicked. NOTE: CURRENTLY UNUSED. */
    async toggleEventDetails(e) {
        const selectedEvent = await this.props.events.filter((event) => (
            event.name === e.title
        ));
        await this.setState({ selectedEvent: selectedEvent[0], detailModal: !this.state.detailModal });
    }

    render() {
        const { events } = this.props;
        let event = events[this.state.currentEvent];

        /* If there are no upcoming events, render
        a default slider. */
        if (event == null) {
            event = {
                image: "defaultImage.png",
                startDate: "10-28-2015",
                startTime: "0:00",
                name: "Hmm... Nothing going on this week",
                description: "Add your event here",
                endDate: "10-28-2015",
                endTime: "11:59",
                Group: {
                    id: "#",
                    name: "Display Calendar"
                }
            }
        }

        const imagePath = event.image ? "/resources/img/buildings/" + event.image : "/resources/img/buildings/defaultImage.png";

        /* Generate a slider for the current displayed event, containing
        event image, name, description, date, time, and group. */
        const blog_slider = (
            <div className="blog-slider">
                <div className="blog-slider__wrp swiper-wrapper">
                    <div className="blog-slider__item swiper-slide">
                        <div className="blog-slider__img">
                            <img src={imagePath} alt="Event Image"></img>
                        </div>
                        <div className="blog-slider__content">
                            <span className="blog-slider__code">{event.startDate} at {event.startTime}</span>
                            <div className="blog-slider__title"><a href="/" onClick={this.toggleEventDetails}>{event.name}</a></div>
                            <div className="blog-slider__text">
                                { event.description.length > 175 &&
                                    event.description.slice(0,175) + '...'
                                }
                                { event.description.length <= 175 &&
                                    event.description
                                }
                            </div>
                            <a href={`/group/${event.Group.id}`} className="blog-slider__button">
                                {event.Group.name}
                            </a>
                        </div>
                    </div>
                </div>
                <div className="blog-slider__pagination"></div>
            </div>
        );

        return (
            <React.Fragment>
                {blog_slider}
                {/* { selectedEvent && selectedEvent.Group &&
                    <Modal isOpen={this.state.detailModal} toggle={this.toggleEventDetails} unmountOnClose={this.state.unmountOnClose}>
                        <ModalHeader>{selectedEvent.name}</ModalHeader>
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
                            <br />
                            <div className="text-right">
                                Hosted by <a href={`/group/${selectedEvent.Group.id}`}>{selectedEvent.Group.name}</a>
                            </div>
                        </ModalBody>
                    </Modal>
                } */}
            </React.Fragment>
        );
    }
}

Preview.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Preview;
