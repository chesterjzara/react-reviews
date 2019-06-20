import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import Form from 'react-bootstrap/Form'
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'

import { baseAPI} from '../App'


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

			validatedReg: false,
			validatedLog: false

		}
		this._isMounted = false;
	}

	// Prevent changing UserAuth state once un-mounted
	//https://stackoverflow.com/questions/52061476/cancel-all-subscriptions-and-asyncs-in-the-componentwillunmount-method-how/52061655
	componentDidMount() {
		this._isMounted = true
	}
	componentWillUnmount() {
		this._isMounted = false;
	 }

	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value
		})
	}
	handleLogin = async (event) => {
		event.preventDefault()
		let form = event.currentTarget;
		if(form.checkValidity() === false) {
			event.stopPropagation();
		} else {
			let loginInfo = {
				email: this.state.log_email,
				password: this.state.log_password
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
				console.log('Login response:', jsonLogin)
				if(jsonLogin.auth) {
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
		
		this._isMounted && this.setState({ validatedLog: true })
	}
	handleRegister = async (event) => {
		event.preventDefault()

		let form = event.currentTarget;
		if(form.checkValidity() === false) {
			event.stopPropagation();
		} else {
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

		this.setState({ validatedReg: true })
		
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
				
				{ this.state.error ? 
					<Alert variant="danger">{this.state.error} </Alert> 
					: ''
				}
				
				<h3 className="mt-3"> Register </h3>
				
				<Form
					onSubmit={e => this.handleRegister(e)}
					noValidate
        			validated={this.state.validatedReg}	
				>
					<Form.Group >
						<FormLabel> Email Address</FormLabel>
						< Form.Control type="email" placeholder="Enter email" 	
							id="reg_email"
							value={this.state.reg_email} 
							onChange={this.handleChange}
							required
						/> 
						<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid">
							Please enter your email with an @ and a .com.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group >
						<FormLabel> First Name </FormLabel>
						< Form.Control type="text" placeholder="First Name" 	
							id="reg_first_name"
							value={this.state.reg_first_name} 
							onChange={this.handleChange}
							required
						/> 
						<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid">
							Please enter your first name.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group >
						<FormLabel> Last Name </FormLabel>
						< Form.Control type="text" placeholder="Last Name" 	
							id="reg_last_name"
							value={this.state.reg_last_name} 
							onChange={this.handleChange}
							required
						/> 
						<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid">
							Please enter your last name.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group >
						<FormLabel> Password </FormLabel>
						< Form.Control type="password" placeholder="Password" 	
							id="reg_password"
							value={this.state.reg_password} 
							onChange={this.handleChange}
							required
						/> 
						<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid">
							Please enter a password!
						</Form.Control.Feedback>
					</Form.Group>
					
					<Button type="submit">Register</Button>

						

				</Form>
				
				{/* <form onSubmit={this.handleLogin} >
					<input type="email" placeholder="Email" id='log_email' 
						value={this.state.log_email} onChange={this.handleChange} />
					<input type="password" placeholder="Password" id='log_password' 
						value={this.state.log_password} onChange={this.handleChange}/>
					<input type="submit" value="Login"/>

				</form> */}

				<h3 className="mt-3">Log In </h3>
				<Form 
					onSubmit={e => this.handleLogin(e)}
					noValidate
        			validated={this.state.validatedLog}
				>
					<Form.Group >
						<FormLabel> Email Address</FormLabel>
						< Form.Control type="email" placeholder="Enter email" 	
							id="log_email"
							value={this.state.log_email} 
							onChange={this.handleChange}
							required
						/> 
						<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid">
							Please enter your email with an @ and a .com.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group >
						<FormLabel> Password </FormLabel>
						< Form.Control type="password" placeholder="Password" 	
							id="log_password"
							value={this.state.log_password} 
							onChange={this.handleChange}
							required
						/> 
						<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid">
							Please enter a password!
						</Form.Control.Feedback>
					</Form.Group>
					<Button type="submit"> Login </Button>

				</Form>

				

			</main>
		)
	}
}
export default UserAuth;