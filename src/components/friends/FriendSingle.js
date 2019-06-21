import React, { Component } from 'react'
// import { Redirect } from 'react-router-dom'
import { Link } from "react-router-dom";

import PlacesList from '../places/PlacesList'

import Button from 'react-bootstrap/Button'

import { baseAPI } from '../../App';
import default_avatar from './default-avatar.png'

class FriendSingle extends Component {
    constructor(props) {
		super(props)
		this.state = {
			viewedUser : {},
			placesCurrentPage: 1,
			itemPerPage : 3,
			placesArray: []
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
		}, ()=> {this.getPlacesLists()})
	}

	getPlacesLists = async () => {
		let myPlacesRes = await fetch( baseAPI + `/places/user/${this.state.viewedUser.user_id}`, {
			method: 'GET',
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
		})
		let jsonMyPlaces = await myPlacesRes.json();
		console.log(jsonMyPlaces)
		this.setState({
			placesArray : jsonMyPlaces
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
	getPaginationNumbers = (array, whichCurrentPage) => {
		let currentPage
		const { itemPerPage} = this.state

		//Look at different current page depending on which array this is for
		currentPage = this.state[whichCurrentPage]
		
        const maxPages = Math.ceil(array.length / itemPerPage)

        let pageNumbers = [currentPage]
        let counter = 1
        if(maxPages === 0) {
            return [ ]
        }
        while( pageNumbers.length < 3 && (pageNumbers.length < maxPages - 1) ) {
            console.log(pageNumbers)
            if( (currentPage + counter) < (maxPages) ) {
                pageNumbers.push(currentPage + counter)
            }
            if( (currentPage - counter) > 1 ) {
                pageNumbers.unshift(currentPage - counter)
            }
            counter += 1
            if(counter > maxPages) { break }
        }
        if(currentPage !== 1) { 
            pageNumbers.unshift(1) 
        } else {
            if(counter + currentPage < maxPages) {
                pageNumbers.push(counter + currentPage)
            }
        }
        if(currentPage !== maxPages) {
            pageNumbers.push(maxPages)
        } else {
            if(currentPage - counter > 1) {
                pageNumbers.splice(1,0, (currentPage - counter))
            }
        }
        
        return pageNumbers
    }
	paginationChange = (event, whichPage) => {
		let pageToChange = whichPage
        this.setState({
            [pageToChange] : parseInt(event.target.id)
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
		let { viewedUser } = this.state
      	return (
			<React.Fragment >
				<div className="col-12 d-flex flex-column justify-content-center mx-auto">
					<h1 class="text-center"> 
						{viewedUser.first_name} {viewedUser.last_name}
					</h1>
					<div className="user-image-container text-center mx-auto">
						<img src={viewedUser.user_img ? viewedUser.user_img : default_avatar} alt=""/>
					</div>
				</div>

				<div className="viewed-user-options mx-auto text-center my-4">
					{this.state.viewedUser.status === null ?
						<Button onClick={this.sendFriendRequest}> Friend Request </Button> : ''
					}
					{this.state.viewedUser.status === 'pending' ?
						<Button onClick={this.deleteFriend} > Cancel Request </Button> : ''
					}
					{this.state.viewedUser.status === 'confirmed' ?
						<Button onClick={this.deleteFriend}> Unfriend </Button> : ''
					}
				</div>

				< PlacesList
					placesArray={this.state.placesArray}
					placesCurrentPage={this.state.placesCurrentPage}
					whichCurrentPage="placesCurrentPage"
					listTitle={`${this.state.viewedUser.first_name}'s Reviews`}
					myList={false}

					itemPerPage={this.state.itemPerPage}
					getPaginationNumbers={this.getPaginationNumbers}
					paginationChange={this.paginationChange}
				/>

			</ React.Fragment >

		)
    }
}

export default FriendSingle;