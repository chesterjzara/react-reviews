import React, { Component } from 'react'

class UserAuth extends Component {
  render() {
    return (
        <div>
            <h1>Users</h1>
            <p>Props test: {this.props.test}</p>
        </div>
    )
  }
}
export default UserAuth;