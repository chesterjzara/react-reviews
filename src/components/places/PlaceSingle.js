import React, { Component } from 'react'

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link } from "react-router-dom";

import pizza from './test_pizza.jpg'
import { baseAPI } from '../../App';

import PlaceInfo from './PlaceInfo'

let photoRef = 'add in photo references from '
let = 'enter placeId here'

let placeDetailsURL = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=photo&key=${process.env.REACT_APP_DEV_GOOGLE_API_KEY}` 

let photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference=${photoRef}&key=${process.env.REACT_APP_DEV_GOOGLE_API_KEY}
`

class PlaceSingle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            myPlaceInfo: null,
            friendPlaceInfo: [],
            allPlaceInfo: [],
            activeTag: ''
        }
    }
    
    
    getPlacePhoto = () => {
        let place_id = this.props.match.params.place_id

        console.log(this.props.location.state)
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
        
        let allReviews = this.state.allPlaceInfo
        const {address, google_url, place_id, place_name }= allReviews[0]
        
        let stats = this.calculateStats()
        console.log(stats)

        // address, date_added, entry_id, first_name, google_url, last_name, place_id, place_name, rating, review, tag_id, tag_name, user_id
        let activeTag = this.state.activeTag
        let login_user_id = this.props.loginUser.user_id
        let myReview = this.state.myPlaceInfo
        let friendsReviews = this.state.friendPlaceInfo
        return (
			<React.Fragment>
                <Container>
                    {/* <h1>  {place_name} </h1>
                    <div className="place-image-container">
                        <img src={pizza} alt=""/>
                    </div>
                    <a href={google_url}>Link to Google Maps</a>
                    <h5> {address} </h5>
                    <h5>Average Rating: {stats.avgRating} ({stats.totalReviews})</h5>
                    <div className="m-2">
                        Tags:
                        {stats.tags.map((tag, index) => {
                            return (
                                <Button 
                                    className='mx-2' 
                                    key={index}
                                    id={tag} 
                                    variant={activeTag === tag ? 'dark' : 'outline-dark'}
                                    onClick={this.toggleTag}
                                >
                                    {tag} 
                                </Button>
                            )
                        })}
                    </div> */}
                    <PlaceInfo 
                        place_name={place_name}
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
                                        <Button variant="warning">Edit</Button>
                                        <Button variant="danger">Delete</Button>
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
export default PlaceSingle;

