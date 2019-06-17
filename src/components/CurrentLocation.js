import React from 'react';
import ReactDOM from 'react-dom';
import SearchBox from './SearchBox';

const mapStyles = {
    map: {
      position: 'absolute',
      width: '100%',
      height: '100%'
    }
};

//changess that are bad

class CurrentLocation extends React.Component {
    constructor(props) {
        super(props)
        let { lat, lng } = this.props.initialCenter
        this.state = {
            currentLocation: {
                lat: lat,
                lng: lng
            },
            currMarker: {},
            currentPlace: {}
        }
        this.onPlacesChanged = this.onPlacesChanged.bind(this)
        this.saveToUserPlaces = this.saveToUserPlaces.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
        if (prevState.currentLocation !== this.state.currentLocation) { 
            this.recenterMap();
        }
    }

    recenterMap() {
        const map = this.map;
        const current = this.state.currentLocation
        const google = this.props.google
        const maps = google.maps

        if(map) {
            let center = new maps.LatLng(current.lat, current.lng)
            map.panTo(center)
        }
    }

    componentDidMount() {
        if(this.props.centerAroundCurrentLocation) {
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
        }
        this.loadMap()
    }
    
    loadMap() {
        console.log('load map this:', this)
        
        if(this.props && this.props.google) {
            const { google } = this.props
            const maps = google.maps
            const mapRef = this.refs.map

            const node = ReactDOM.findDOMNode(mapRef);

            let { zoom } = this.props;
            const { lat, lng } = this.state.currentLocation
            const center = new maps.LatLng(lat, lng)
            const mapConfig = Object.assign( 
                {},
                {
                    center: center,
                    zoom: zoom
                }
            );
            this.map = new maps.Map(node, mapConfig)
        }
    }

    onPlacesChanged(places) {
        console.log('hit on places changed')
        console.log(places)
        console.log(this)
        this.createMarker(places[0])
        this.map.setCenter(places[0].geometry.location)
    }

    createMarker(place) {
        const { google } = this.props
        
        // Check if there is an existing marker and remove if needed
        this.setState( prevState => {
            if(Object.keys(prevState.currMarker).length !== 0) {
                // Updates the marker state to have no map specified (removes from map)
                let updatedMarker = prevState.currMarker.setMap(null)
                return {
                    currMarker: null
                }
            }
        })
        
        // Create info window
        let newInfoWindow = new google.maps.InfoWindow({
            content:    `<h2> Test info window </h2>
                        <h3> ${place.name} </h3>`
        })
        
        // Creates a new marker on the map with the search result
        let newMarker = new google.maps.Marker({
            map: this.map,
            position: place.geometry.location,
            title: place.name
        });
        
        // Open info window by default
        newInfoWindow.open(this.map, newMarker)

        // Code to open info on marker click
        // newMarker.addListener('click', function(){
        //     newInfoWindow.open(this.map, newMarker)
        // })
        
        // Saves the new marker in the State
        this.setState({
            currMarker: newMarker,
            currentPlace: place
        })
    }

    saveToUserPlaces() {
        console.log('save to places')
        console.log(this.state.currentPlace)
    }

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
        const style = Object.assign({}, mapStyles.map);
        return (
            <div>
                < SearchBox
                    google={this.props.google}
                    placeholder='placeholder for box'
                    onPlacesChanged={this.onPlacesChanged}
                />
                <button onClick={this.saveToUserPlaces}>Add to Places</button>
                <div style={style} ref="map">
                    Loading map...
                </div>
                {this.renderChildren()}
            </div>
        );
    }
}

export default CurrentLocation;
    
CurrentLocation.defaultProps = {
    zoom: 14,
    initialCenter: { lat: 41.9033, lng: -87.667572 },
    centerAroundCurrentLocation: false,
    visible: true
};