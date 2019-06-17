import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

const baseAPI = 'http://localhost:3000'

class UserAuth extends Component {
	constructor(props) {
		super(props)
		this.state = {
			reg_email : '',
			reg_first_name: '',
			reg_last_name: '',
			reg_password: '',
			log_email : '',
			log_password : '',
			
			error: '',
			toHome: false,
		}
	}

	

	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value
		})
	}
	handleLogin = async (event) => {
		event.preventDefault()
		let loginInfo = {
			email: this.state.log_email,
			password: this.state.log_password
		}
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
				// localStorage.setItem('reviews-jwt', jsonLogin.token)
				this.props.handleSetLoginUser(jsonLogin)
				this.setState({
					toHome: true
				}, this.clearFields())
			} else {
				this.setState({
					error: jsonLogin.message
				}, this.clearFields())
			}
		} catch (e) {
			this.setState({
				error: 'Unable to login, try again.'
			}, this.clearFields())	
		}
	}
	handleRegister = async (event) => {
		event.preventDefault()
		// let reg = await this.props.handleRegister({
		// 	email : this.state.reg_email,
		// 	first_name : this.state.reg_first_name,
		// 	last_name : this.state.reg_last_name,
		// 	password : this.state.reg_password,
		// })
		// console.log('back in handleRegister')
		// console.log('Registered:', reg)
		// this.setState( () => {
		// 	return {
		// 		toHome: reg.auth,
		// 		error: reg.message
		// 	}
		// }, this.clearFields())

		try {
			let regInfo = {
				email : this.state.reg_email,
				first_name : this.state.reg_first_name,
				last_name : this.state.reg_last_name,
				password : this.state.reg_password,
			}
			let regRes = await fetch(baseAPI + `/users/new`, {
				method: 'POST',
				body: JSON.stringify(regInfo),
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			})
			let jsonReg = await regRes.json()
			if(!jsonReg.status) {
				this.props.handleSetLoginUser(jsonReg)
				this.setState({
					toHome: true
				}, this.clearFields())
			} else {
				this.setState({
					error: jsonReg.message
				}, this.clearFields())
			}
		} catch (e) {
			this.setState({
				error: 'Unable to login, try again.'
			}, this.clearFields())	
		}
	}

	clearFields = () => {
		this.setState({
			reg_email : '',
			reg_first_name: '',
			reg_last_name: '',
			reg_password: '',
			log_email : '',
			log_password : '',
		})
	}
	
	render() {
		if(this.state.toHome === true)
			return <Redirect to='/' />
		return (
			<main className="user-access-page">
				<h1>Register </h1>
				<form onSubmit={this.handleRegister}>
					<input type="email" placeholder="Email" id='reg_email' 
						value={this.state.reg_email} onChange={this.handleChange} />
					
					<input type="text" placeholder="First Name" id='reg_first_name' 
						value={this.state.reg_first_name} onChange={this.handleChange} />
					
					<input type="text" placeholder="Last Name" id='reg_last_name' 
						value={this.state.reg_last_name} onChange={this.handleChange} />
					
					<input type="password" placeholder="Password" id='reg_password' 
						value={this.state.reg_password} onChange={this.handleChange}/>
					
					<input type="submit" value="Register"/>
				</form>
				
				<h1>Log In </h1>
				<form onSubmit={this.handleLogin} >
					<input type="email" placeholder="Email" id='log_email' 
						value={this.state.log_email} onChange={this.handleChange} />
					<input type="password" placeholder="Password" id='log_password' 
						value={this.state.log_password} onChange={this.handleChange}/>
					<input type="submit" value="Login"/>

				</form>

				{ this.state.error ? 
					<h2> {this.state.error} </h2>
					: ''
				}

			</main>
		)
	}
}
export default UserAuth;