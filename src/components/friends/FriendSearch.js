import React, { Component } from 'react'

class FriendSearch extends Component {
	constructor(props) {
		super(props)
		
	}

    render() {
      	return (
			<div className="friend-search">
                    <h1>Find Friends</h1>
                    <form onSubmit={this.handleSearchSubmit}>
                        <input type="text" placeholder='Search Name' id="searchName" onChange={this.handleChange} value={this.state.searchName}/>
                        <input type="submit" value="Find"/>
                    </form>
                    <div>
                        <ul>
                            {this.state.searchArray.length < 1 ? 
                                <li> No matches</li>
                                :
                                this.state.searchArray.map( (item, index) => {
                                    return (
                                        <li key={index}> 
                                            <Link to={`/friends/${item.user_id}`}>
                                        	    {item.first_name} {item.last_name}
                                            </Link> 
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
    	)
  }
}
export default FriendSearch;