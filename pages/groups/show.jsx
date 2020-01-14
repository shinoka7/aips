import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, CardBody,
    CardText, CardImg, Col, Row, Nav,
    Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import GroupForm from '../../src/client/components/group/GroupForm.jsx';
import FilterPanel from '../../src/client/components/group/FilterPanel.jsx';

import axios from 'axios';

class GroupsDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            groups: [],
            groupNames: [],
            currentPage: 1,
            totalPages: 1,
            categoryId: 0,
        };

        this.generatePagination = this.generatePagination.bind(this);
        this.changePage = this.changePage.bind(this);
        this.init = this.init.bind(this);
    }

    static async getInitialProps(context) {
        return context.query || {};
    }

    async init(categoryId) {
        const { currentPage } = this.state;
        this.setState({ categoryId: categoryId });
        await axios.get(`/group/page/${categoryId}/${currentPage}`).then((res) => {
            this.setState({
                user: res.data.user,
                groups: res.data.groups,
                totalPages: res.data.totalPages
            });
        });
        const groupNames = [];
        await this.state.groups.forEach((group) => {
            groupNames.push(group.name);
        });
        this.setState({ groupNames: groupNames });
    }

    async componentDidMount() {
        await this.init(0);
    }

    generatePagination(paginationItems) {
        const { currentPage, totalPages } = this.state;
        return (
            <Pagination aria-label='pagenavigation'>
                <PaginationItem>
                    <PaginationLink
                        first
                        onClick={(e) => this.changePage(e, 1)}
                        disabled={currentPage === 1}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        previous
                        onClick={(e) => this.changePage(e, currentPage - 1)}
                        disabled={currentPage - 1 < 1}
                    />
                </PaginationItem>
                {paginationItems}
                <PaginationItem>
                    <PaginationLink
                        next
                        onClick={(e) => this.changePage(e, currentPage + 1)}
                        disabled={currentPage + 1 > totalPages}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        last
                        onClick={(e) => this.changePage(e, totalPages)}
                        disabled={currentPage === totalPages}
                    />
                </PaginationItem>
            </Pagination>
        );
    }

    async changePage(e, page) {
        e.preventDefault();

        await this.setState({ currentPage: page });
        await this.init(this.state.categoryId);
    }

    render() {
        const { groups, totalPages, groupNames, user } = this.state;
        const groupList = groups.map((group) => {
            return (
                // Images, description
                <Col className="col-5 pt-4" key={group.id}>
                    <Card className="text-center" body outline color="secondary">
                        <Row>
                            <Col className="d-flex justify-content-center" md="12" lg="3">
                                <div className="card_image">
                                    <CardImg src="/resources/img/default/default_group.png" />
                                </div>
                            </Col>
                            <Col md="12" lg="9">
                                <CardHeader><a href={`/group/${group.id}`}>{group.name}</a></CardHeader>
                                <CardBody>
                                <CardText>
                                    { group.description.length > 210 &&
                                        group.description.slice(0,210) + '...'                                    
                                    }
                                    { group.description.length <= 210 &&
                                        group.description                               
                                    }
                                </CardText>
                                </CardBody>
                            </Col>
                        </Row>

                    </Card>
                </Col>
            );
        });

        const paginationItems = [];
        for (let page = 1; page <= totalPages; page++) {
            paginationItems.push(
                <PaginationItem key={page}>
                    <PaginationLink onClick={(e) => this.changePage(e, page)}>
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        const pagination = this.generatePagination(paginationItems);

        return(
            <div className="pt-3 text-right">
                <Nav pills className="text-center">
                    <FilterPanel categories={this.props.categories} filter={this.init}/>
                    <GroupForm
                        user={user}
                        groupNames={groupNames}
                        categories={this.props.categories}
                        csrfToken={this.props.csrfToken}
                    />
                </Nav>
                <Row className="row justify-content-around">
                    {groupList}
                </Row>
                <Row className="fixed-bottom pt-3 pb-4 d-flex justify-content-center">
                    {pagination}
                </Row>
            </div>
        );
    }

}

GroupsDetail.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default GroupsDetail;