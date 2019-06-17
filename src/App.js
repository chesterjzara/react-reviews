import React, { Component } from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'

import logo from './logo.svg';
import './App.css';

// Bootstrap Components
import Button from 'react-bootstrap/Button';

// Child Components
import UserAuth from './components/UserAuth'
import About from './components/About'
import MapContainer from './components/MapContainer'
import Friends from './components/Friends'
import FriendSingle from './components/FriendSingle';

require('dotenv').config()


// Constants
const baseAPI = 'http://localhost:3000'

class App extends Component {
  	constructor(props) {
		super(props)
		this.state = {
			current_user : null,
			loginUser: null,
		}
	}

	// Login and Registration Methods
	handleLogin = async (loginInfo) => {
		console.log('Login:', loginInfo)
		try {
			let loginRes = await fetch(baseAPI + `/users/login`, {
				method: 'POST',
				body: JSON.stringify(loginInfo),
				// withCredentials: true,
				// credentials: 'include',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			})
			let jsonLogin = await loginRes.json()
			console.log('Login response:', jsonLogin)
			if(jsonLogin.auth) {
				localStorage.setItem('reviews-jwt', jsonLogin.token)
				this.setState({
					loginUser: jsonLogin.user_id,
				})
			} 
			return jsonLogin
		} catch (e) {
			return {
				auth: false,
				message: 'Unable to login, try again.'
			}
		}
	}
	handleRegister = async (regInfo) => {
		console.log('Register:',regInfo)
		let regRes = await fetch(baseAPI + `/users/new`, {
			method: 'POST',
			body: JSON.stringify(regInfo),
			// withCredentials: true,
			// credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		})
		let jsonReg = await regRes.json()
		if(!jsonReg.status) {
			localStorage.setItem('reviews-jwt', jsonReg.token)
			this.setState({
				loginUser: jsonReg.user.user_id,
			})
		}
		return jsonReg
		
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
			let stateTest = await this.setState({
				loginUser: jsonToken.user.user_id
			})
			console.log('Set login user:', this.state.loginUser)
		}
	}
	renderUserAuth(props) {
		return (
			< UserAuth
				handleLogin={this.handleLogin}
				handleRegister={this.handleRegister}
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
				<h1>Home</h1>
				<p>Logged in user: {this.state.loginUser}</p>
				<Router>
					<Switch>
						<Route path='/map' component={MapContainer}  />
						<Route path="/users" render={(props) =>  this.renderUserAuth(props)} />
						
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
