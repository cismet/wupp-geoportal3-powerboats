import { faRandom } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from 'components/commons/Icon';
import proj4 from 'proj4';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import { OverlayTrigger, Tooltip, Well } from 'react-bootstrap';
import { FeatureCollectionDisplayWithTooltipLabels } from 'react-cismap';
import { WMSTileLayer, ScaleControl } from 'react-leaflet';
import VectorGrid from 'react-leaflet-vectorgrid';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import AEVInfo from '../components/flaechennutzungsplan/AEVInfo';
import ShowAEVModeButton from '../components/fnp/ShowAEVModeButton';
import { proj4crs25832def } from '../constants/gis';
import TopicMap from '../containers/TopicMap';
import { actions as AEVActions, getAEVFeatures } from '../redux/modules/fnp_aenderungsverfahren';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { aevFeatureStyler, aevLabeler } from '../utils/fnpHelper';
import { removeQueryPart } from '../utils/routingHelper';
import { Control } from 'leaflet';
import CollapsibleABWell from 'components/commons/CollapsibleABWell';

let reduxBackground = undefined;

const options = {
	type: 'protobuf',
	url2: 'http://localhost:8080/data/xx/{z}/{x}/{y}.pbf',
	url: 'http://localhost:8080/data/v3/{z}/{x}/{y}.pbf',
	subdomains: ''

	// vectorTileLayerStyles: { ... }
};
const switchIcon = faRandom;
const searchMinZoom = 7;
function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		aev: state.fnpAenderungsverfahren,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		aevActions: bindActionCreators(AEVActions, dispatch)
	};
}

export class Container_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoHome = this.gotoHome.bind(this);
		this.aevGazeteerHit = this.aevGazeteerHit.bind(this);
		this.aevSearchButtonHit = this.aevSearchButtonHit.bind(this);
		this.featureClick = this.featureClick.bind(this);
		this.doubleMapClick = this.doubleMapClick.bind(this);
		this.selectNextIndex = this.selectNextIndex.bind(this);
		this.selectPreviousIndex = this.selectPreviousIndex.bind(this);
		this.getNeededUrlParams = this.getNeededUrlParams.bind(this);
		this.fitAll = this.fitAll.bind(this);
		this.setAevVisible = this.setAevVisible.bind(this);
		this.changeMarkerSymbolSize = this.changeMarkerSymbolSize.bind(this);
		this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
			this.props.aevActions.refreshFeatureCollection(bbox)
		);
		this.state = {
			smallState: undefined
		};
	}
	componentDidMount() {
		document.title = 'FNP-Auskunft Wuppertal';
	}
	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}

	changeMarkerSymbolSize(size) {
		this.props.aevActions.setAEVSvgSize(size);
		this.props.mappingActions.setFeatureCollectionKeyPostfix('MarkerSvgSize:' + size);
	}

	aevGazeteerHit(selectedObject) {
		console.log('aevGazeteerHit');

		this.props.aevActions.searchForAEVs({
			gazObject: selectedObject,
			mappingActions: this.props.mappingActions,
			done: (o) => {
				if (o && o.length > 0) {
					this.setAevVisible(true);
				}
				console.log('done', o);
			}
		});
		// if (selectedObject && selectedObject[0] && selectedObject[0].type) {
		// 	const t = selectedObject[0].type;
		// 	if (t === 'aenderungsv') {
		// 		this.setAevVisible(true);
		// 	}
		// }

		//this.props.bplanActions.searchForPlans(selectedObject);
	}

	aevSearchButtonHit(event) {
		this.props.aevActions.searchForAEVs({
			boundingBox: this.props.mapping.boundingBox,
			mappingActions: this.props.mappingActions
		});
		//this.props.bplanActions.searchForPlans();
	}

	setAevVisible(visible) {
		const { aevVisible } = this.getNeededUrlParams();
		if (visible === true && aevVisible === false) {
			this.props.routingActions.push(
				this.props.routing.location.pathname +
					(this.props.routing.location.search || '?') +
					'&aevVisible'
			);
		} else if (visible === false && aevVisible === true) {
			this.props.routingActions.push(
				this.props.routing.location.pathname +
					removeQueryPart(this.props.routing.location.search || '', 'aevVisible')
			);
		}
	}

	featureClick(event) {
		if (event.target.feature.selected) {
			this.props.mappingActions.fitSelectedFeatureBounds();
			if (event.target.feature.twin != null) {
				this.props.mappingActions.setSelectedFeatureIndex(event.target.feature.twin);
			}
		} else {
			this.props.mappingActions.setSelectedFeatureIndex(
				this.props.mapping.featureCollection.indexOf(event.target.feature)
			);
		}
	}
	doubleMapClick(event) {
		const pos = proj4(proj4.defs('EPSG:4326'), proj4crs25832def, [
			event.latlng.lng,
			event.latlng.lat
		]);
		this.props.aevActions.searchForAEVs({
			point: { x: pos[0], y: pos[1] },
			mappingActions: this.props.mappingActions,
			fitAll: false
		});
	}

	selectNextIndex() {
		let potIndex = this.props.mapping.selectedIndex + 1;
		if (potIndex >= this.props.mapping.featureCollection.length) {
			potIndex = 0;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
		//this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
	}

	selectPreviousIndex() {
		let potIndex = this.props.mapping.selectedIndex - 1;
		if (potIndex < 0) {
			potIndex = this.props.mapping.featureCollection.length - 1;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
		//this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
	}

	fitAll() {
		this.props.mappingActions.fitAll();
	}

	getNeededUrlParams() {
		const uSearch = new URLSearchParams(this.props.routing.location.search);
		let aevVisible = uSearch.get('aevVisible') !== null;
		let scaleVisible = uSearch.get('scaleVisible') !== null;
		let currentZoom = uSearch.get('zoom') || 8;

		return { aevVisible, scaleVisible, currentZoom };
	}

	render() {
		let backgroundStyling = queryString.parse(this.props.routing.location.search).mapStyle;

		const { aevVisible, scaleVisible, currentZoom } = this.getNeededUrlParams();

		let titleContent;
		let backgrounds = [];
		if (
			this.props.match.params.mode !== 'arbeitskarte' &&
			this.props.match.params.mode !== 'rechtsplan'
		) {
			this.props.routingActions.push('/fnp/rechtsplan' + this.props.routing.location.search);
		} else if (this.props.match.params.mode === 'arbeitskarte') {
			titleContent = (
				<div>
					<b>Arbeitskarte: </b> fortgeschriebene Hauptnutzungen (informeller FNP-Auszug)<div
						style={{ float: 'right', paddingRight: 10 }}
					>
						<a href={'/#/fnp/rechtsplan' + this.props.routing.location.search}>
							<FontAwesomeIcon icon={switchIcon} style={{ marginRight: 5 }} />zum
							Rechtsplan
						</a>
					</div>
				</div>
			);
			backgrounds = [
				<WMSTileLayer
					key={
						'background.hauptnutzungen.spw2:aevVisible:' +
						aevVisible +
						backgroundStyling
					}
					url='https://geodaten.metropoleruhr.de/spw2/service?'
					layers={'spw2_graublau'}
					version='1.1.1'
					transparent='true'
					format='image/png'
					tiled='false'
					styles='default'
					maxZoom={15}
					opacity={1}
					caching={true}
				/>,
				<WMSTileLayer
					key={'Hauptnutzungen.flaeche:aevVisible:' + aevVisible}
					url='https://maps.wuppertal.de/deegree/wms'
					layers={'r102:fnp_haupt_fl'}
					version='1.1.1'
					transparent='true'
					format='image/png'
					tiled='false'
					styles='default'
					maxZoom={19}
					opacity={0.4}
					caching={true}
				/>
			];
		} else {
			titleContent = (
				<div>
					<b>Rechtsplan: </b> Flächennutzungsplan (FNP){' '}
					{aevVisible === true ? 'mit Änderungsverfahren (ÄV)' : ''}
					<div style={{ float: 'right', paddingRight: 10 }}>
						<a href={'/#/fnp/arbeitskarte' + this.props.routing.location.search}>
							<FontAwesomeIcon icon={switchIcon} style={{ marginRight: 5 }} /> zur
							Arbeitskarte
						</a>
					</div>
				</div>
			);

			backgrounds = [
				<WMSTileLayer
					key={'background.rechtsplan.spw2:aevVisible:' + aevVisible + backgroundStyling}
					url='https://geodaten.metropoleruhr.de/spw2/service'
					layers={'spw2_light'}
					version='1.3.0'
					transparent='true'
					format='image/png'
					tiled='false'
					styles='default'
					maxZoom={19}
					opacity={0.4}
					caching={true}
				/>,
				<WMSTileLayer
					key={'rechtsplan:aevVisible:' + aevVisible}
					url='https://maps.wuppertal.de/deegree/wms?SRS=EPSG:25832'
					layers={'r102:fnp_clip'}
					version='1.1.1'
					transparent='true'
					format='image/png'
					tiled='true'
					styles='default'
					maxZoom={19}
					opacity={aevVisible === false ? 1.0 : currentZoom >= searchMinZoom ? 0.5 : 0.2}
					caching={true}
				/>
			];
		}

		let info;
		if (this.props.mapping.featureCollection.length > 0 && aevVisible === true) {
			info = (
				<AEVInfo
					pixelwidth={350}
					featureCollection={this.props.mapping.featureCollection}
					selectedIndex={this.props.mapping.selectedIndex || 0}
					next={this.selectNextIndex}
					previous={this.selectPreviousIndex}
					fitAll={this.fitAll}
					collapsed={this.props.aev.infoBoxState.minified}
					setCollapsed={(collapsed) => {
						this.props.aevActions.setCollapsedInfoBox(collapsed);
					}}
					// downloadPlan={this.openDocViewer}
					// downloadEverything={this.openDocViewer}
					// preparedDownload={this.props.bplaene.preparedDownload}
					// resetPreparedDownload={this.resetPreparedDownload}
					// loadingError={this.props.bplaene.documentsLoadingError}
				/>
			);
		} else {
			//TODO better way to follow the jsx-a11y/anchor-is-valid rule
			/* eslint-disable */
			let largeDiv = (
				<div>
					<table border={0} style={{ width: '100%' }}>
						<tbody>
							<tr>
								<td
									style={{
										textAlign: 'left',
										verticalAlign: 'top',
										padding: '5px',
										maxWidth: '160px',
										overflowWrap: 'break-word'
									}}
								>
									<h4>Flächennutzungsplan Wuppertal vom 17.01.2005</h4>
								</td>
								<td
									style={{
										textAlign: 'center',
										verticalAlign: 'center',
										padding: '5px',
										paddingTop: '1px'
									}}
								>
									<a
										href={`/#/docs/static/FNP.Legende.und.Dokumente`}
										target='_fnp'
										style={{ color: '#333' }}
									>
										<h4 style={{ marginLeft: 5, marginRight: 5 }}>
											{/* <OverlayTrigger placement='left' overlay={'legende '}> */}
											<font size='28'>
												<Icon
													style={{ textDecoration: 'none' }}
													name='file-pdf-o'
												/>
											</font>

											{/* </OverlayTrigger> */}
										</h4>
									</a>
								</td>
							</tr>
						</tbody>
					</table>
					{/* <h4>
						Flächennutzungsplan Wuppertal vom 17.01.2005
						<font size='30'>
							<Icon style={{ textDecoration: 'none' }} name='file-pdf-o' />
						</font>
					</h4> */}
					{/* <a onClick={() => this.props.uiStateActions.showApplicationMenu(true)}>
						Legende und Dokumente
					</a> */}
					<div style={{ height: '1px', background: 'black' }} />
					<h5>Laden der Infos zu Änderungsverfahren (ÄV)</h5>

					<p>
						für ein ÄV Doppelklick auf Geltungsbereich | <Icon name='search' /> für alle
						ÄV im Kartenausschnitt | ÄV-Nummer im Suchfeld eingeben und Auswahl{' '}
						<Icon name='file' overlay='F' marginRight='2px' />aus Vorschlagsliste |
						zurück mit Doppelklick außerhalb eines ÄV
					</p>

					<a onClick={() => this.props.uiStateActions.showApplicationMenu(true)}>
						Kompaktanleitung
					</a>
				</div>
			);
			let smallDiv = (
				<div>
					<table border={0} style={{ width: '100%' }}>
						<tbody>
							<tr>
								<td
									style={{
										textAlign: 'left',
										verticalAlign: 'top',
										padding: '5px',
										maxWidth: '160px',
										overflowWrap: 'break-word'
									}}
								>
									<h4>Flächennutzungsplan Wuppertal vom 17.01.2005</h4>
								</td>
								<td
									style={{
										textAlign: 'center',
										verticalAlign: 'center',
										padding: '5px',
										paddingTop: '1px'
									}}
								>
									<a
										href={`/#/docs/static/FNP.Legende.und.Dokumente`}
										target='_fnp'
										style={{ color: '#333' }}
									>
										<h4 style={{ marginLeft: 5, marginRight: 5 }}>
											{/* <OverlayTrigger placement='left' overlay={'legende '}> */}
											<Icon
												style={{ textDecoration: 'none', fontSize: 26 }}
												name='file-pdf-o'
											/>
											{/* </OverlayTrigger> */}
										</h4>
									</a>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			);

			// info = (
			// 	<Well bsSize='small' pixelwidth={500}>
			// 		<h5>Aktuell keine Änderungsverfahren (ÄV) geladen.</h5>
			// 		<ul>
			// 			<li>
			// 				<b>ein ÄV laden:</b> Doppelklick auf Plan in Hintergrundkarte
			// 			</li>
			// 			<li>
			// 				<b>alle ÄV im Kartenausschnitt laden:</b> <Icon name='search' />
			// 			</li>
			// 			<li>
			// 				<b>bekannten ÄV laden:</b> Nummer als Suchbegriff eingeben, Auswahl aus
			// 				Vorschlagsliste
			// 			</li>
			// 			<li>
			// 				<b>Suche nach ÄV:</b> BPlan (mit B-Präfix), Adresse oder POI als
			// 				Suchbegriff eingeben, Auswahl aus Vorschlagsliste
			// 			</li>
			// 		</ul>
			// 		<a onClick={() => this.props.uiStateActions.showApplicationMenu(true)}>
			// 			Kompaktanleitung
			// 		</a>
			// 	</Well>
			// );
			info = (
				<CollapsibleABWell
					pixelwidth={400}
					collapsed={this.props.aev.infoBoxState.minified}
					divWhenLarge={largeDiv}
					divWhenCollapsed={smallDiv}
					setCollapsed={(collapsed) => {
						this.props.aevActions.setCollapsedInfoBox(collapsed);
					}}
				/>
			);

			/* eslint-ensable */
		}

		let fontSizeForAEVSwitch =
			queryString.parse(this.props.routing.location.search).fontSizeForAEVSwitch || '1em';

		try {
			reduxBackground = this.props.mapping.backgrounds[this.props.mapping.selectedBackground]
				.layerkey;
		} catch (e) {}
		let selectedFeature;

		let title = null;
		let width = this.props.uiState.width;
		title = (
			<table
				style={{
					width: this.props.uiState.width - 54 - 12 - 38 - 12 + 'px',
					height: '30px',
					position: 'absolute',
					left: 54,
					top: 12,
					zIndex: 555
				}}
			>
				<tbody>
					<tr>
						<td
							style={{
								textAlign: 'center',
								verticalAlign: 'middle',
								background: '#ffffff',
								color: 'black',
								opacity: '0.9',
								paddingLeft: '10px'
							}}
						>
							{titleContent}
						</td>
					</tr>
				</tbody>
			</table>
		);

		return (
			<div>
				{title}
				<TopicMap
					minZoom={7}
					maxZoom={15}
					ref={(comp) => {
						this.topicMap = comp;
					}}
					initialLoadingText='Laden der Änderungen ...'
					fullScreenControl
					locatorControl
					gazetteerSearchBox
					searchMinZoom={searchMinZoom}
					searchMaxZoom={18}
					gazeteerHitTrigger={this.aevGazeteerHit}
					searchButtonTrigger={this.aevSearchButtonHit}
					searchAfterGazetteer={true}
					gazetteerTopicsList={[
						'aenderungsv',
						'bplaene',
						'pois',
						'kitas',
						'quartiere',
						'bezirke',
						'adressen'
					]}
					gazSearchMinLength={1}
					gazetteerSearchBoxPlaceholdertext='ÄV | BPL | Stadtteil | Adresse | POI'
					_gazeteerHitTrigger={(selectedObject) => {
						if (
							selectedObject &&
							selectedObject[0] &&
							selectedObject[0].more &&
							selectedObject[0].more.id
						) {
							this.props.aevActions.setSelectedAEV(selectedObject[0].more.id);
						}
					}}
					infoBox={info}
					secondaryInfoBoxElements={[
						<ShowAEVModeButton
							aevVisible={aevVisible}
							setAevVisible={this.setAevVisible}
							fontSize={fontSizeForAEVSwitch}
						/>
					]}
					backgroundlayers={
						'nothing' ||
						this.props.match.params.layers ||
						reduxBackground ||
						'wupp-plan-live'
					}
					dataLoader={this.props.aevActions.loadAEVs}
					getFeatureCollectionForData={() => {
						if (aevVisible === false) {
							return [];
						} else {
							return this.props.mapping.featureCollection;
						}
					}}
					featureCollectionKeyPostfix={this.props.mapping.featureCollectionKeyPostfix}
					featureStyler={aevFeatureStyler}
					featureStyler__={(feature) => {
						const style = {
							color: '#155317',
							weight: 3,
							opacity: 0.8,
							fillColor: '#ffffff',
							fillOpacity: 0.6
						};
						if (feature.properties.status === 'r') {
							style.color = '#155317';
							style.fillColor = '#155317';
							style.opacity = 0.0;
						} else {
							style.color = '#9F111B';
							style.fillColor = '#9F111B';
							style.opacity = 0.0;
						}
						return style;
					}}
					featureLabeler={aevLabeler}
					featureLabeler_={(feature) => {
						return (
							<h3
								style={{
									color: '#155317',
									opacity: 0.7,
									textShadow:
										'1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px #000000'
								}}
							>
								{feature.text}
							</h3>
						);
					}}
					featureClickHandler={this.featureClick}
					ondblclick={this.doubleMapClick}
					_refreshFeatureCollection={this.props.aevActions.refreshFeatureCollection}
					setSelectedFeatureIndex={this.props.aevActions.setSelectedFeatureIndex}
					applicationMenuTooltipString='Einstellungen | Kompaktanleitung'
					modalMenu_={
						<div />
						// <PRBRModalMenu
						// 	uiState={this.props.uiState}
						// 	uiStateActions={this.props.uiStateActions}
						// 	urlPathname={this.props.routing.location.pathname}
						// 	urlSearch={this.props.routing.location.search}
						// 	pushNewRoute={this.props.routingActions.push}
						// 	currentMarkerSize={getPRBRSvgSize(this.props.aev)}
						// 	changeMarkerSymbolSize={this.changeMarkerSymbolSize}
						// 	topicMapRef={this.topicMap}
						// 	setLayerByKey={this.props.mappingActions.setSelectedMappingBackground}
						// 	activeLayerKey={this.props.mapping.selectedBackground}
						// 	setFeatureCollectionKeyPostfix={
						// 		this.props.mappingActions.setFeatureCollectionKeyPostfix
						// 	}
						// 	refreshFeatureCollection={
						// 		this.props.aevActions.refreshFeatureCollection
						// 	}
						// 	filter={getPRBRFilter(this.props.aev)}
						// 	setFilter={this.props.aevActions.setFilter}
						// 	filteredObjects={getPRBRFilteredData(this.props.aev)}
						// 	featureCollectionObjectsCount={
						// 		getPRBRFeatureCollection(this.props.aev).length
						// 	}
						// 	envZoneVisible={isEnvZoneVisible(this.props.aev)}
						// 	setEnvZoneVisible={this.props.aevActions.setEnvZoneVisible}
						// />
					}
					responsiveTrigger={(smallState) => {
						if (this.state.smallState !== smallState) {
							this.setState({ smallState: smallState });
						}
					}}
				>
					{aevVisible === true && (
						<FeatureCollectionDisplayWithTooltipLabels
							key={'allAEVs'}
							featureCollection={getAEVFeatures(this.props.aev)}
							boundingBox={{
								left: 353122.1056720067,
								top: 5696995.497378283,
								right: 392372.51969633374,
								bottom: 5655795.93913269
							}}
							style={(feature) => {
								const style = {
									color: '#155317',
									weight: 3,
									opacity: 0.8,
									fillColor: '#ffffff',
									fillOpacity: 0.6
								};
								if (currentZoom >= searchMinZoom) {
									if (feature.properties.status === 'r') {
										style.color = '#155317';
									} else {
										style.color = '#9F111B';
									}
								} else {
									if (feature.properties.status === 'r') {
										style.color = '#155317';
										style.fillColor = '#155317';
										style.opacity = 0.0;
									} else {
										style.color = '#9F111B';
										style.fillColor = '#9F111B';
										style.opacity = 0.0;
									}
								}

								return style;
							}}
							style_hn={(feature) => {
								const style = {
									color: '#155317',
									weight: 1,
									opacity: 0.8,
									fillColor: '#ffffff',
									fillOpacity: 0.6
								};

								const key = feature.properties.key;
								const os = parseInt(key);

								let c;
								if (os === 100) {
									c = '#CC1800';
								} else if (os === 200 || os === 220) {
									c = '#7D6666';
								} else if (os === 230) {
									c = '#4C1900';
								} else if (os === 240) {
									c = '#964646';
								} else if (os === 300) {
									c = '#9999A6';
								} else if (os >= 410 && os <= 442) {
									c = '#FF7F00';
								} else if (os >= 1100 && os <= 1900) {
									c = '#AB66AB';
								} else if (os >= 2111 && os <= 2130) {
									c = '#FFCC66';
								} else if (os >= 2141 && os <= 2146) {
									c = '#8C9445';
								} else if (os === 2210 || os === 2220) {
									c = '#7C7CA6';
								} else if (os >= 3110 && os <= 3223) {
									c = '#F2F017';
								} else if (os >= 3300 && os <= 3390) {
									c = '#8CCC33';
								} else if (os === 4010 || os === 4101) {
									c = '#B2FFFF';
								} else if (os === 5000) {
									c = '#D9FF99';
								} else if (os === 5100) {
									c = '#05773C';
								} else {
									c = '#000';
								}
								style.color = c;
								style.fillColor = c;

								return style;
							}}
							_labeler={(feature) => {
								return (
									<h3
										style={{
											color: '#155317',
											opacity: 0.7,
											textShadow:
												'1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px #000000'
										}}
									>
										Umweltzone
									</h3>
								);
							}}
							featureClickHandler={() => {}}
						/>
					)}

					{scaleVisible && (
						<ScaleControl
							key={'scalecontrol' + width}
							position={this.state.smallState === true ? 'topleft' : 'bottomleft'}
							imperial={false}
							padding={100}
						/>
					)}

					{/* <VectorGrid {...options} /> */}
					{backgrounds}
				</TopicMap>
			</div>
		);
	}
}

const Container = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Container_);

export default Container;

Container.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
