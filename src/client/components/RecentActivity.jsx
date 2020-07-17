import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, CardHeader, CardTitle, CardText, Card, CardBody } from 'reactstrap';

import PostForm from '../components/PostForm';

import axios from 'axios';

/* This component manages and renders the recent
activity panel on the main page of the AIPS web app,
which generates and renders cards for the eight
most recent posts.  */
class RecentActivity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
        };
        
        this.generatePosts = this.generatePosts.bind(this);
    }

    async componentDidMount() {
        await axios.get('/post')
            .then((result) => {
                this.setState({ posts: result.data.posts });
            });
    }

    /* This function maps the eight most recent posts to a
    Card displaying post information, such as title, group,
    and content. */
    generatePosts(posts) {
        const generatedPosts = posts.map((post) => {
            return (
                <Col className="col-3 pb-4" key={post.id}>
                    <Card body outline color="danger" className="d-flex justify-content-center">
                    <CardHeader color="danger">{post.title} ~ <a href={`/group/${post.Group.id}`}>{post.Group.name}</a> ~</CardHeader>
                        <CardBody>
                            <CardText>{post.content}</CardText>
                            <CardText className="text-right">
                                <small className="text-muted">Updated {post.updatedAt}</small>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            );
        });

        return generatedPosts;
    }


    render() {
        const { posts } = this.state;
        const { groups } = this.props;

        const generatedPosts = this.generatePosts(posts);

        //Renders a table of recent posts
        return (
            <div className="pt-4">
                <h1 className="text-black text-center"><strong>Recent Posts</strong></h1><br/>
                <Row className="row justify-content-around">
                    {generatedPosts}
                </Row>
            </div>
        );
    }

}

RecentActivity.propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default RecentActivity;