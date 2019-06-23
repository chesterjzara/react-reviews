import React, { Component } from 'react'
import { baseAPI } from '../../App';
import { Link } from "react-router-dom";

import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

class SearchResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading : true,
            placesArray: [],
            userArray: [],
            searchText : '',
            searchTermArray : [],
            resultsToggle: true
        }
    }
    
    toggleResultsType = () => {
        this.setState( (prevState) => {
            return {
                resultsToggle: !prevState.resultsToggle
            }
        })
    }

    searchChange = (event) => {
        let searchString = event.target.value
        let searchTermArray = searchString.split(' ')

        this.setState( (prevState) => {
            return {
                searchText: searchString,
                searchTermArray: searchTermArray,
            }
            
        })
    }
    submitSearch = (event) => {
        event.preventDefault();
        let search_string = this.state.searchTermArray.join(' | ')
        this.getSearchResults(search_string)
    }

    getInitialSearchResults = () => {
        let search_params = this.props.location.search
        let search_string = search_params.substring(1).split('&').join(' | ')
        this.getSearchResults(search_string)
    }
    getSearchResults = async (search_string) => {
        const reviewSearchRes = await fetch(baseAPI + `/places/search`, {
            method: 'POST',
            body: JSON.stringify({ search_string : search_string}),
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
        const jsonSearch = await reviewSearchRes.json()
        // console.log(jsonSearch)

        this.setState({
            placesArray: jsonSearch,
        }, () => this.getUserSearch(search_string))
    }

    getUserSearch = async (search_string)  => {
        const userSearchRes = await fetch(baseAPI + `/friends/search/fulltext`, {
            method: 'POST',
            body: JSON.stringify({ searchTerm: search_string}),
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'x-access-token' : this.props.loginUser.user_token
            }
        })
        let jsonUserSearch = await userSearchRes.json()
        // console.log(jsonUserSearch)

        this.setState( (prevState) => {
            return {
                userArray: jsonUserSearch,
                loading: false,
                searchText : '',
            }
        }, () => { 
            let reconsituted_params = this.state.searchTermArray.join('&')
            if(reconsituted_params !== '') {
                this.props.history.push(`/search?${reconsituted_params}`) 
            }
            
        })
    }

    componentWillMount() {
        this.getInitialSearchResults()    
    }
    
    render() {
        if(this.state.loading) {
            return (<h2>Loading search results...</h2>)
        }

        let {placesArray, userArray, resultsToggle} = this.state
        let current_user_id = this.props.loginUser.user_id
    	return (
			<React.Fragment>
                <h1> Search</h1>
                <Form onSubmit={this.submitSearch}>
                    <Form.Group>
                        <InputGroup className="my-2">
                            <Form.Control type="text" 
                                placeholder="Ex: 'Mexican', 'The Corner Bar', 'Bob'" 
                                onChange={this.searchChange}
                                value={this.state.searchText}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-success" type="submit">Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Form>  
                
                <div className="my-2">
                    <Button className="col-6"
                        variant={resultsToggle ? 'dark' : 'outline-dark'}
                        onClick={this.toggleResultsType}
                    >
                        Places
                    </Button>
                    <Button className="col-6"
                        variant={resultsToggle ? 'outline-dark' : 'dark'}
                        onClick={this.toggleResultsType}
                    >
                        Users
                    </Button>
                </div>
                            
                
                <ListGroup>
                    {this.state.resultsToggle ? 
                        <div>
                            {placesArray.map( (item, index) => {
                                let name = `${item.first_name} ${item.last_name}`
                                if(item.user_id === current_user_id) {
                                    name = `You`
                                }
                                return(
                                    <ListGroup.Item className="d-flex flex-row justify-content-between" key={index}>
                                        <div className="col-8">
                                            <div>
                                                <Link to={`/places/${item.place_id}`}>
                                                    {item.place_name} 
                                                </Link>
                                                {' '}- <Link to={`/friends/${item.user_id}`}> {name} </Link>
                                            </div>
                                            <div>
                                                {item.tag_name}
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            {item.rating} / 10
                                        </div>
                                    </ListGroup.Item>
                                )
                            })}
                        </div>
                        :
                        <div>
                            {userArray.map( (item, index) => {
                                let dispStatus
                                if(item.status === 'pending') {
                                    dispStatus = 'Request sent!' 
                                }
                                else if(item.status === 'confirmed') {
                                    dispStatus = 'Friend'
                                }
                                else if (item.status === null) {
                                    dispStatus = 'Not friended'
                                }
                                return(
                                    <ListGroup.Item key={index}
                                        className="d-flex flex-row justify-content-between"
                                    >
                                        <div>
                                            <Link to={`/friends/${item.user_id}`}>
                                        	    {item.first_name} {item.last_name}
                                            </Link>  
                                        </div>
                                        <div>
                                            {dispStatus}
                                        </div>
                                    </ListGroup.Item>
                                )
                            })}
                        </div>
                    }
                    

                </ListGroup>


            </React.Fragment>
		)
  	}	
}
export default SearchResults;