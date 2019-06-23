import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom'

import Button from 'react-bootstrap/Button'

import SearchBox from './SearchBox';


const mapStyles = {
    map: {
    //   position: 'absolute',
      width: '100%',
      height: '100%'
    }
};

class CurrentLocation extends React.Component {
    constructor(props) {
        super(props)
        let { lat, lng } = { lat: 41.9033, lng: -87.667572 }
        this.state = {
            currentLocation: {
                lat: lat,
                lng: lng
            },
            currMarker: {},
            currentPlace: {},
            toReviewNew: false
        }
        this.onPlacesChanged = this.onPlacesChanged.bind(this)
        // this.saveToUserPlaces = this.saveToUserPlaces.bind(this)
    }

    recenterMap() {
        // console.log('Recenter Map')
        // const map = this.map;
        const currentLoc = this.state.currentLocation
        // const google = google
        // const maps = google.maps
        const maps = this.props.google.maps

        if(this.map) {
            let center = new maps.LatLng(currentLoc.lat, currentLoc.lng)
            this.map.panTo(center)
        }
    }
    
    loadMap() {
        // console.log('Load Map - CurrentLocation this', this)
    
        if(this.props && this.props.google) {
            // Grabbing google, maps, zoom from the props for concise variable names
            const { google } = this.props
            const maps = google.maps
            let { zoom } = this.props;
            
            
            // Grabs the map ref (set in the render below) to get the map's DOM Node
            const mapRef = this.refs.map
            const mapNode = ReactDOM.findDOMNode(mapRef);

            // Check the current location and store a new center/zoom level in a config object
            const { lat, lng } = this.state.currentLocation
            const center = new maps.LatLng(lat, lng)
            const mapConfig = Object.assign( 
                {},
                {
                    center: center,
                    zoom: zoom,
                    streetViewControl: false,
                    mapTypeControl: false
                }
            )
            // Use the above config object to create a new map object
                // Saves it to this.map to access in other methods
            this.map = new maps.Map(mapNode, mapConfig)
        }
    }

    onPlacesChanged(places) {
        // console.log('hit on places changed', places, this)
        
        this.createMarker(places[0])
        this.map.setCenter(places[0].geometry.location)
    }

    createMarker(place) {
        const { google } = this.props
        
        // Check if there is an existing marker and remove if needed
        this.setState( prevState => {
            if(Object.keys(prevState.currMarker).length !== 0) {
                // Updates the marker state to have no map specified (removes from map)
                prevState.currMarker.setMap(null)
                return {
                    currMarker: null
                }
            }
        })
        
        // Create info window
        let newInfoWindow = new google.maps.InfoWindow({
            content:    `<h3> ${place.name} </h3>`
        })
        
        // Creates a new marker on the map with the search result
        let newMarker = new google.maps.Marker({
            map: this.map,
            position: place.geometry.location,
            title: place.name
        });
        
        // Open info window by default
        newInfoWindow.open(this.map, newMarker)

        // Code to open info on marker click - let it auto-open for now
        // newMarker.addListener('click', function(){
        //     newInfoWindow.open(this.map, newMarker)
        // })
        
        // Saves the new marker in the State
        this.setState({
            currMarker: newMarker,
            currentPlace: place
        })
    }

    saveToUserPlaces = () => {
        // console.log('save to places', this.state.currentPlace)

        this.setState({
            toReviewNew : true
        })

    }

    componentDidMount() {
        // console.log('DidMount')
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( pos => {
                const coords = pos.coords
                this.setState({
                    currentLocation: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    }
                })
            })
        }
        this.loadMap()
    }
    componentDidUpdate(prevProps, prevState) {
        // console.log('DidUpdate', prevProps.google, this.props.google)
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
        if (prevState.currentLocation !== this.state.currentLocation) { 
            this.recenterMap();
        }
    }

    // If this Component has any nested children, render them and pass needed props
    renderChildren() {
        const { children } = this.props;

        if (!children) return

        return React.Children.map(children, c => {
            if (!c) return;
            return React.cloneElement( c, {
                map: this.map,
                google: this.props.google,  
                mapCenter: this.state.currentLocation
            })
        })
    }

    render() {
        if(this.state.toReviewNew === true) {
            // return < Redirect to='/reviews/new' />
            return < Redirect to={{ 
                pathname: '/reviews/new',
                state: { 
                    place_id : this.state.currentPlace.place_id,
                    address : this.state.currentPlace.formatted_address,
                    name : this.state.currentPlace.name,
                    google_url : this.state.currentPlace.url
                }
            }} />
        }


        const style = { ...(mapStyles.map)}
        return (
            <div style={{ width: '100%', height: '50vh'}} >
                
                <h3 className="my-2">Find a place to review</h3>
                
                < SearchBox
                    google={this.props.google}
                    placeholder='Enter a place to review!'
                    onPlacesChanged={this.onPlacesChanged}
                />
                
                
                <div style={style} ref="map">
                    Loading map...
                </div>

                <Button className="col-12 my-3 py-3" variant='success' onClick={this.saveToUserPlaces}>Add to Places</Button>
                
                {this.renderChildren()}
            </div>
        );
    }
}

export default CurrentLocation;