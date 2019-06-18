import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchBox extends React.Component {
    render() {
        return <input ref="input" placeholder={this.props.placeholder} type="text"/>;
    }
    onPlacesChanged = () => {
        if (this.props.onPlacesChanged) {
            this.props.onPlacesChanged(this.searchBox.getPlaces());
        }
    }
    componentDidMount() {
        let google = this.props.google
        
        var input = ReactDOM.findDOMNode(this.refs.input);
        this.searchBox = new google.maps.places.SearchBox(input);
        this.searchBox.addListener('places_changed', this.onPlacesChanged);
    }
    componentWillUnmount() {
        // https://developers.google.com/maps/documentation/javascript/events#removing
        let google = this.props.google
        google.maps.event.clearInstanceListeners(this.searchBox);
    }
}