import React, { Component } from 'react'
import { Link } from "react-router-dom";

import Pagination from 'react-bootstrap/Pagination'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'

import default_avatar from './default-avatar.png'


class FriendsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage : 1,
            itemPerPage : 4,
        }
    }
  
    pageClick = (event) => {
        this.setState({
            currentPage : parseInt(event.target.id)
        })
    }

    getPaginationNumbers = (array) => {
        const {currentPage, itemPerPage} = this.state
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


    render() {
        
        let currentPage = this.state.currentPage
        let cutoffItem = currentPage * this.state.itemPerPage
        let firstItem = cutoffItem - this.state.itemPerPage
        let itemsToDisplay = this.props.friendArray.slice(firstItem, cutoffItem);


        let pageNumbers = this.getPaginationNumbers(this.props.friendArray)

        

        return (
            <div className="friends-list my-4">
                <h3>Friends List</h3>
                
                {itemsToDisplay.map((item, index) => {
                    return (
                        <Card key={index} className="d-flex flex-row"> 
                            <div className="friend-list-image-container">
                                <img src={item.user_img ? item.user_img : default_avatar} alt=""/>
                            </div>
                            <Card.Body>
                                <Card.Title> 
                                    <Link to={`/friends/${item.friend_id}`}> {item.first_name} {item.last_name} </Link> 
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {item.status}
                                </Card.Subtitle>
                            </Card.Body>
                             
                        </Card>
                    )
                })}
                
                {pageNumbers.length > 0 ? 
                    <Container className="my-4">
                        <Pagination style={ {justifyContent: 'center'}}>
                            {pageNumbers.map((number, index) => {
                                return (
                                    <Pagination.Item key={index} id={number}
                                        onClick={this.pageClick} 
                                        active={number === currentPage}
                                    >
                                        {number}
                                    </Pagination.Item>
                                )
                            })}
                        </Pagination>
                    </Container>
                    : 
                    < Container >
                        <h3>No friends yet :(</h3>
                    </Container>

                }
                

            </div>
        )
  }
}
export default FriendsList;