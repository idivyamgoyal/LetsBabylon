import React from 'react';
import mapboxgl from 'mapbox-gl';
import { SceneComponent } from './SceneComponent';
import cuboid from './cuboid';
import { mapBoxToken} from './keys';
import axios from 'axios';

var map;
mapboxgl.accessToken = mapBoxToken;

export default class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // default delhi
            lat: 28.6139391,
            lng: 77.2090212,
            zoom: 9,
            city: '',
            image: '',
        };
        this.mapContainer = React.createRef();
        this.mapSnap = React.createRef();
    }

    mapFunction = () => {
        map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: "mapbox://styles/mapbox/outdoors-v11",
            zoom: this.state.zoom,
            center: [this.state.lng, this.state.lat],
            preserveDrawingBuffer: true
        });
        map.resize();
    }

    componentDidMount() {
        this.mapFunction();
    }

    handleClick = () => {
        document.getElementsByClassName('mapSelector')[0].style.display = 'none';
        document.getElementsByClassName('mapBtn')[0].style.display = 'block';
        this.setState({
            image: map.getCanvas().toDataURL()
        });
    };

    setCity = (event) => {
        this.setState({
            city: event.target.value
        });
    }

    onSubmit = async (event) => {
        event.preventDefault();
        try {
            const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.city}.json?access_token=${mapBoxToken}`);
            const latitude = result.data.features[0].center[1];
            const longitude = result.data.features[0].center[0];
            this.setState({
                lat: latitude,
                lng: longitude,
                city: ''
            }, () => {
                // console.log(this.state.lat, this.state.lng);
                map.flyTo({
                    center: [this.state.lng, this.state.lat],
                    essential: true
                });
            });
        }
        catch(err) {
            console.log("Error in location: " + err);
            alert("Invalid Search!");
        }
    }

    showSelector = () => {
        document.getElementsByClassName('mapSelector')[0].style.display = 'block';
        map.resize();
        document.getElementsByClassName('mapBtn')[0].style.display = 'none';
    }

    hideMap = () => {
        document.getElementsByClassName('mapSelector')[0].style.display = 'none';
        document.getElementsByClassName('mapBtn')[0].style.display = 'block';
    }

    render() {
        return (
            <div className="fullBody">
                <div className="mainDiv">
                    <div className="header">
                        <span className="headerText-left"><a href=".">Lets Babylon!</a></span>
                        <a href="https://divyamgoyal.com"><img src={process.env.PUBLIC_URL + "/assets/favicons/favicon.ico"} className="headerText-right" alt="DivyamGoyal" /></a>
                    </div>
                    <div className="appBody">
                        <div ref={this.mapSnap} id="screenshotPlaceholder">
                            <SceneComponent antialias onSceneReady={cuboid.onSceneReady} onRender={cuboid.onRender} image={this.state.image} id="my-canvas" />
                            <div className="mapSelector">
                                <div className="searchForm">
                                    <div className="form-group">
                                        <button className="btn btn-danger" onClick={this.handleClick}>
                                            Take Screenshot
                                        </button>
                                    </div>
                                    <form className="form-inline" onSubmit={this.onSubmit}>
                                        <div className="form-group mx-sm-3 mb-2">
                                            <input className="form-control" placeholder="Enter the City Name" onChange={this.setCity} value={this.state.city} />
                                        </div>
                                        <input className="btn btn-success mb-2" type="submit" value="Search" />
                                    </form>
                                </div>
                                <div ref={this.mapContainer} className="map-container" />
                                <div className="closeMap">
                                    <button className="btn btn-warning circleBtn" onClick={this.hideMap}>X</button>
                                </div>
                            </div>
                            <div className="mapBtn">
                                <button className="btn btn-light" onClick={this.showSelector}>Map</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="myFooter">
                    <div className="container">
                        <a href="https://divyamgoyal.com"><img src={process.env.PUBLIC_URL + "/assets/favicons/favicon-32x32.png"} className="headerText-right" alt="DivyamGoyal" /></a>
                        <div>
                            Developed by <a href="https://divyamgoyal.com">Divyam Goyal</a>.
                        </div>
                        <div>
                            <a href="https://github.com/idivyamgoyal">Github</a> | <a href="https://linkedin.com/in/idivyamgoyal">LinkedIn</a> | <a href="mailto:divyamgoyal9930@gmail.com">Mail</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}