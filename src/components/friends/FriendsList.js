import React, { Component } from 'react'
import { Link } from "react-router-dom";
// import { Redirect } from 'react-router-dom'
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import FriendSingle from './FriendSingle'

import { baseAPI} from '../../App'

class FriendsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage : 1,
            itemPerPage : 4,
            friendArray: []
        }
    }
  
    pageClick = (event) => {
        console.log('in click')
        console.log(event.target.id)
        this.setState({
            currentPage : parseInt(event.target.id)
        })
    }

    getFriendList = async () => {
        console.log('have login user in list', this.props.loginUser)

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
        console.log(jsonFriends)
        this.setState({
            friendArray: jsonFriends
        })
    }

    getPaginationNumbers = (array) => {
        const {currentPage, itemPerPage} = this.state
        const maxPages = Math.ceil(array.length / itemPerPage)

        let pageNumbers = [currentPage]
        let counter = 1
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
    componentWillMount() {
        this.getFriendList()
    }

    render() {
        
        let cutoffItem = this.state.currentPage * this.state.itemPerPage
        let firstItem = cutoffItem - this.state.itemPerPage
        let itemsToDisplay = this.state.friendArray.slice(firstItem, cutoffItem);

        let pageNumbers = this.getPaginationNumbers(this.state.friendArray)

        

        return (
            <div className="friends-list">
                <h1>Friends List</h1>
                <ul>
                    {itemsToDisplay.map((item, index) => {
                        return (
                            <li key={index}> 
                                <Link to={`/friends/${item.friend_id}`}> {item.first_name} {item.last_name} </Link> Status - {item.status} 
                            </li>
                        )
                    })}
                </ul>

                <ul>
                    {pageNumbers.map((number, index) => {
                        return (
                            <li id={number} key={index} onClick={this.pageClick} > {number}</li>
                        )
                    })}
                </ul>

            </div>
        )
  }
}
export default FriendsList;