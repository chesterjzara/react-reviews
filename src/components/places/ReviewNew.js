import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

// Library to dynamic Select components
import AsyncCreatableSelect from 'react-select/async-creatable';
// import AsyncSelect from 'react-select/async';
// import Select from 'react-select'

import Form from 'react-bootstrap/Form'
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'

import PlaceInfo from './PlaceInfo'

import { baseAPI } from '../../App';

class ReviewNew extends Component {
	constructor(props){
		super(props)
		this.state = {
			inputValue: {
				value: '',
				new: null
			},
			reviewText: '',
			rating: '',
			toPlacesHome : false,
			error: ''
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
			review_text : this.state.reviewText,
			rating: this.state.rating
		}

		try {
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
			let jsonReview = await reviewRes.json()
			if(!jsonReview.status) {
				this.setState({
					toPlacesHome: true
				})
			} else {
				this.setState({
					error: 'Unable to save review. Please make sure all fields are filled and try again'
				})
			}
		} catch (e) {
			console.log(e)
			this.setState({
				error: 'Unable to save review, try again'
			})
		}

		

	}

	handleInputChange = (newValue) => {
		console.log(newValue)
		this.setState({ 
			inputValue: {
				value: newValue.value,
				new: newValue.__isNew__
			} });
		return newValue.label;
	}

	// updateType = (value) => {
	// 	this.setState({typeId: value.id});
	// }
	getTypeOptions = (inputValue) => {
		console.log('get type options',inputValue)

		return fetch(baseAPI + `/places/tags`)
			.then(res => res.json())
			.then( json => {
				console.log('json:',json)
				let options = json
				options = options.filter( (i) => {
					return i.label.toLowerCase().includes(inputValue.toLowerCase())
				});
				console.log(options)
				return options
			})
	}

	render() {
		if(this.state.toPlacesHome === true || !this.props.location.state) {
			return <Redirect to='/places' />
		}

		// comment out this to test w/out Google Places API calls
		const { place_id, address, name, google_url } = this.props.location.state

		return (
			<div className="new-review-container">
				
				{ this.state.error ? 
					<Alert variant="danger">{this.state.error} </Alert> 
					: ''
				}
				
				<h2>New Review</h2>
				< PlaceInfo 
					place_name={name}
					google_url={google_url}
					address={address}
					showStatsTags={false}
				/>

				<Form
					onSubmit={this.handleSubmit}	
				>
					<FormGroup>
						< FormLabel > Choose an existing Tag or enter a new Tag </FormLabel>
						<AsyncCreatableSelect 
							cacheOptions
							loadOptions={this.getTypeOptions}
							defaultOptions
							onChange={(opt) => this.handleInputChange(opt)}
							required
						/>
					</FormGroup>

					<FormGroup>
						<FormLabel>Rating (0-10)</FormLabel> <br/>
						<input type="number" id="rating" 
							name="rating" min="1" max="10"
							value={this.state.rating}
							onChange={this.handleChange}
							placeholder='Enter a number rating 0 to 10'
							className='col-12'
							required
						/>
					</FormGroup>

					<FormGroup>
						<FormLabel>Review</FormLabel> <br/>
						<textarea id="reviewText" 
							value={this.state.reviewText} 
							onChange={this.handleChange}
							placeholder="Add any review info for your friends."
							className='col-12'
							style={{height : '20vh'}}
							required
						></textarea>
					</FormGroup>
					<Button type="submit">Save Review</Button>
				</Form>
			</div>
		)
	}
}
export default ReviewNew;