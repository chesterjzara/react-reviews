import React, { Component } from 'react'
import { Link } from "react-router-dom";

import { baseAPI } from '../../App';

import FriendsList from './FriendsList'


class Friends extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchName : '',
            searchArray : []
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
                searchName : ''

            })

        } catch(e) {
            console.log('Search failed on server')
        }
        
    }
    render() {
        if(!this.props.loginUser.user_id) {
            console.log('No login user, redirecting...')
            return (
                <h2><Link to='/users'> Please Sign in to view Friends. </Link> </h2>
                
            )
        }
        
        return (
            <div className="friends-main">
                {this.props.loginUser.user_id ? 
                    < FriendsList
                        loginUser={this.props.loginUser}
                    />
                    : ''
                }
                <div className="friend-search">
                    <h1>Find Friends</h1>
                    <form onSubmit={this.handleSearchSubmit}>
                        <input type="text" placeholder='Search Name' id="searchName" onChange={this.handleChange} value={this.state.searchName}/>
                        <input type="submit" value="Find"/>
                    </form>
                    <div>
                        <ul>
                            {this.state.searchArray.length < 1 ? 
                                <li> No matches</li>
                                :
                                this.state.searchArray.map( (item, index) => {
                                    return (
                                        <li key={index}> 
                                            <Link to={`/friends/${item.user_id}`}>
                                        	    {item.first_name} {item.last_name}
                                            </Link> 
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>

                

            </div>
        )
  }
}
export default Friends;