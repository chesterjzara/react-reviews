import React, { Component } from 'react'
import { Link } from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup'

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
        console.log('do search submit:',this.state.searchName)
        let searchInfo = { searchTerm: this.state.searchName}

        try{
            let searchRes = await fetch(baseAPI + `/friends/search/new`, {
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
            console.log(searchResults)
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
                    <form onSubmit={this.handleSearchSubmit}>
                        <input type="text" placeholder='Search Name' id="searchName" onChange={this.handleChange} value={this.state.searchName}/>
                        <input type="submit" value="Find"/>
                    </form>
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
                                        <ListGroup.Item key={index} variant={variant}> 
                                            <Link to={`/friends/${item.user_id}`}>
                                        	    {item.first_name} {item.last_name}
                                            </Link> 
                                            ({dispStatus})
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