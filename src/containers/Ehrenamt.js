import React from 'react';
import PropTypes from 'prop-types';
import Cismap from '../containers/Cismap';

import { connect } from "react-redux";
import Control from 'react-leaflet-control';
import { Well, Tooltip} from 'react-bootstrap';


import { actions as mappingActions } from '../redux/modules/mapping';
import { actions as uiStateActions } from '../redux/modules/uiState';
import { actions as ehrenamtActions } from '../redux/modules/ehrenamt';

import { bindActionCreators } from 'redux';
import EhrenamtModalApplicationMenu from '../components/EhrenamtModalApplicationMenu';
import EhrenamtInfo  from '../components/EhrenamtInfo'

import { featureStyler, featureHoverer, ehrenAmtClusterIconCreator } from '../utils/ehrenamtHelper';
import {Icon} from 'react-fa'

import Loadable from 'react-loading-overlay';

function mapStateToProps(state) {
  return {
    ui: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    ehrenamt: state.ehrenamt
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    ehrenamtActions: bindActionCreators(ehrenamtActions, dispatch),

  };
}

export class Ehrenamt_ extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.gazeteerhHit=this.gazeteerhHit.bind(this);
      this.searchButtonHit=this.searchButtonHit.bind(this);
      this.featureClick=this.featureClick.bind(this);
      this.gotoHome=this.gotoHome.bind(this);
      this.doubleMapClick=this.doubleMapClick.bind(this);
      this.searchTooltip=this.searchTooltip.bind(this);
      this.selectNextIndex=this.selectNextIndex.bind(this);
      this.selectPreviousIndex=this.selectPreviousIndex.bind(this);
      this.createfeatureCollectionByBoundingBox=this.createfeatureCollectionByBoundingBox.bind(this);
      this.filterChanged=this.filterChanged.bind(this);
      this.props.mappingActions.setBoundingBoxChangedTrigger(this.createfeatureCollectionByBoundingBox);
    }
    componentWillMount() {
        this.dataLoaded=false;
        this.loadtheShit().then((data) => {
            this.dataLoaded=true;
        });
      }
   


    loadtheShit() {
        var promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('This happens 5th (after 3 seconds).');
                this.props.ehrenamtActions.loadOffers();
                resolve('This is my data.');
            }, 200);
        });
        console.log('This happens 3rd.');
        return promise;
    }
    createfeatureCollectionByBoundingBox(bbox) {
      this.props.ehrenamtActions.createFeatureCollectionFromOffers(bbox)
    }

    gazeteerhHit(selectedObject) {

    }

    searchButtonHit(event) {

    }

    featureClick(event){
      if (event.target.feature) {
        this.props.mappingActions.setSelectedFeatureIndex(event.target.feature.index);
      }
    }

    doubleMapClick(event) {

    }

    gotoHome() {
      //x1=361332.75015625&y1=5669333.966678483&x2=382500.79703125&y2=5687261.576954328

      this.cismapRef.wrappedInstance.gotoHomeBB()
    }

    selectNextIndex() {
      let potIndex=this.props.mapping.selectedIndex+1;
      if (potIndex>=this.props.mapping.featureCollection.length){
        potIndex=0;
      }
      this.props.mappingActions.setSelectedFeatureIndex(potIndex);
      //this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
    }

    selectPreviousIndex() {
      let potIndex=this.props.mapping.selectedIndex-1;
      if (potIndex<0){
        potIndex=this.props.mapping.featureCollection.length-1;
      }
      this.props.mappingActions.setSelectedFeatureIndex(potIndex);

    }
    filterChanged(filtergroup,filter) {
      this.props.ehrenamtActions.toggleFilter(filtergroup,filter);
    }
    searchTooltip(){
        return (<Tooltip style={{zIndex: 3000000000}} id="searchTooltip">Ehrenamtsinfos im Kartenausschnitt laden</Tooltip>);
    };
    render() {
      let info= null;
        let numberOfOffers=this.props.ehrenamt.filteredOffers.length;
        if (this.props.mapping.featureCollection.length>0) {
           info = (
             <EhrenamtInfo 
                 pixelwidth={250}
                 featureCollection={this.props.mapping.featureCollection}
                 filteredOffers={this.props.ehrenamt.filteredOffers}
                 selectedIndex={this.props.mapping.selectedIndex||0}
                 next={this.selectNextIndex}
                 previous={this.selectPreviousIndex}
                 fitAll={this.gotoHome}
                 downloadPlan={this.downloadPlan}
                 downloadEverything={this.downloadEverything}
                 />
             )
        }
        else {
          let offerLink;
          if (numberOfOffers>0) {
              offerLink=(<p><a onClick={this.gotoHome} >{numberOfOffers} Angebote in Wuppertal</a></p>);
          }
          else {
              offerLink=(<div/>)
          }
          info = (<Well bsSize="small" pixelwidth={250}>
                     <h5>Aktuell werden keine Angebote angezeigt.</h5>
                     <p>Um Angebote an einem bestimmten Ort anzuzeigen, den Anfang (mindestens 2 Zeichen)
                     eines Suchbegriffs eingeben und Eintrag aus Vorschlagsliste auswählen.</p>
                    <p>Um nach Zielgruppen, Interessen oder Bereichen zu filtern, das 
                     <a onClick={()=>this.props.uiStateActions.showApplicationMenu(true)}> Applikationsmenü öffnen.</a></p>
                     {offerLink}
                  </Well>)
        }

        // Auflistung der ids die momentan nicht dargestllt werden
        // let offerIds=[];
        // let fcIds=[];
        // for (let f of this.props.mapping.featureCollection) {
        //     fcIds.push(f.id);
        // }
        // for (let o of this.props.ehrenamt.offers) {
        //     offerIds.push(o.id);
        // }
        // offerIds.sort();
        // fcIds.sort();
        // let difference = offerIds.filter(x => !fcIds.includes(x));
        // console.log(difference);
      return (
           <div>
               <EhrenamtModalApplicationMenu key={'EhrenamtModalApplicationMenu.visible:'+this.props.ui.applicationMenuVisible}
                zielgruppen={this.props.ehrenamt.zielgruppen}
                kenntnisse={this.props.ehrenamt.kenntnisse}
                globalbereiche={this.props.ehrenamt.globalbereiche}
                filter={this.props.ehrenamt.filter}
                filterChanged={this.filterChanged}
                filteredOffersCount={this.props.ehrenamt.filteredOffers.length}
                featureCollectionCount={this.props.mapping.featureCollection.length}
                offersMD5={this.props.ehrenamt.offersMD5}
                
               />
               <Loadable
      active={!this.dataLoaded}
      spinner
      text='Laden der Angebote ...'
    >
               <Cismap ref={cismap => {this.cismapRef = cismap;}}
                       layers={this.props.match.params.layers ||'abkg@40,nrwDOP20@20'}
                       gazeteerHitTrigger={this.gazeteerhHit}
                       searchButtonTrigger={this.searchButtonHit}
                       featureStyler={featureStyler}
                       hoverer={featureHoverer}
                       featureClickHandler={this.featureClick}
                       ondblclick={this.doubleMapClick}
                       searchTooltipProvider={this.searchTooltip}
                       searchMinZoom={12}
                       searchMaxZoom={18}
                       gazTopics={["pois","adressen", "bezirke", "quartiere"]}
                       clustered={true}
                       clusterOptions={{
                            spiderfyOnMaxZoom: false,
                            showCoverageOnHover: false,
                            zoomToBoundsOnClick: false,
                            maxClusterRadius:40,
                            disableClusteringAtZoom:19,
                            animate:false,
                            cismapZoomTillSpiderfy:12,
                            selectionSpiderfyMinZoom:12,
                            iconCreateFunction: ehrenAmtClusterIconCreator,
                        }}
                        infoBox={info}

                    />
               </Loadable>

           </div>
       );
    }
}




const Ehrenamt = connect(mapStateToProps,mapDispatchToProps)(Ehrenamt_);

export default Ehrenamt;

Ehrenamt.propTypes = {
  ui: PropTypes.object,
  uiState: PropTypes.object,
};
