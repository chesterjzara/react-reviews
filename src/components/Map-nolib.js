import React, { Component } from 'react';


class Map extends Component {
    constructor(props) {
        super(props);
        this.onScriptLoad = this.onScriptLoad.bind(this)
    }
    
    onScriptLoad() {
        const map = new window.google.maps.Map(
            document.getElementById(this.props.id),
            this.props.options
        )
        this.props.onMapLoad(map)
    }

    componentDidMount() {
        if(!window.google) {
            let s = document.createElement('script');
            s.type = 'text/javascript'
            s.src = `https://maps.google.com/maps/api/js?key=${''}`
            let x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x)

            s.addEventListener('load', (e) => { 
                this.onScriptLoad();
            })
        } 
        else {
            this.onScriptLoad()
        }
    }
    
    render() {
      return (
        < React.Fragment >
            <input id='search-input' type="text" placeholder="Search for a place"/>
            <div style={{ width: 500, height: 500 }} id={this.props.id}/>
            <div id="infowindow-content">
                <span id="place-name" className="title"></span><br/>
                <strong>Place ID:</strong> <span id="place-id"></span><br/>
                <span id="place-address"></span>
            </div>
        </React.Fragment>
      )
    }
  }

  export default Map;