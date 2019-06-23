import React, { Component } from 'react'
import { Link } from "react-router-dom";

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Pagination from 'react-bootstrap/Pagination'
import Container from 'react-bootstrap/Container'

class PlacesList extends Component {
	// constructor(props)  {
	// 	super(props)
	// }
	render() {
        
        const { placesArray, placesCurrentPage, itemPerPage, whichCurrentPage, myList} = this.props

        let cutoffPlace = placesCurrentPage * itemPerPage
        let firstPlace = cutoffPlace - itemPerPage
        let placesToDisplay = placesArray.slice(firstPlace, cutoffPlace)

        let pageNumbers = this.props.getPaginationNumbers(placesArray, whichCurrentPage)
        
        return (
			< React.Fragment>
				<div className="d-flex flex-row justify-content-between my-2">
                    <h3>{this.props.listTitle} </h3>
                    {myList ? 
                        <Link to={`/map`}> <Button variant="success"> Add New </Button> </Link>
                        : ''
                    }
                </div>
                {placesToDisplay.map((item, index) => {
                    return (
                        <Card key={index} className="d-flex flex-row justify-content-end">
                            <Card.Body className="col-10 flex-grow-1">
                                <Card.Title>
                                    {myList ?
                                        <Link to={{
                                            pathname: `/places/${item.place_id}`,
                                            state: { place: item }
                                        }}> {item.place_name} </Link>
                                        :
                                        <React.Fragment>
                                            {item.place_name}  <Link to={`/friends/${item.user_id}`}> - {item.first_name} {item.last_name} </Link>
                                        </React.Fragment>
                                    }
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {item.tag_name}
                                </Card.Subtitle>
                                <Card.Text>
                                    {item.review.length > 80 ?
                                        item.review.substring(0,80) + '...'
                                        :
                                        item.review
                                    }
                                </Card.Text>
                            </Card.Body>
                            < div className="mr-0 text-center p-2">
                                    {item.rating} / 10 <br/>
                                    {myList ? 
                                        <Button variant="primary" className="m-2">Edit</Button>
                                        :
                                        <Link to={{
                                            pathname: `/places/${item.place_id}`,
                                            state: {place : item}
                                        }}>
                                            <Button variant="info" className="m-2">View</Button>
                                        </Link>
                                    }
                                    
                            </div>
                        </Card>
                    )
                })}

                {pageNumbers.length > 0 ? 
                    <Container>
                        <Pagination 
                            style={ {justifyContent: 'center'}}
                            className="my-2"
                        >
                            {pageNumbers.map((number, index) => {
                                return (
                                    <Pagination.Item key={index} id={number}
                                        onClick={(e)=> this.props.paginationChange(e, whichCurrentPage)}
                                        active={number === placesCurrentPage} 
                                    >
                                        {number}
                                    </Pagination.Item>
                                )
                            })}
                        </Pagination>
                    </Container>
                    : 
                    < Container >
                        <Card>
                        <Card.Title className="my-3 text-center"> No reviews found.</Card.Title>
                        </Card>
                    </Container>

                }

				
			</React.Fragment>
			
    	)
  	}
}
export default PlacesList;