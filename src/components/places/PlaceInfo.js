import React, { Component } from 'react'

import pizza from './test_pizza.jpg'

import Button from 'react-bootstrap/Button'

class PlaceInfo extends Component {
	render() {
        const {place_name, google_url, address, stats, showStatsTags, activeTag, toggleTag} = this.props
    	return (
			<React.Fragment>
                <h3>  {place_name} </h3>
                <div className="place-image-container">
                    <img src={pizza} alt=""/>
                </div>
                <a href={google_url}>Link to Google Maps</a>
                <h5> {address} </h5>
                {showStatsTags ? 
                    <React.Fragment>
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
                        </div>
                    </React.Fragment>
                    : ''
                }
                
            </React.Fragment>
		)
  	}	
}
export default PlaceInfo;