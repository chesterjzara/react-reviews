import React, { Component } from 'react'
import { Link } from "react-router-dom";

import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

import { baseAPI } from '../../App';

class FriendSearch extends Component {
	constructor(props) {
		super(props)
		this.state = {
            searchName : '',
            searchArray : [],
            attemptedSearch: false
        }
	}
	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value
		})
    }
    handleSearchSubmit = async (event) => {
        event.preventDefault();
        let search_term = this.state.searchName.split(' ').join(' | ')
        let searchInfo = { searchTerm: search_term}


        try{
            let searchRes = await fetch(baseAPI + `/friends/search/fulltext`, {
                method: 'POST',
                body: JSON.stringify(searchInfo),
                withCredentials: true,
			    credentials: 'include',
			    headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'x-access-token' : this.props.loginUser.user_token
			    }
            })
            let searchResults = await searchRes.json()
            //console.log(searchResults)
            this.setState({
                searchArray: searchResults,
                searchName : '',
                attemptedSearch: true
            })

        } catch(e) {
            console.log('Search failed on server')
        }
        
	}
	
    render() {
        const {searchArray, attemptedSearch} = this.state
        
        // Logic to only show the "No Matches" after we do a search, not on load
        let noMatchText = ''
        if(searchArray.length < 1 && attemptedSearch) {
            noMatchText = <li> No matches </li>
        }

      	return (
			<div className="friend-search">
                    <h3>Find New Friends</h3>
                    {/* <form onSubmit={this.handleSearchSubmit}>
                        <input type="text" placeholder='Search Name' id="searchName" onChange={this.handleChange} value={this.state.searchName}/>
                        <input type="submit" value="Find"/>
                    </form> */}

                    <Form onSubmit={this.handleSearchSubmit}>
                    <Form.Group>
                        <InputGroup className="my-2">
                            <Form.Control type="text" 
                                placeholder="Enter a friend's name to find them!" 
                                onChange={this.handleChange}
                                value={this.state.searchName}
                                id="searchName"
                            />
                            <InputGroup.Append>
                                <Button variant="outline-success" type="submit">Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Form>  


                    <div>
                        <ListGroup>
                            {searchArray.length < 1 ? 
                                noMatchText
                                :
                                searchArray.map( (item, index) => {
                                    let variant, dispStatus
                                    if(item.status === 'pending') {
                                        variant = 'warning'; dispStatus = 'Request sent!' 
                                    }
                                    else if(item.status === 'confirmed') {
                                        variant = 'primary'; dispStatus = 'Friend'
                                    }
                                    else if (item.status === null) {
                                        variant = 'light'; dispStatus = 'Not friended'
                                    }
                                    return (
                                        <ListGroup.Item key={index} variant={variant}
                                        className="d-flex flex-row justify-content-between"
                                        > 
                                            <div>
                                                <Link to={`/friends/${item.user_id}`}>
                                            	    {item.first_name} {item.last_name}
                                                </Link> 
                                            </div>
                                            <div>
                                                ({dispStatus})
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                    </div>
                </div>
    	)
  }
}
export default FriendSearch;