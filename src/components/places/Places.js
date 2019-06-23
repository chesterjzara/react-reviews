import React, { Component } from 'react'

import PlacesList from './PlacesList'

import { baseAPI } from '../../App';

class Places extends Component {
	constructor(props)  {
		super(props)
		this.state = {
			myPlacesArray : [],
			friendsPlacesArray : [],
			myPlacesCurrentPage : 1,
			friendsPlacesCurrentPage : 1,
			itemPerPage : 3,
			loading: true
		}
	}

	paginationChange = (event, whichPage) => {
		let pageToChange = whichPage
        this.setState({
            [pageToChange] : parseInt(event.target.id)
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

	getPlacesLists = async () => {
		let myPlacesRes = await fetch( baseAPI + `/places/myplaces`, {
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
		// console.log(jsonMyPlaces)
		this.setState({
			myPlacesArray : jsonMyPlaces
		}, () => this.getFriendsPlaces())
	}

	getFriendsPlaces = async () => {
		let friendsPlacesRes = await fetch( baseAPI + `/places/friends`, {
			method: 'GET',
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
		})
		let jsonFriendsPlaces = await friendsPlacesRes.json();
		// console.log(jsonFriendsPlaces)
		this.setState({
			friendsPlacesArray : jsonFriendsPlaces,
			loading: false
		})
	}

	componentWillMount() {
        this.getPlacesLists()
        
    }

	render() {
		if(this.state.loading) {
			return (
				<h1>Loading Places...</h1>
			)
		}
		
		return (
			< React.Fragment>
				< PlacesList
					placesArray={this.state.myPlacesArray}
					placesCurrentPage={this.state.myPlacesCurrentPage}
					whichCurrentPage="myPlacesCurrentPage"
					listTitle="My Places"
					myList={true}

					itemPerPage={this.state.itemPerPage}
					getPaginationNumbers={this.getPaginationNumbers}
					paginationChange={this.paginationChange}
				/>

				< PlacesList
					placesArray={this.state.friendsPlacesArray}
					placesCurrentPage={this.state.friendsPlacesCurrentPage}
					whichCurrentPage="friendsPlacesCurrentPage"
					listTitle="Friends Places"
					myList={false}

					itemPerPage={this.state.itemPerPage}
					getPaginationNumbers={this.getPaginationNumbers}
					paginationChange={this.paginationChange}
				/>

				
			</React.Fragment>
			
    	)
  	}
}
export default Places;