import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';
import { connect } from "react-redux";
import 'proj4leaflet';
import { Layers } from '../components/Layers';
import FeatureCollectionDisplay from '../components/FeatureCollectionDisplay';
import GazetteerHitDisplay from '../components/GazetteerHitDisplay';
import { crs25832, proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';
import { bindActionCreators } from 'redux';
//import 'react-leaflet-fullscreen/dist/styles.css';
import FullscreenControl from '../components/FullscreenControl';
import Control from 'react-leaflet-control';
import { Form, FormGroup, InputGroup, FormControl, Button, Well, OverlayTrigger,Tooltip} from 'react-bootstrap';
import { Typeahead, AsyncTypeahead } from 'react-bootstrap-typeahead';
import * as stateConstants from '../constants/stateConstants';
import Loadable from 'react-loading-overlay'
import { routerActions } from 'react-router-redux'
import { modifyQueryPart } from '../utils/routingHelper'
import { actions as mappingActions, constants as mappingConstants } from '../redux/modules/mapping';
import objectAssign from 'object-assign';
import {Icon} from 'react-fa'
import { actions as uiStateActions, constants as uiStateConstants } from '../redux/modules/uiState';
import 'url-search-params-polyfill';


import { experimentalDownload } from '../utils/downloadHelper';


import {
  WUNDAAPI,
  DOMAIN
} from '../constants/services';

const fallbackposition = {
  lat: 51.272399,
  lng: 7.199712
};


function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    attributionControl: false,
    routing: state.routing,

  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
    routingActions: bindActionCreators(routerActions,dispatch),
    uiStateActions: bindActionCreators(uiStateActions,dispatch),
  };
}

export function createLeafletElement () {}    

export class Cismap_ extends React.Component {
      constructor(props) {
        super(props);
        this.internalGazeteerHitTrigger=this.internalGazeteerHitTrigger.bind(this);
        this.internalSearchButtonTrigger=this.internalSearchButtonTrigger.bind(this);
        this.featureClick = this.featureClick.bind(this);        
        this.handleSearch=this.handleSearch.bind(this);
        this.showModalHelpComponent=this.showModalHelpComponent.bind(this);

      }
componentDidMount() {
    this.refs.leafletMap.leafletElement.on('moveend', () => {
        const zoom=this.refs.leafletMap.leafletElement.getZoom();
        const center= this.refs.leafletMap.leafletElement.getCenter();
        const latFromUrl=parseFloat(new URLSearchParams(this.props.routing.location.search).get('lat'));
        const lngFromUrl=parseFloat(new URLSearchParams(this.props.routing.location.search).get('lng'));
        const zoomFromUrl=parseInt(new URLSearchParams(this.props.routing.location.search).get('zoom'));
        var lat=center.lat
        var lng=center.lng

        if (Math.abs(latFromUrl-center.lat) < 0.0001) {
          lat=latFromUrl;
        }
        if (Math.abs(lngFromUrl-center.lng) < 0.0001) {
          lng=lngFromUrl;
        }
        
        const querypart='?lat='+lat+'&lng='+lng+'&zoom='+zoom;
        if (lng!==lngFromUrl || lat!==latFromUrl || zoomFromUrl!==zoom) {
          //store.dispatch(push(this.props.routing.locationBeforeTransitions.pathname + querypart))
          this.props.routingActions.push(
            this.props.routing.location.pathname
            + modifyQueryPart(this.props.routing.location.search,{
              lat:lat,
              lng:lng,
              zoom:zoom
            }))
        }
        this.storeBoundingBox();
        
    });
    this.storeBoundingBox();
}

componentDidUpdate() {
    if ((typeof (this.refs.leafletMap) != 'undefined' && this.refs.leafletMap != null)) {
      if (this.props.mapping.autoFitBounds) {
        if (this.props.mapping.autoFitMode==stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN) {
          if (!this.refs.leafletMap.leafletElement.getBounds().contains(this.props.mapping.autoFitBoundsTarget)) {
            this.refs.leafletMap.leafletElement.fitBounds(this.props.mapping.autoFitBoundsTarget);         
          }
        }
        else {
          this.refs.leafletMap.leafletElement.fitBounds(this.props.mapping.autoFitBoundsTarget);        
        }
        this.props.mappingActions.setAutoFit(false);
      }
    }
  }


storeBoundingBox(){
  //store the projected bounds in the store
  const bounds=this.refs.leafletMap.leafletElement.getBounds()
  const projectedNE=proj4(proj4.defs('EPSG:4326'),proj4crs25832def,[bounds._northEast.lng,bounds._northEast.lat])
  const projectedSW=proj4(proj4.defs('EPSG:4326'),proj4crs25832def,[bounds._southWest.lng,bounds._southWest.lat])
  const bbox = {left: projectedSW[0], top: projectedNE[1], right: projectedNE[0], bottom: projectedSW[1]};
  //console.log(getPolygon(bbox));
  this.props.mappingActions.mappingBoundsChanged(bbox);
}

internalGazeteerHitTrigger(hit){
   //this.props.routingActions.push(this.props.routing.locationBeforeTransitions.pathname+"lat=51.271767290892676&lng=7.2000696125004575&zoom=14");
   if (hit!==undefined && hit.length !=undefined && hit.length>0 && hit[0].x!==undefined && hit[0].y!==undefined) {
      //console.log(JSON.stringify(hit))
      const pos=proj4(proj4crs25832def,proj4.defs('EPSG:4326'),[hit[0].x,hit[0].y])
      //console.log(pos)
      this.refs.leafletMap.leafletElement.panTo([pos[1],pos[0]], {"animate":false});
      
      let hitObject=objectAssign(hit[0],JSON.parse(hit[0].more))
      this.refs.leafletMap.leafletElement.setZoom(hitObject.zoomlevel,{"animate":false});
      
      // this.props.routingActions.push(
      //       this.props.routing.locationBeforeTransitions.pathname 
      //       + modifyQueryPart(this.props.routing.locationBeforeTransitions.query,{
      //         lat:pos[1],
      //         lng:pos[0]
      //       }));
      this.props.mappingActions.gazetteerHit(hitObject);

      if (this.props.gazeteerHitTrigger!==undefined) {
        this.props.gazeteerHitTrigger(hit);
      }
  }
  else {
    //console.log(hit);
  }
  
  
}

internalSearchButtonTrigger(event) {
    if (this.searchOverlay) {
        this
            .searchOverlay
            .hide();
    }
    if (this.props.mapping.searchInProgress === false && this.props.searchButtonTrigger !== undefined) {
        this
            .refs
            .typeahead
            .getInstance()
            .clear();
        this
            .props
            .mappingActions
            .gazetteerHit(null);
        this
            .props
            .searchButtonTrigger(event)
    } else {
        //console.log("search in progress or no searchButtonTrigger defined");
    }

}
featureClick(event) {
    this.props.featureClickHandler(event);
}

showModalHelpComponent() {
    this.props.uiStateActions.showHelpComponent(true);
}


renderMenuItemChildren(option, props, index) {
    return (
      <div key={option.id}>
       <Icon style={{
            marginRight: '10px',
            width: '18px',
          }} name={option.glyphkey} size={'lg'} />
        <span>{option.string}</span>
      </div>
    );
  }

  handleSearch(query) {
    if (!query) {
      return;
    }

    let queryO={
      "list": [{
        "key": "input",
        "value": query
      }]
    };
    fetch(WUNDAAPI + '/searches/WUNDA_BLAU.BPlanAPIGazeteerSearch/results?role=all&limit=100&offset=0', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryO)

    })
      .then(resp => resp.json())
      .then(json => {
        this.setState({options: json.$collection});
      });
  }

render() {
    const mapStyle = {
      height: this.props.uiState.height,
      width:  this.props.uiState.width
    };
    if (mapStyle.height==null || mapStyle.width==null) {
      mapStyle.height=window.innerHeight
      mapStyle.width=window.innerWidth
    }
   
//    const positionByUrl=[parseFloat(this.props.routing.locationBeforeTransitions.query.lat)||fallbackposition.lat,parseFloat(this.props.routing.locationBeforeTransitions.query.lng)||fallbackposition.lng]
//    const zoomByUrl= parseInt(this.props.routing.locationBeforeTransitions.query.zoom)||14

   const positionByUrl=[
    parseFloat(new URLSearchParams(this.props.routing.location.search).get('lat'))||fallbackposition.lat,
    parseFloat(new URLSearchParams(this.props.routing.location.search).get('lng'))||fallbackposition.lng];
  const zoomByUrl= parseInt(new URLSearchParams(this.props.routing.location.search).get('zoom'),10)||14;



   const layerArr=this.props.layers.split(",");

//      <Icon name='search' />

   let searchIcon=(
      <Icon name='search' />
   )
   if (this.props.mapping.searchInProgress) {
     searchIcon=(
      <Icon spin name="refresh" />
     )
   }

    const searchAllowed=(zoomByUrl>=this.props.searchMinZoom && zoomByUrl<=this.props.searchMaxZoom);
    return (
      <Map 
        ref="leafletMap"
        key="leafletMap" 
        crs={crs25832}  
        style={mapStyle} 
        center={positionByUrl} 
        zoom={zoomByUrl} 
        zoomControl={false}
        attributionControl={false} 
        doubleClickZoom={false}
        minZoom={7} 
        maxZoom={18}
        >
        {
          layerArr.map((layerWithOpacity)=> {
            const layOp=layerWithOpacity.split('@')
              return Layers.get(layOp[0])(parseInt(layOp[1]||'100')/100.0);
          })
        }
       <GazetteerHitDisplay key={"gazHit"+JSON.stringify(this.props.mapping)} mappingProps={this.props.mapping} />
       <FeatureCollectionDisplay key={JSON.stringify(this.props.mapping)} mappingProps={this.props.mapping} style={this.props.featureStyler} labeler={this.props.labeler} featureClickHandler={this.featureClick} mapRef={this.refs.leafletMap}/>
       <ZoomControl position="topleft" zoomInTitle="Vergr&ouml;ßern" zoomOutTitle="Verkleinern" />
       <FullscreenControl title="Vollbildmodus" forceSeparateButton={true} titleCancel="Vollbildmodus beenden" position="topleft" /> 
       <Control position="bottomleft"  >
        <Form style={{ width: '300px'}}  action="#">
            <FormGroup >
              <InputGroup>
                  <InputGroup.Button  disabled={this.props.mapping.searchInProgress||!searchAllowed} onClick={this.internalSearchButtonTrigger}>
                    <OverlayTrigger ref={c=>this.searchOverlay=c} placement="top" overlay={this.props.searchTooltipProvider()}>
                      <Button disabled={this.props.mapping.searchInProgress||!searchAllowed} >{searchIcon}</Button>
                    </OverlayTrigger>
                  </InputGroup.Button>
                <AsyncTypeahead ref="typeahead" style={{ width: '300px'}}
                  {...this.state}
                  labelKey="string"
                  useCache={false}
                  onSearch={this.handleSearch}
                  onChange={this.internalGazeteerHitTrigger}
                  paginate={true}
                  dropup={true}
                  placeholder="Geben Sie einen Suchbegriff ein."
                  minLength={2}
                  align={'justify'}
                  emptyLabel={'Keine Treffer gefunden'}
                  paginationText={"Mehr Treffer anzeigen"}
                  autoFocus={true}
                  searchText={"suchen ..."}
                  renderMenuItemChildren={this.renderMenuItemChildren}
                  />
              </InputGroup>
            </FormGroup>
            </Form>
          </Control>
          <Control position="topright"  >
            <OverlayTrigger placement="left" overlay={this.props.helpTooltipProvider()}>
              <Button onClick={this.showModalHelpComponent}><Icon name='info'/></Button>
           </OverlayTrigger>
          </Control>

         {this.props.children}
      </Map>
    );
    
  }
}

const Cismap = connect(mapStateToProps, mapDispatchToProps, null, {withRef:true})(Cismap_);
export default Cismap;

Cismap_.propTypes = {
  uiState: PropTypes.object,
  mapping: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  layers: PropTypes.string.isRequired,
  gazeteerHitTrigger: PropTypes.func.isRequired,
  searchButtonTrigger: PropTypes.func.isRequired,
  mappingAction: PropTypes.object,
  featureStyler: PropTypes.func.isRequired,
  labeler: PropTypes.func.isRequired,
  featureClickHandler: PropTypes.func.isRequired,
  helpTooltipProvider: PropTypes.func,
  searchTooltipProvider: PropTypes.func,
  searchMinZoom: PropTypes.number,
  searchMaxZoom: PropTypes.number,

};

Cismap_.defaultProps = {
  layers: "bplan_abkg_uncached",
  gazeteerHitTrigger: function(){},
  searchButtonTrigger: function(){},
  featureClickHandler: function(){},
  helpTooltipProvider:  function(){  
    return (<Tooltip style={{zIndex: 3000000000}} id="helpTooltip">Bedienungsanleitung anzeigen</Tooltip>);
  },
  searchTooltipProvider:  function(){  
    return (<Tooltip style={{zIndex: 3000000000}} id="searchTooltip">Objekte suchen</Tooltip>);
  }, 
  searchMinZoom: 7,
  searchMaxZoom: 18,
}