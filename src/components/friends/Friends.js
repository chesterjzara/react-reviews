import React, { Component } from 'react'
import { Link } from "react-router-dom";

import Container from 'react-bootstrap/Container'

import FriendsList from './FriendList'
import FriendSearch from './FriendSearch';
import FriendRequests from './FriendRequests';

import { baseAPI} from '../../App'

class Friends extends Component {
    constructor(props) {
        super(props)
        this.state = {
            friendArray : [],
            pendingArray : [],
            sentArray : [],
            loading: true
        }
    }

    acceptRequest = async (user_id) => {
        let acceptRequestRes = await fetch(baseAPI + `/friends/request/confirm/${user_id}`,{
            method: 'PUT',
            credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
        let jsonAccept = await acceptRequestRes.json()
        console.log(jsonAccept)
        this.getFriendList()
    }
    

    updateStateReject = (array, arrayIndex, user_id) => {
        this.setState(prevState => {
            
            let friendIndex = prevState.friendArray.findIndex( (current, index, arr) => {
                return current.friend_id === user_id;
            })

            prevState[array].splice(arrayIndex, 1)
            if(friendIndex !== -1) {
                prevState.friendArray.splice(friendIndex, 1)
            }
            return {
                [array]: prevState[array],
                friendArray : prevState.friendArray
            }
        })
	  }

	deleteFriend = async (user_id, arrayName, index) => {
		let cancelRequestRes = await fetch(baseAPI + `/friends/delete/${user_id}`, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
		})
        let jsonDelete = await cancelRequestRes.json()
        console.log(jsonDelete)
		this.updateStateReject(arrayName, index, user_id)
    }
    
    getPendingAndSentRequests = async () => {
		let pendingRes = await fetch(baseAPI + '/friends/request/pending', {
            method: 'GET',
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
		let jsonPending = await pendingRes.json()
		
		let sentRes = await fetch(baseAPI + '/friends/request/sent', {
            method: 'GET',
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
		let jsonSent = await sentRes.json()
		 
		this.setState({
			pendingArray : jsonPending,
            sentArray : jsonSent,
            loading: false
		})
	}
    getFriendList = async () => {
        let friendListRes = await fetch(baseAPI + '/friends', {
            method: 'GET',
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
        let jsonFriends = await friendListRes.json()
        this.setState({
            friendArray: jsonFriends
        }, () => this.getPendingAndSentRequests())
    }

    componentWillMount() {
        this.getFriendList()
        
    }

    render() {
        if(!this.props.loginUser.user_id) {
            console.log('No login user, redirecting...')
            return (
                <h2><Link to='/users'> Please Sign in to view Friends. </Link> </h2>
                
            )
        }
        if (this.state.loading === false) {
            return (
                <div className="friends-main">
                    {this.props.loginUser.user_id ? 
                        <Container>
                            < FriendRequests 
                                loginUser={this.props.loginUser} 
                                pendingArray={this.state.pendingArray}
                                sentArray={this.state.sentArray}
                                deleteFriend={this.deleteFriend}
                                acceptRequest={this.acceptRequest}

                            />
                            < FriendSearch loginUser={this.props.loginUser} />
                            < FriendsList 
                                loginUser={this.props.loginUser}
                                friendArray={this.state.friendArray} 
                            />
                            
                        </Container>
                        : ''
                    }
                
                </div>
            )
        } else {
            return ( <h2>Loading Friends... </h2> )
        }
        
  }
}
export default Friends;