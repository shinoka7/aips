import React from 'react';
import PropTypes from 'prop-types';

import { Col, CardHeader, CardTitle, CardText, Card, CardBody } from 'reactstrap';


import PostForm from '../components/PostForm';

import axios from 'axios';

class RecentActivity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            groups: [],
        };
        
        this.generatePosts = this.generatePosts.bind(this);
    }

    async componentDidMount() {
        await axios.get('/post')
            .then((result) => {
                this.setState({ posts: result.data.posts });
            });
        await axios.get('/group')
            .then((result) => {
                this.setState({ groups: result.data.groups });
            });
    }

    generatePosts(posts) {
        const generatedPosts = posts.map((post) => {
            return (
                <Col className="pb-4" key={post.id}>
                    <Card body outline color="danger" className="d-flex justify-content-center">
                        <CardHeader color="danger"><a href={`/group/${post.Group.id}`}>{post.Group.name}</a></CardHeader>
                        {/* <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" /> */}
                        <CardBody>
                            <CardTitle>{post.title}</CardTitle>
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
        const { posts, groups } = this.state;

        const generatedPosts = this.generatePosts(posts);

        return (
            <div>
                <PostForm
                    groups={groups}
                />
                <div className="pt-4">
                    {generatedPosts}
                </div>
            </div>
        );
    }

}

RecentActivity.propTypes = {
};

export default RecentActivity;