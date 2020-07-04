import { MapLayer } from 'react-leaflet';
import L from 'leaflet';
import chroma from 'chroma-js';
import 'leaflet-canvaslayer-field/dist/leaflet.canvaslayer.field';
import * as d3 from 'd3';
import bboxPolygon from '@turf/bbox-polygon';

async function produceVectorfield(uGrid, vGrid, scaleFactor) {
	return L.VectorField.fromASCIIGrids(uGrid, vGrid, scaleFactor);
}

const getBBoxForBounds = (bounds) => {
	return [
		bounds._southWest.lng,
		bounds._northEast.lat,
		bounds._northEast.lng,
		bounds._southWest.lat
	];
};
// const service="http://127.0.0.1:8881";
const service = 'https://rasterfari.cismet.de';

class VectorFieldAnimation extends MapLayer {
	constructor(props, context) {
		super(props, context);
		window.d3 = d3;
		this.context = context;
	}

	createLeafletElement() {
		return null;
	}

	loadAndVis(didMount = false) {}

	componentDidMount() {
		// const bounds = this.context.map.getBounds();
		// const bbox = getBBoxForBounds(bounds);

		const bbox = this.props.bbox;
		//BBOX=7.1954778,51.2743996,7.2046701,51.2703213
		let url_u = `${service}/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&LAYERS=docs/regen/u84.tif&FORMAT=text/raster.asc`;
		let url_v = `${service}/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&LAYERS=docs/regen/v84.tif&FORMAT=text/raster.asc`;

		var urls = [ url_u, url_v ];
		console.log('VFA: ', urls);

		var promises = urls.map((url) => fetch(url).then((r) => r.text()));
		let that = this;
		Promise.all(promises).then(function(arrays) {
			console.log('VFA: urls fetched');

			let scaleFactor = 0.001; // to m/s
			let vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], scaleFactor);
			var range = vf.range;
			var scale = chroma.scale('OrRd').domain(range);

			let layer = L.canvasLayer.vectorFieldAnim(vf, that.props.settings);

			that.leafletElement = layer;
			that.superComponentDidMount();
			console.log('xxx done');
		});
	}

	componentWillUnmount() {
		if (this.leafletElement) {
			if (this.leafletElement.timer) {
				this.leafletElement.timer.stop();
			}
		}
		super.componentWillUnmount();
	}

	superComponentDidMount() {
		super.componentDidMount();
	}

	componentDidUpdate(prevProps, newProps) {
		if (this.leafletElement) {
			if (this.leafletElement.timer) {
				this.leafletElement.timer.stop();
			}
			//this.context.map.removeLayer(this.leafletElement);
			//this.componentDidMount();

			const bounds = this.context.map.getBounds();
			const bbox = getBBoxForBounds(bounds);

			//BBOX=7.1954778,51.2743996,7.2046701,51.2703213
			let url_u = `${service}/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&LAYERS=docs/regen/u84.tif&FORMAT=text/raster.asc`;
			let url_v = `${service}/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&LAYERS=docs/regen/v84.tif&FORMAT=text/raster.asc`;

			var urls = [ url_u, url_v ];
			if (this.leafletElement.url_u === url_u && this.leafletElement.url_v === url_v) {
				console.log('VFA: same shit: do nothing');
			} else {
				console.log('VFA: different urls: fetch again');

				var promises = urls.map((url) => fetch(url).then((r) => r.text()));
				let that = this;
				that.leafletElement.url_u = url_u;
				that.leafletElement.url_v = url_v;
				setTimeout(() => {
					console.log('VFA: debug waiting period over');

					Promise.all(promises).then(function(arrays) {
						let scaleFactor = 0.001; // to m/s
						console.log('VFA: before vectorfield creation');
						Promise.resolve(
							produceVectorfield(arrays[0], arrays[1], scaleFactor)
						).then((vf) => {
							// let vf = L.VectorField.fromASCIIGrids(
							// 	arrays[0],
							// 	arrays[1],
							// 	scaleFactor
							// );
							console.log('VFA: after vectorfield creation', vf);
							var range = vf.range;
							var scale = chroma.scale('OrRd').domain(range);

							console.log('VFA: before vectorfield update');
							that.leafletElement._field = vf;
							//that.leafletElement = layer;
							console.log('VFA: vectorfield updated');
						});
					});
				}, 1);
			}
		}
	}
}

export default VectorFieldAnimation;
