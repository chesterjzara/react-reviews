import React, { Component } from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'

import logo from './logo.svg';
import './App.css';

// Bootstrap Components
import Button from 'react-bootstrap/Button';

// Child Components
import UserAccess from './components/UserAccess'
import About from './components/About'
import Map from './components/Map'

class App extends Component {
  	constructor(props) {
		  super(props)
	}

	renderUserAccess(props) {
		return (
			<UserAccess {...props} test={'testomg'} />
		)
	}
	renderMap(props) {
		return (
			<Map {...props} 
				id="myMap"
				options={ {
					center: { lat: 41.898801, lng: -87.674901 },
					zoom: 12
				}}
				//41.898801, 

				onMapLoad={map => {
					// let marker = new window.google.maps.Marker({
					// 	position: { lat: 41.0082, lng: 28.9784 },
					// 	map: map,
					// 	title: 'Hello Istanbul!'
					// })
				}}
			/>
		)
	}

	render() {
		return (
			<div>
				<h1>Home</h1>
				
				<Router>
					<Switch>
						<Route 
							path='/map' 
							render={(props) => this.renderMap(props) }  
						/>
						<Route 
							path="/users" 
							render={(props) =>  this.renderUserAccess(props)}
						/>
						<Route path="/about" component={About} />
						<Route path="/" />
					</Switch>
	 			</Router>
			 </div>
		)
	}
}
  

export default App;
