import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
// import { InfoWindow, Marker } from 'google-maps-react';

import CurrentLocation from './CurrentLocation'

require('dotenv').config()


export class MapContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        // console.log('MapContainer Render - google:', this.props.google)

        return (
            < CurrentLocation
                google={this.props.google}
                zoom={14}
            >
            </ CurrentLocation >
        );
    }
  }

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_DEV_GOOGLE_API_KEY)
})(MapContainer);