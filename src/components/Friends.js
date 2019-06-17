import React, { Component } from 'react'

import FriendsList from './FriendsList'

class Friends extends Component {
    constructor(props) {
        super(props)
        this.state = {
            array: [ 
                {name: 'emma', id: 1 }, 
                {name: 'grant', id: 4 }, 
                {name: 'dan', id: 12 },
                {name: 'colin', id: 87 },
                {name: 'brett', id: 99 },
                {name: 'abc', id: 123 }
            ]
        }
    }
  
    render() {
        return (
            <div className="friends-main">
                <div className="current-friends">

                </div>
                < FriendsList
                    list={this.state.array}
                />

            </div>
        )
  }
}
export default Friends;