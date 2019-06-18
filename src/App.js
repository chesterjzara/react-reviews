import React, { Component } from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'

// import logo from './logo.svg';
import './App.css';

// Bootstrap Components
// import Button from 'react-bootstrap/Button';

// Child Components
import UserAuth from './components/UserAuth'
import About from './components/About'
import MapContainer from './components/MapContainer'
import Friends from './components/Friends'
import FriendSingle from './components/FriendSingle';
import ReviewNew from './components/ReviewNew'

require('dotenv').config()


// Constants
const baseAPI = 'http://localhost:3000'
export { baseAPI }

class App extends Component {
  	constructor(props) {
		super(props)
		this.state = {
			current_user : null,
			loginUser: {},
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
		if(jsonToken.auth) {
			this.setState({
				loginUser: {
					user_id: jsonToken.user.user_id,
					user_token: token
				}
			})
			console.log('Set login user:', this.state.loginUser)
		}
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

	componentWillMount() {
		if(localStorage.getItem('reviews-jwt') != null) {
			this.handleLoggedInUser(localStorage.getItem('reviews-jwt'))
		}
	}
	componentDidMount() {
		// if(localStorage.getItem('reviews-jwt') != null) {
		// 	this.handleLoggedInUser(localStorage.getItem('reviews-jwt'))
		// }
	}

	render() {
		return (
			<div>
				<Router>
					<h1><Link to='/'> Home </Link></h1>
					<Link to='/users'> Signin/Reg </Link>
					<Link to='/friends'> Friends </Link>
					<Link to='/map'> Places </Link>
					<a href="#" onClick={this.handleLogOut}> Log Out</a>
					<p>Logged in user: {this.state.loginUser.user_id}</p>
					
				
					<Switch>
						<Route path='/map' component={MapContainer}  />
						<Route path="/users" render={(props) =>  this.renderUserAuth(props)} />
						{/* <Route path='/reviews/new' component={ReviewNew}  /> */}
						<Route path='/reviews/new' render={(props) => this.renderReviewNew(props)}  />
						<Route path="/friends/:user_id" render={(props) => this.renderFriendSingle(props)} />
						
						<Route path="/friends" render={(props) =>  this.renderFriends(props)} />
						<Route path="/about" component={About} />
						
						{/* <Route path="/" component={Welcome} /> */}
					</Switch>
	 			</Router>
			 </div>
		)
	}
}
  

export default App;
