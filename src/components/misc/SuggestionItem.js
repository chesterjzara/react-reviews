import React, { Component } from 'react'
import Collapse from 'react-bootstrap/Collapse'
import { Link } from "react-router-dom";

class SuggestionItem extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            open: false
        }
    }
    render() {
        let {item} = this.props
    	return (
			<div className="suggested-place border-bottom py-3" >
                <Link to={`/places/${item.place_id}`}>
                    <h4>{item.place_name}</h4>
                </Link>
                <div className="d-flex flex-row justify-content-between">
                    <a href={item.google_url}>View in Google Maps</a>
                    <h5>{item.average_rating} / 10</h5>
                </div>
                <h6 
                    onClick={()=> this.setState({open: !this.state.open})}                
                    aria-controls="reviews-details"
                    aria-expanded={this.state.open}
                > 
                    {this.state.open ? 'Hide Reviews': 'Show Reviews'}
                </h6>
                <Collapse in={this.state.open} >
                    <div id={`reviews-details`}>
                        {item.review_info.map( (info, revIndex) => {
                            return (
                                <div key={revIndex}>
                                    <h6>{info.user_name} - {info.rating} / 10.0</h6>
                                    <p> {info.review.substring(100)} </p>
                                </div>
                            )
                        })}
                    </div>
                </Collapse>
                
            </div>
		)
  	}	
}
export default SuggestionItem;