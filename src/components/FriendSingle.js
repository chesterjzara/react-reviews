import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class FriendSingle extends Component {
    constructor(props) {
        super(props)
    }

    render() {
    	if(this.props.loginUser === null) {
        	return <Redirect to={{pathname: '/users', state: {error: 'Please log in first. '}}} />
		}
      	return (
			<h1>Single friend ID {this.props.match.params.user_id}</h1>
		)
    }
}

export default FriendSingle;