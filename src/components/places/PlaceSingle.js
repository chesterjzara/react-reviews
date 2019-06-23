import React, { Component } from 'react'
import { GoogleApiWrapper } from 'google-maps-react';

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link, Redirect } from "react-router-dom";

// import pizza from './test_pizza.jpg'
import { baseAPI } from '../../App';

import PlaceInfo from './PlaceInfo'
import Modal from 'react-bootstrap/Modal'

class PlaceSingle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            myPlaceInfo: null,
            friendPlaceInfo: [],
            allPlaceInfo: [],
            activeTag: '',
            modalShow: false,
            toPlaces: false,
            place_img : ''
        }
    }
    
    handleModalClose = () => {
		this.setState({ modalShow: false });
	}
	
	handleModalShow = () => {
		this.setState({ modalShow: true });
    }
    handleReviewDelete = async () => {
        let entry_id = this.state.myPlaceInfo.entry_id
        let deleteRes = await fetch(baseAPI + `/places/delete/${entry_id}`, {
            method: 'DELETE',
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
        let jsonDelete = await deleteRes.json()
        console.log(jsonDelete)
        if(!jsonDelete.status) {
            this.setState({
                toPlaces : true
            })
        }
    }
    
    getPlacePhoto = async () => {
        let {google} = this.props
        console.log('google-',google)
        let place_id = this.props.match.params.place_id
        console.log('placeid',place_id)

        // let placeDetailsURL = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&fields=photo&key=${process.env.REACT_APP_DEV_GOOGLE_API_KEY}` 
        
        let request = {
            placeId: place_id,
            fields: ['photo']
        }
        console.log('request', request)
        
        let service = new google.maps.places.PlacesService(document.createElement('div'));
        console.log('service', service)
        
        service.getDetails(request, this.photoCallback)
    }
    photoCallback = (photoRes,b) => {
        console.log('hit callback')
        console.log(b)
        console.log(photoRes)
        
        let url = photoRes.photos[0].getUrl({maxHeight: 600})
        
        this.setState({
            place_img : url
        })

    }

    getPlaceInfo = async () => {
        let place_id = this.props.match.params.place_id
        let login_user_id = this.props.loginUser.user_id
        
        let placeInfoRes = await fetch(baseAPI + `/places/${place_id}`, {
            method: 'GET',
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
        let jsonPlaceInfo = await placeInfoRes.json()
        console.log(jsonPlaceInfo)
        
        let myInfoIndex = jsonPlaceInfo.findIndex((review, index) => {
            return review.user_id === login_user_id
        })
        let myReviewInfo
        let friendReviewInfo = jsonPlaceInfo.slice(0)
        if(myInfoIndex !== -1) {
            myReviewInfo = jsonPlaceInfo[myInfoIndex]
            friendReviewInfo.splice(myInfoIndex, 1)
        }

        console.log(myReviewInfo)
        console.log(friendReviewInfo)

        

        this.setState({
            myPlaceInfo : myReviewInfo,
            friendPlaceInfo: friendReviewInfo,
            loading: false,
            allPlaceInfo : jsonPlaceInfo
        })
    }

    toggleTag = (event) => {
        let clickedTag = event.target.id
        this.setState( (prevState) => {
            let newActiveTag = ''
            if(prevState.activeTag !== clickedTag) {
                newActiveTag = clickedTag
            }
            return {
                activeTag : newActiveTag
            }
        })
    }

    calculateStats = () => {
        let allReviews = this.state.allPlaceInfo

        let tagObj = {}
        let totalRating = 0
        allReviews.forEach( (currentReview, index) => {
            totalRating += currentReview.rating
            tagObj[currentReview.tag_name] = true
        })

        return {
            avgRating: (totalRating/allReviews.length).toFixed(1),
            totalReviews: allReviews.length,
            tags: Object.keys(tagObj)
        }
    }

    componentWillMount() {
        this.getPlacePhoto()
        
        this.getPlaceInfo()
      
    }
    
    
    render() {

        if(this.state.loading) {
            return <h1>Loading...</h1>
        }
        if(this.state.toPlaces) {
            return <Redirect to='/places' />
        }
        
        let allReviews = this.state.allPlaceInfo
        const {address, google_url, place_name }= allReviews[0]
        
        let stats = this.calculateStats()
        console.log(stats)

        // address, date_added, entry_id, first_name, google_url, last_name, place_id, place_name, rating, review, tag_id, tag_name, user_id
        let activeTag = this.state.activeTag
        // let login_user_id = this.props.loginUser.user_id
        let myReview = this.state.myPlaceInfo
        let friendsReviews = this.state.friendPlaceInfo
        return (
			<React.Fragment>
                < Modal show={this.state.modalShow} onHide={this.handleModalClose}>
					<Modal.Header closeButton>
						<Modal.Title>Delete Review?</Modal.Title>
					</Modal.Header>
					<Modal.Body>Are you sure you want to delete this review?</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleModalClose}>
							Cancel
						</Button>
						<Button variant="primary" onClick={this.handleReviewDelete}>
							Delete
						</Button>
					</Modal.Footer>
				</Modal>

                <Container>
                    <PlaceInfo 
                        place_name={place_name}
                        place_img={this.state.place_img}
                        google_url={google_url}
                        address={address}
                        stats={stats}
                        showStatsTags={true}
                        activeTag={activeTag}
                        toggleTag={this.toggleTag}
                    />
                    <div>
                        {myReview && (activeTag === myReview.tag_name || activeTag === '') ? 
                            <Card>
                                <Card.Body>
                                    <Card.Title> My Review </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted"> {myReview.tag_name}</Card.Subtitle>
                                    <Card.Text>
                                        {myReview.review} <br/>
                                        <span className="font-weight-bold">{myReview.rating}/10</span>
                                    </Card.Text>
                                    <div className="d-flex justify-content-around">
                                        <Link to={{
                                            pathname: `/reviews/edit`,
                                            state: myReview
                                        }}>
                                            <Button variant="warning">Edit</Button>
                                        </Link>
                                        <Button 
                                            variant="danger" 
                                            onClick={this.handleModalShow}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                            : ''
                        }

                        {friendsReviews.map((review, index) => {
                            if(activeTag === review.tag_name || activeTag === '') {
                                return (
                                    <Card key={index}>
                                        <Card.Body>
                                        <Card.Title> 
                                            <Link to={`/friends/${review.user_id}`}>
                                                {review.first_name}
                                            </Link>
                                        </Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {review.tag_name}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            {review.review} <br/>
                                            <span className="font-weight-bold">{review.rating}/10</span>
                                        </Card.Text>
                                        </Card.Body>
                                    </Card>
                                )
                            }
                        })}
                    </div>


                </Container>
            </React.Fragment>
            



		)
      }
    	
}
export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_DEV_GOOGLE_API_KEY)
})(PlaceSingle);

