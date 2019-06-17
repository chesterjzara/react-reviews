import React, { Component } from 'react'

class ReviewNew extends Component {
	constructor(props){
		super(props)
		this.state = {
			// place_id : this.props.location.state.place_id,
			// address : this.props.location.state.address,
			// name : this.props.location.state.name,
			// google_url : this.props.location.state.google_url
		}
	}
	
	render() {
		const { place_id, address, name, google_url } = this.props.location.state
		return (
			<div className="new-review-container">
				<h1>New Review</h1>
				<h2>Name: {name}</h2>
				<h3>Address: {address} </h3>
				<h3><a href={google_url}>Go to in Google Maps...</a></h3>
				<p>{place_id}</p>
			</div>
		)
	}
}
export default ReviewNew;