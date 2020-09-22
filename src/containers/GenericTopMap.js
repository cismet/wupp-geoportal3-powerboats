import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import BaederInfo from '../components/baeder/BaederInfo';
import BaederModalMenu from '../components/baeder/BaederModalMenu';
import InfoBoxFotoPreview from '../components/commons/InfoBoxFotoPreview';
import TopicMap from '../containers/TopicMap';
import { getActionLinksForFeature } from 'utils/uiHelper';
import { proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';
import {
	actions as BaederActions,
	getBadSvgSize,
	getBaeder,
	getBaederFeatureCollection,
	getBaederFeatureCollectionSelectedIndex,
	hasMinifiedInfoBox
} from '../redux/modules/baeder';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { fotoKraemerCaptionFactory, fotoKraemerUrlManipulation } from '../utils/commonHelpers';
import { featureHoverer, getFeatureStyler } from '../utils/stadtplanHelper';
import Icon from 'components/commons/Icon';
import { Well } from 'react-bootstrap';
import GenericModalApplicationMenu from '../components/commons/GenericModalApplicationMenu';
import DemoMenuHelpSection from '../components/demo/DemoMenuHelpSection';
import DemoMenuIntroduction from '../components/demo/DemoMenuIntroduction';
import DemoMenuSettingsSection from '../components/demo/DemoMenuSettingsSection';
import InfoBox from '../components/commons/InfoBox';
import { config } from 'components/generic/Config';
import SecondaryInfoModal from 'components/generic/SecondaryInfo';
function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch)
	};
}
const getColorForProperties = (props = { color: '#dddddd' }) => props.color;

export class GenericTopicMap_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.zoomToFeature = this.zoomToFeature.bind(this);
		this.state = {
			secondaryInfoVisible: false
		};
		// this.gotoHome = this.gotoHome.bind(this);
		// this.changeMarkerSymbolSize = this.changeMarkerSymbolSize.bind(this);
		// this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
		// 	this.props.baederActions.refreshFeatureCollection(bbox)
		// );
	}
	componentDidMount() {
		const fc = [];
		for (const f of config.features) {
			const ef = { ...config.featureDefaultConfig, ...f };
			fc.push(ef);
		}
		this.props.mappingActions.setFeatureCollection(fc);
		// this.props.mappingActions.fitFeatureCollection(fc);
	}

	componentDidUpdate() {
		console.log('this.props.routing', this.props.match.params.name);
		if (this.props.match.params.name !== undefined) {
			document.title = this.props.match.params.name.replace(/_/g, ' ');
		} else {
			document.title = 'Meine Karte';
		}
		console.log('this.props.mapping.selectedIndex', this.props.mapping.selectedIndex);
		// if (this.props.mapping.selectedIndex === null) {
		// 	this.props.mappingActions.setSelectedFeatureIndex(0);
		// }
	}
	zoomToFeature(feature) {
		if (this.topicMap !== undefined) {
			const pos = proj4(proj4crs25832def, proj4.defs('EPSG:4326'), [
				feature.geometry.coordinates[0],
				feature.geometry.coordinates[1]
			]);
			this.topicMap.wrappedInstance.leafletRoutedMap.leafletMap.leafletElement.setView(
				[ pos[1], pos[0] ],
				14
			);
		}
	}

	render() {
		const featureCollection = this.props.mapping.featureCollection;

		if (featureCollection === undefined) {
			return <div />;
		}

		const selectedIndex = this.props.mapping.selectedIndex;
		const currentFeature = this.props.mapping.featureCollection[selectedIndex];
		if (currentFeature === undefined) {
			return <div />;
		}
		const links = getActionLinksForFeature(currentFeature, {
			displayZoomToFeature: true,
			zoomToFeature: this.zoomToFeature,
			displaySecondaryInfoAction: true,
			setVisibleStateOfSecondaryInfo: (vis) => this.setState({ secondaryInfoVisible: vis })
		});
		const header = <span>{currentFeature.properties.info.header || config.info.header}</span>;
		const headerColor = getColorForProperties((currentFeature || {}).properties);
		const items = featureCollection;
		const minified = undefined;
		const minify = undefined;
		const fitAll = () => {};
		const info = (
			<InfoBox
				isCollapsible={currentFeature !== undefined}
				featureCollection={featureCollection}
				items={featureCollection}
				selectedIndex={selectedIndex}
				next={() => {}}
				previous={() => {}}
				fitAll={() => {}}
				showModalMenu={() => {}}
				uiState={this.props.uiState}
				uiStateActions={this.props.uiStateActions}
				panelClick={() => {}}
				colorize={getColorForProperties}
				pixelwidth={config.info.pixelwidth}
				header={header}
				headerColor={headerColor}
				links={links}
				title={currentFeature.properties.info.title}
				subtitle={currentFeature.properties.info.subtitle}
				additionalInfo={currentFeature.properties.info.additionalInfo}
				zoomToAllLabel={`${items.length} ${items.length === 1
					? config.info.navigator.noun.singular
					: config.info.navigator.noun.plural} in ${config.city}`}
				currentlyShownCountLabel={`${featureCollection.length} ${featureCollection.length ===
				1
					? config.info.navigator.noun.singular
					: config.info.navigator.noun.plural} angezeigt`}
				collapsedInfoBox={minified}
				setCollapsedInfoBox={minify}
				noCurrentFeatureTitle={<h5>{config.info.noFeatureTitle}</h5>}
				noCurrentFeatureContent={
					<div style={{ marginRight: 9 }}>
						<p>
							Für mehr Bäder Ansicht mit <Icon name='minus-square' /> verkleinern oder
							mit dem untenstehenden Link auf das komplette Stadtgebiet zoomen.
						</p>
						<div align='center'>
							<a onClick={fitAll}>{items.length} Bäder in Wuppertal</a>
						</div>
					</div>
				}
				hideNavigator={true}
			/>
		);

		return (
			<div>
				{this.state.secondaryInfoVisible === true &&
				currentFeature !== undefined && (
					<SecondaryInfoModal
						visible={this.state.secondaryInfoVisible}
						feature={currentFeature}
						setVisibleState={(vis) => this.setState({ secondaryInfoVisible: vis })}
						uiHeight={this.props.uiState.height}
					/>
				)}
				<TopicMap
					ref={(comp) => {
						this.topicMap = comp;
					}}
					{...config.tmConfig}
					infoBox={info}
					getFeatureCollectionForData={() => featureCollection}
					setSelectedFeatureIndex={this.props.mappingActions.setSelectedFeatureIndex}
					featureStyler={getFeatureStyler(50, getColorForProperties)}
					secondaryInfoBoxElements={[
						<InfoBoxFotoPreview
							currentFeature={currentFeature}
							getPhotoUrl={(feature) => {
								console.log('feature', feature);

								if (
									(feature || { properties: {} }).properties.fotos !== undefined
								) {
									return feature.properties.foto;
								} else if (
									(feature || { properties: {} }).properties.foto !== undefined
								) {
									return feature.properties.foto;
								} else {
									return undefined;
								}
							}}
							getPhotoSeriesUrl={(feature) => {
								console.log('feature', feature);

								if (
									(feature || { properties: {} }).properties.fotos !== undefined
								) {
									return feature.properties.foto;
								} else {
									return undefined;
								}
							}}
							uiStateActions={this.props.uiStateActions}
						/>
					]}
					modalMenu={
						<GenericModalApplicationMenu
							uiState={this.props.uiState}
							uiStateActions={this.props.uiStateActions}
							menuIntroduction={
								<DemoMenuIntroduction uiStateActions={this.props.uiStateActions} />
							}
							menuSections={[
								<DemoMenuSettingsSection
									key='DemoMenuSettingsSection'
									uiState={this.props.uiState}
									uiStateActions={this.props.uiStateActions}
								/>,
								<DemoMenuHelpSection
									key='DemoMenuHelpSection'
									uiState={this.props.uiState}
									uiStateActions={this.props.uiStateActions}
								/>
							]}
						/>
					}
					featureCollection={config.features}
				/>
			</div>
		);
	}
}

const GenericTopicMap = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(
	GenericTopicMap_
);

export default GenericTopicMap;

GenericTopicMap.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};