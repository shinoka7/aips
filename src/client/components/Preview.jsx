import React from 'react';
import PropTypes from 'prop-types';
import Swiper from 'swiper';

class Preview extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const blog_slider = (
            <div className="blog-slider">
                <div className="blog-slider__wrp swiper-wrapper">
                    <div className="blog-slider__item swiper-slide">
                        <div className="blog-slider__img">
                            <img src="/resources/img/buildings/empac2.jpg" alt="Event Image"></img>
                        </div>
                        <div className="blog-slider__content">
                            <span className="blog-slider__code">Saturday at 2:00pm</span>
                            <div className="blog-slider__title">RMA Winter Concert</div>
                            <div className="blog-slider__text">This Saturday, join the Rensselaer Music Association at EMPAC for our annual winter concert, featuring several of our talented performing groups.</div>
                            <a href="#" className="blog-slider__button">READ MORE</a>
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

};

export default Preview;
