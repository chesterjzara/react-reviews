import React, { Component } from 'react'

class FriendSingle extends Component {
    constructor(props) {
        super(props)
    }
    render() {
      return <h1>Single friend ID {this.props.match.params.user_id}</h1>
    }
}
export default FriendSingle;