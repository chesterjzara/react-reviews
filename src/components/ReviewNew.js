import React, { Component } from 'react'
import Select from 'react-select'
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect from 'react-select/async';
import { baseAPI } from '../App';

class ReviewNew extends Component {
	constructor(props){
		super(props)
		this.state = {
			inputValue: {
				value: '',
				new: null
			},
			reviewText: ''
			// place_id : this.props.location.state.place_id,
			// address : this.props.location.state.address,
			// name : this.props.location.state.name,
			// google_url : this.props.location.state.google_url
		}
	}
	
	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value
		})
	}
	handleSubmit = async (event) => {
		event.preventDefault()
		console.log("submit here")
		const { place_id, address, name, google_url } = this.props.location.state
		let reviewInfo = { 
			place_id: place_id,
			address: address,
			name: name,
			google_url : google_url,
			tag : this.state.inputValue.value,
			new_tag : this.state.inputValue.new,
			review_text : this.state.reviewText
		}

		let reviewRes = await fetch(baseAPI + `/places/new`, {
			method: 'POST',
			body: JSON.stringify(reviewInfo),
			withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
		})
		// Do something after saving to server... not sure what now

	}

	handleInputChange = (newValue) => {
		console.log(newValue)
		const inputValue = (newValue.value).toLowerCase()
		this.setState({ 
			inputValue: {
				value: inputValue,
				new: newValue.__isNew__
			} });
		return inputValue;
	}
	promiseOptions = (inputValue) => {
		new Promise( () => {

		})
	}
	updateType = (value) => {
		this.setState({typeId: value.id});
	}
	getTypeOptions = (inputValue) => {
		console.log('get type options')
		// if(!inputValue) {
		// 	return Promise.resolve({options: []});
		// }
		return fetch(baseAPI + `/places/tags`)
			.then(res => res.json())
			.then( json => {
				console.log('json:',json)
				let options = json
				return options
			})
	}

	render() {
		// comment out this to test w/out Google Places API calls
		const { place_id, address, name, google_url } = this.props.location.state

		return (
			<div className="new-review-container">
				<h1>New Review</h1>
				
				{/* Remove all theses for testing without google Places input */}
				<h2>Name: {name}</h2>
				<h3>Address: {address} </h3>
				<h3><a href={google_url}>Go to in Google Maps...</a></h3>
				<p>{place_id}</p>
				
				<form onSubmit={this.handleSubmit}>
					<h2>Category/Tag</h2>
					<AsyncCreatableSelect 
						cacheOptions
						loadOptions={this.getTypeOptions}
						defaultOptions
						onChange={(opt) => this.handleInputChange(opt)}
					/>
					<h2>Review</h2>
					<textarea id="reviewText" 
						value={this.state.reviewText} 
						onChange={this.handleChange}
						placeholder="Add any review info for your friends."
					></textarea>
					<button type="submit">Save Review</button>
				</form>
			</div>
		)
	}
}
export default ReviewNew;