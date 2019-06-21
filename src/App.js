import React, { Component } from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'

// import logo from './logo.svg';
import './App.css';

// Bootstrap Components
// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'

// Child Components
import UserAuth from './components/UserAuth'

import About from './components/misc/About'
import Welcome from './components/misc/Welcome'
import Navigation from './components/misc/Navigation'
import Homepage from './components/misc/Homepage'
import SearchResults from './components/misc/SearchResults'

import MapContainer from './components/map/MapContainer'

import Friends from './components/friends/Friends'
import FriendSingle from './components/friends/FriendSingle';

import Places from './components/places/Places'
import PlaceSingle from './components/places/PlaceSingle';
import ReviewNew from './components/places/ReviewNew'
import ReviewEdit from './components/places/ReviewEdit';

require('dotenv').config()


// Constants
// const baseAPI = 'http://localhost:3000'
const baseAPI = 'https://afternoon-wildwood-34844.herokuapp.com'
export { baseAPI }

class App extends Component {
  	constructor(props) {
		super(props)
		this.state = {
			current_user : null,
			loginUser: {},
			loading: true
		}
	}

	// Login and Registration Methods
	handleSetLoginUser = async (jsonInfo) => {
		localStorage.setItem('reviews-jwt', jsonInfo.token)
		this.setState({
			loginUser: {
				user_id: jsonInfo.user_id,
				user_token: jsonInfo.token
			}
		})
	}
	handleLoggedInUser = async (token) => {
		console.log('Logging in user with saved token...')
		
		let checkTokenRes = await fetch(baseAPI + `/users/me`, {
			method: 'GET',
			withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : token
			}
		})
		let jsonToken = await checkTokenRes.json()
		
		return jsonToken;
		// if(jsonToken.auth) {
		// 	this.setState({
		// 		loginUser: {
		// 			user_id: jsonToken.user.user_id,
		// 			user_token: token
		// 		}
		// 	})
		// 	console.log('Set login user:', this.state.loginUser)
		// }
	}
	handleLogOut = () => {
		localStorage.removeItem('reviews-jwt')
		this.setState({
			loginUser: {}
		})
	}
	renderUserAuth(props) {
		return (
			< UserAuth
				handleSetLoginUser={this.handleSetLoginUser}
				{...props}
			/>
		)
	}

	// Friends Components Render with props
	renderFriends(props) {
		return (
			< Friends 
				loginUser={this.state.loginUser}
				{...props}
				
			/>
		)
	}
	renderFriendSingle(props) {
		return (
			< FriendSingle 
				loginUser={this.state.loginUser}
				{...props}
				
			/>
		)
	}

	// Places Components Render with props
	renderPlaces(props) {
		return (
			< Places 
				loginUser={this.state.loginUser}
				{...props}
				
			/>
		)
	}
	renderPlaceSingle(props) {
		return (
			< PlaceSingle
				loginUser={this.state.loginUser}
				{...props}
			/>
		)
	}
	renderReviewNew(props) {
		return (
			< ReviewNew 
				loginUser={this.state.loginUser}
				{...props}
				
			/>
		)
	}
	renderReviewEdit(props) {
		return (
			< ReviewEdit 
				loginUser={this.state.loginUser}
				{...props}
				
			/>
		)
	}
	renderSearchResults(props) {
		return (
			< SearchResults 
				loginUser={this.state.loginUser}
				{...props}	
			/>
		)
	}

	// Misc Component Render 
	renderHomepage(props) {
		return (
			< Homepage 
				loginUser={this.state.loginUser}
				{...props}	
			/>
		)
	}

	// React LifeCycle Methods
	componentWillMount() {
		// if(localStorage.getItem('reviews-jwt') != null) {
		// 	this.handleLoggedInUser(localStorage.getItem('reviews-jwt'))
		// }
		let storedToken = localStorage.getItem('reviews-jwt')
		if(storedToken != null) {
			this.handleLoggedInUser(storedToken)
			.then( (data) => {
				if(data.auth === true) {
					this.setState({
						loginUser: {
							user_id: data.user.user_id,
							user_token: storedToken
						},
						loading: false
					})
				}
				
			})
		} else {
			this.setState ({
				loading: false
			})
		}
		
	}
	componentDidMount() {
		
	}
	render() {
		if(this.state.loading === true) {
			return (
				<div className="loading-message">
					<h1>Logging in user</h1>
				</div>
			)
		}
		
		return (
			<div>
				<Router>
					< Navigation 
						handleLogOut={this.handleLogOut}
						loginUser={this.state.loginUser}
					/>
					<Container>
						<Switch>
							{/* User Routes */}
							<Route path="/users" 
								render={(props) => this.renderUserAuth(props)} 
							/>
							
							{/* Places, Map, Reviews */}
							<Route path="/places/:place_id" 
								render={(props) => this.renderPlaceSingle(props)} 
							/>
							<Route path='/places' 
								render={(props) => this.renderPlaces(props)} 
							/>
							<Route path='/map' 
								component={MapContainer}  
							/>
							<Route path='/reviews/new' 
								render={(props) => this.renderReviewNew(props)}  
							/>
							<Route path='/reviews/edit' 
								render={(props) => this.renderReviewEdit(props)}  
							/>

							{/* Friends */}
							<Route path="/friends/:user_id" 
								render={(props) => this.renderFriendSingle(props)} 
							/>
							<Route path="/friends" 
								render={(props) =>  this.renderFriends(props)} 
							/>
							
							{/* Other Routes  */}
							<Route path="/about" 
								component={About} 
							/>
							< Route path="/search"
								render={(props) => this.renderSearchResults(props)}
							/>
							<Route path="/welcome" 
								component={Welcome} 
							/>
							< Route path="/"
								render={(props) => this.renderHomepage(props)}
							/>
							

						</Switch>
					</Container>
	 			</Router>
			 </div>
		)
	}
}
  

export default App;
