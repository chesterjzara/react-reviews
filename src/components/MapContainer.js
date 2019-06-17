import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { InfoWindow, Marker } from 'google-maps-react';

import CurrentLocation from './CurrentLocation'

const mapStyles = {
    width: '100%',
    height: '100%'
  };



export class MapContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showingInfoWindow: false,   //Hide/show infoWindow 
            activeMarker: {},           //Shows active marker
            selectedPlace: {}           // Shows infoWindow for selected palce on marker
        }
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onClose = () => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    handleApiLoaded(map, maps) {
        console.log('Hit handleApiLoaded')
        console.log('map', map)
        console.log('mapS', maps)
    }

    render() {
        console.log('MapContainer Render - google:', this.props.google)
        return (
            < CurrentLocation
                centerAroundCurrentLocation
                google={this.props.google}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
            >
                {/* < Marker    
                    onClick={this.onMarkerClick}
                    name={'Kenyatta International My Text'}
                />
                < InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                    <div> <h4>{this.state.selectedPlace.name} </h4> </div>
                </InfoWindow> */}
            </ CurrentLocation >
        );
    }
  }

export default GoogleApiWrapper({
    apiKey: 'AIzaSyD7QmnwDgDKfWnQCs_6HCDWi51OrYV9lec'
})(MapContainer);