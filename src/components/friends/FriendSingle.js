import React, { Component } from 'react'
// import { Redirect } from 'react-router-dom'
import { Link } from "react-router-dom";

import { baseAPI } from '../../App';

class FriendSingle extends Component {
    constructor(props) {
		super(props)
		this.state = {
			viewedUser : {}
		}
    }

	getUserInfo = async () => {
		let user_id = this.props.match.params.user_id

		let userRes = await fetch(baseAPI + `/users/${user_id}`, {
            method: 'GET',
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
        let jsonUser = await userRes.json()
		console.log('Single user lookup:',jsonUser)
		this.setState({
			viewedUser: jsonUser
		})
	}
	
	deleteFriend = async () => {
		let user_id = this.props.match.params.user_id
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
		console.log('Cancelled Request', jsonDelete)
		this.setState( prevState => {
			prevState.viewedUser.status = null
			return {
				viewedUser : prevState.viewedUser
			}
		})
	}
	sendFriendRequest = async () => {
		let user_id = this.props.match.params.user_id
		let createFriendRequestRes = await fetch(baseAPI + `/friends/request/${user_id}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
		})
		let jsonFriendRequest = await createFriendRequestRes.json()
		console.log('New Friend Request', jsonFriendRequest)
		this.setState( prevState => {
			prevState.viewedUser.status = 'pending'
			return {
				viewedUser : prevState.viewedUser
			}
		})
	}

	componentWillMount() {
		console.log('In willMount')
		this.getUserInfo()
	}
	componentWillUpdate() {
		
	}


    render() {
		if(!this.props.loginUser.user_id) {
            console.log('No login user, redirecting...')
            return (
                <h2><Link to={`/friends/${this.props.match.params.user_id}`}> Please Sign in to view Friends. </Link> </h2>
                
            )
        }
      	return (
			<React.Fragment >
				<h1> {this.state.viewedUser.first_name} {this.state.viewedUser.last_name}</h1>
				<div className="viewed-user-options">
					{this.state.viewedUser.status === null ?
						<button onClick={this.sendFriendRequest}> Friend Request </button> : ''
					}
					{this.state.viewedUser.status === 'pending' ?
						<button onClick={this.deleteFriend} > Cancel Request </button> : ''
					}
					{this.state.viewedUser.status === 'confirmed' ?
						<button onClick={this.deleteFriend}> Unfriend </button> : ''
					}
				</div>
			</ React.Fragment >

		)
    }
}

export default FriendSingle;