import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

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
		let login = await this.props.handleLogin({
			email: this.state.log_email,
			password: this.state.log_password
		})
		console.log('back in the handleLogin')
		console.log('Logged in:',login)
		this.setState( () => {
			return {
				toHome: login.auth,
				error: login.message 
			}
			
		}, this.clearFields())
		// this.clearFields()
	}
	handleRegister = async (event) => {
		event.preventDefault()
		let reg = await this.props.handleRegister({
			email : this.state.reg_email,
			first_name : this.state.reg_first_name,
			last_name : this.state.reg_last_name,
			password : this.state.reg_password,
		})
		console.log('back in handleRegister')
		console.log('Registered:', reg)
		this.setState( () => {
			return {
				toHome: reg.auth,
				error: reg.message
			}
		}, this.clearFields())
		
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