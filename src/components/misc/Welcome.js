import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

import { baseAPI} from '../../App'

import Button from 'react-bootstrap/Button'


let friendsURL = './img/friends.jpg'
let mapURL = './img/map.png'
let decideURL = './img/decision.jpg'


class Welcome extends Component {
	constructor(props) {
		super(props)
		this.state = {
			toHome: false,
			error: ''
		}
	}
	
	guestLogin = async (event) => {
		event.preventDefault()
		
		let loginInfo = {
			email: 'cjz@gmail.com',
			password: 'pass'
		}
		try {
			let loginRes = await fetch(baseAPI + `/users/login`, {
				method: 'POST',
				body: JSON.stringify(loginInfo),
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			})
			let jsonLogin = await loginRes.json()
			// console.log('Login response:', jsonLogin)
			if(jsonLogin.auth) {
				this.props.handleSetLoginUser(jsonLogin)
				this.setState({
					toHome: true
				})
			} else {
				this.setState({
					error: jsonLogin.message
				})
			}
		} catch (e) {
			console.log('Error with guest login')
		}
	}
	
	render() {
		if(this.state.toHome === true) {
			return <Redirect to='/' />
		}

		return (
			<div className="welcome-container">
				{/* <h1>Welcome!</h1> */}
				<div className="welcome-friends"
					style={{
						backgroundImage: `url(${friendsURL})`,
						backgroundSize: 'cover',
						backgroundPosition: 'bottom center'
					}}>
					<h2>Add your friends</h2>
				</div>
				<div className="welcome-places"
					style={{
						backgroundImage: `url(${mapURL})`,
						backgroundSize: 'cover'
					}}>
					<h2>Add the places you go</h2>
				</div>
				<div className="welcome-suggest"
					style={{
						backgroundImage: `url(${decideURL	})`,
						backgroundSize: 'cover'
					}}>
					<h2>Let us suggest places when you can't decide.</h2>
				</div>
				<div className="text-center welcome-options">
					<Link to="/users" >
						<Button className="mx-3">
							Sign Up / Login
						</Button>
					</Link>
					<Button className="mx-3" onClick={this.guestLogin}>
						Try Our Guest User
					</Button>
				</div>
			</div>

		)
  	}	
}
export default Welcome;