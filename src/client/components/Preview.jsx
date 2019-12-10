import React from 'react';
import PropTypes from 'prop-types';

class Preview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentEvent: 0,
            calendarIsOpen: false
        };

        // Swap events every 10 seconds
        this.timer = 10000;
    }

    // Advance the slider to the next event
    advance() {
        this.setState((state) => {
            console.log(state.currentEvent);
            if (state.currentEvent >= this.props.events.length - 1)
                return {currentEvent: 0};
            return {currentEvent: state.currentEvent + 1};
        });

        setTimeout(this.advance.bind(this), this.timer);
    }

    componentDidMount() {
        setTimeout(this.advance.bind(this), this.timer);
    }

    render() {
        const { events } = this.props;
        let event = events[this.state.currentEvent];

        if (event == null) {
            event = {
                imagePath: "",
                startDate: "01-01-1969",
                startTime: "0:00",
                name: "Hmm... Nothing going on this week",
                description: "Add your event here",
                Group: {
                    name: "Display Calendar"
                }
            }
        }

        const imagePath = "/resources/img/buildings/" + event.image;

        const blog_slider = (
            <div className="blog-slider">
                <div className="blog-slider__wrp swiper-wrapper">
                    <div className="blog-slider__item swiper-slide">
                        <div className="blog-slider__img">
                            <img src={imagePath} alt="Event Image"></img>
                        </div>
                        <div className="blog-slider__content">
                            <span className="blog-slider__code">
                                {event.startDate} at {event.startTime}
                            </span>
                            <div className="blog-slider__title">
                                {event.name}
                            </div>
                            <div className="blog-slider__text">
                                {event.description}
                            </div>
                            <a href="#" className="blog-slider__button">
                                {event.Group.name}
                            </a>
                        </div>
                    </div>
                </div>
                <div className="blog-slider__pagination"></div>
            </div>
        );
        return blog_slider;
    }
}

Preview.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Preview;
