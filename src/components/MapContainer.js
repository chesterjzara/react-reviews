import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { InfoWindow, Marker } from 'google-maps-react';

import CurrentLocation from './CurrentLocation'

require('dotenv').config()

const mapStyles = {
    width: '100%',
    height: '100%'
  };



export class MapContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // showingInfoWindow: false,   //Hide/show infoWindow 
            // activeMarker: {},           //Shows active marker
            // selectedPlace: {}           // Shows infoWindow for selected palce on marker
        }
    }

    // onMarkerClick = (props, marker, e) => {
    //     this.setState({
    //         selectedPlace: props,
    //         activeMarker: marker,
    //         showingInfoWindow: true
    //     });
    // }

    // onClose = () => {
    //     if (this.state.showingInfoWindow) {
    //         this.setState({
    //             showingInfoWindow: false,
    //             activeMarker: null
    //         });
    //     }
    // };

    render() {
        console.log('MapContainer Render - google:', this.props.google)

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