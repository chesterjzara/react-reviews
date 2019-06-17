import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import FriendSingle from './FriendSingle'

class FriendsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage : 1,
            itemPerPage : 4
        }
    }
  
    pageClick = (event) => {
        console.log('in click')
        console.log(event.target.id)
        this.setState({
            currentPage : parseInt(event.target.id)
        })
    }

    getPaginationNumbers = () => {
        const {currentPage, itemPerPage} = this.state
        const maxPages = Math.ceil(this.props.list.length / itemPerPage)

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

    render() {
        let cutoffItem = this.state.currentPage * this.state.itemPerPage
        let firstItem = cutoffItem - this.state.itemPerPage
        let itemsToDisplay = this.props.list.slice(firstItem, cutoffItem);

        let pageNumbers = this.getPaginationNumbers()

        return (
            <div className="friends-list">
                <h1>Friends List</h1>
                <ul>
                    {itemsToDisplay.map((item, index) => {
                        return (
                            <li key={index}> 
                                <Link to={`/friends/${item.id}`}> {item.name} </Link>
                            </li>
                        )
                    })}
                </ul>
                {/* < Route path="/friends/:id" component={FriendSingle} /> */}

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