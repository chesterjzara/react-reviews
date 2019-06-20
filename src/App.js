import React, { Component } from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'

// import logo from './logo.svg';
import './App.css';

// Bootstrap Components
// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'

// Child Components
import UserAuth from './components/UserAuth'
import About from './components/About'
import Navigation from './components/Navigation'

import MapContainer from './components/map/MapContainer'

import Friends from './components/friends/Friends'
import FriendSingle from './components/friends/FriendSingle';

import Places from './components/places/Places'
import ReviewNew from './components/places/ReviewNew'
import PlaceSingle from './components/places/PlaceSingle';

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

	// Friends Methods and Components
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

	// Places Methods and Components
	renderReviewNew(props) {
		return (
			< ReviewNew 
				loginUser={this.state.loginUser}
				{...props}
				
			/>
		)
	}
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
		// if(localStorage.getItem('reviews-jwt') != null) {
		// 	this.handleLoggedInUser(localStorage.getItem('reviews-jwt'))
		// }
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
							<Route path='/map' component={MapContainer}  />
							
							<Route path="/places/:place_id" render={(props) => this.renderPlaceSingle(props)} />
							<Route path='/places' render={(props) => this.renderPlaces(props)} />
														
							<Route path="/users" render={(props) => this.renderUserAuth(props)} />
							{/* <Route path='/reviews/new' component={ReviewNew}  /> */}
							<Route path='/reviews/new' render={(props) => this.renderReviewNew(props)}  />
	
							<Route path="/friends/:user_id" render={(props) => this.renderFriendSingle(props)} />
							<Route path="/friends" render={(props) =>  this.renderFriends(props)} />
							<Route path="/about" component={About} />
							
							{/* <Route path="/" component={Welcome} /> */}
						</Switch>
					</Container>
	 			</Router>
			 </div>
		)
	}
}
  

export default App;
