import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, CardBody,
    CardText, CardImg, Col, Row, Nav,
    Pagination, PaginationItem, PaginationLink,
    Badge } from 'reactstrap';

import GroupForm from '../../src/client/components/group/GroupForm.jsx';
import FilterPanel from '../../src/client/components/group/FilterPanel.jsx';
import ResetButton from '../../src/client/components/group/ResetButton.jsx';
import GroupSearch from '../../src/client/components/group/GroupSearch.jsx';

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
            searchString: "",
            reset: false
        };

        this.generatePagination = this.generatePagination.bind(this);
        this.changePage = this.changePage.bind(this);
        this.init = this.init.bind(this);
        this.resetPage = this.resetPage.bind(this);
    }

    static async getInitialProps(context) {
        return context.query || {};
    }

    async init(categoryId, searchString) {
        const { currentPage } = this.state;
        this.setState({ searchString: searchString});
        this.setState({ categoryId: categoryId });

        /* If the search bar is empty, the groups shown are based only
        on the categoryID and currentPage. */
        if (searchString === undefined || searchString === "")
        {
            await axios.get(`/group/page/${categoryId}/${currentPage}`).then((res) => {
                this.setState({
                    user: res.data.user,
                    groups: res.data.groups,
                    totalPages: res.data.totalPages
                });
            });
        }
         /* Otherwise, the search string is included in the
         database query */
        else
        {
            await axios.get(`/group/page/${categoryId}/${currentPage}?searchString=${searchString}`).then((res) => {
                this.setState({
                    user: res.data.user,
                    groups: res.data.groups,
                    totalPages: res.data.totalPages
                });
            });
        }
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

    /* This function sets the state of the page
    to default filter values and then reinitializes
    the page with default filters. The reset prop
    is used to signal the FilterPanel and GroupSearch 
    components to revert to the original state. */
    async resetPage()
    {
        this.setState({ searchString: "", 
                        categoryId: 0, 
                        reset: !this.state.reset});
        this.init(0, "");
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
                                    <CardImg src={group.groupImage} />
                                </div>
                            </Col>
                            <Col md="12" lg="9">
                                <CardHeader> 
                                    <Row>
                                        <Col md="8" lg="8">
                                            <a href={`/group/${group.id}`}>
                                            {group.name}</a>
                                        </Col>
                                    <Col md="4" lg="4">
                                        { 
                                        group.Category.color == "" &&
                                        <Badge 
                                            color="secondary"
                                            pill>
                                                {group.Category.name}
                                        </Badge>
                                        }
                                        {
                                        group.Category.color != "" &&
                                        <Badge 
                                            style={{backgroundColor: group.Category.color}}
                                            pill>
                                                {group.Category.name}
                                        </Badge>
                                        }
                                    </Col>
                                    </Row>
                                </CardHeader>
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
            <div className="pt-3">
                <Row>
                    <Col xs="4" sm="4" md="1">
                        <FilterPanel
                            categories={this.props.categories} 
                            filter={this.init}
							reset={this.state.reset}
						/>
                    </Col>
                    <Col xs="4" sm="4" md="4">
                        <GroupSearch 
                            categoryID={this.state.categoryId} 
                            filter = {this.init}
							reset={this.state.reset}
						/>
                    </Col>
                    <Col xs="4" sm="4" md="3">
						<ResetButton
                        	categoryID={this.state.categoryId}
                        	searchString={this.state.searchString}
                        	reset={this.resetPage}
                    	/>
                    </Col>
                    <Col md="3">
                    </Col>
                    <Col md="1">
                        <GroupForm
                            user={user}
                            groupNames={groupNames}
                            categories={this.props.categories}
                            csrfToken={this.props.csrfToken}
                        />
                    </Col>
                </Row>
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