import React from 'react';
import PropTypes from 'prop-types';
import Cismap from '../containers/Cismap';
import {connect} from "react-redux";
import {Well} from 'react-bootstrap';
import Control from 'react-leaflet-control';

function mapStateToProps(state) {
    return {ui: state.uiState};
}
export class DefaultPage_ extends React.Component {
    render() {
        let info = (
            <Well pixelwidth={150} bsSize="small">
                <h2>Default</h2>
            </Well>
        );
        return (
            <div>
                <Cismap infoBox={info}/>                
            </div>
        );
    }
}
const DefaultPage = connect(mapStateToProps)(DefaultPage_);

export default DefaultPage;

DefaultPage_.propTypes = {
    ui: PropTypes.object,
    kassenzeichen: PropTypes.object,
    uiState: PropTypes.object
};
