import React from 'react';
import ColorHash from 'color-hash';
import Color from 'color';
import L from 'leaflet';
import createSVGPie from 'create-svg-pie';
import createElement from 'svg-create-element';
import { poiColors } from '../constants/colors.js';
import store from '../redux/store';
import queryString from 'query-string';
import { Icon } from 'react-fa';
import SVGInline from 'react-svg-inline';

const fallbackSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="311.668" height="311.668">
        <path class="bg-fill" fill="#C32D6A"  d="M0-.661h313.631v313.63H0z"/>
        <path class="fg-fill" fill="#FFF"  d="M292.827 156.794c0 18.76-3.584 36.451-10.733 53.095-7.187 16.681-16.929 31.17-29.302 43.523-12.354 12.392-26.88 22.152-43.523 29.302s-34.335 10.733-53.094 10.733c-18.74 0-36.432-3.584-53.104-10.733-16.653-7.149-31.17-16.91-43.533-29.302-12.354-12.354-22.125-26.843-29.273-43.523-7.159-16.644-10.743-34.335-10.743-53.095 0-18.74 3.584-36.432 10.743-53.084 7.149-16.653 16.919-31.17 29.273-43.533 12.363-12.354 26.88-22.144 43.533-29.293 16.671-7.148 34.363-10.742 53.104-10.742 18.759 0 36.45 3.594 53.094 10.742 16.644 7.149 31.17 16.939 43.523 29.293 12.373 12.363 22.115 26.88 29.302 43.533 7.149 16.652 10.733 34.344 10.733 53.084zm-24.612 0c0-15.347-2.936-29.854-8.77-43.523-5.853-13.66-13.859-25.575-24.021-35.746-10.143-10.132-22.058-18.14-35.727-23.983-13.649-5.881-28.177-8.808-43.523-8.808-15.356 0-29.855 2.926-43.543 8.808-13.66 5.843-25.556 13.851-35.708 23.983-10.152 10.171-18.159 22.086-24.021 35.746-5.853 13.669-8.789 28.177-8.789 43.523 0 15.385 2.936 29.874 8.789 43.524 5.862 13.669 13.869 25.584 24.021 35.745 10.152 10.142 22.048 18.149 35.708 24.002 13.688 5.872 28.187 8.788 43.543 8.788 15.347 0 29.874-2.916 43.523-8.788 13.669-5.853 25.584-13.86 35.727-24.002 10.161-10.161 18.168-22.076 24.021-35.745 5.834-13.65 8.77-28.139 8.77-43.524zm-32.79 0c0 10.943-2.078 21.237-6.234 30.865-4.155 9.608-9.855 17.997-17.005 25.184-7.149 7.149-15.537 12.812-25.146 16.968-9.628 4.156-19.923 6.253-30.865 6.253-10.943 0-21.219-2.097-30.846-6.253s-18.035-9.818-25.184-16.968c-7.158-7.187-12.811-15.575-16.977-25.184-4.166-9.628-6.244-19.922-6.244-30.865 0-10.924 2.078-21.18 6.244-30.846 4.166-9.627 9.818-18.016 16.977-25.165 7.149-7.178 15.557-12.83 25.184-16.996s19.903-6.263 30.846-6.263c10.942 0 21.237 2.097 30.865 6.263 9.608 4.166 17.996 9.818 25.146 16.996 7.149 7.149 12.85 15.538 17.005 25.165 4.156 9.666 6.234 19.922 6.234 30.846z"/>
    </svg>
`;
const prSVG = `<svg  clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" viewBox="0 0 451.56 450.43" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
<defs>
 <style type="text/css">
  <![CDATA[
   .str0 {stroke:black;stroke-width:1.88356}
   .fil2 {fill:#009933}
   .fil0 {fill:white}
   .fil3 {fill:black}
   .fil1 {fill:white}
   .fil4 {fill:black;fill-rule:nonzero}
  ]]>
 </style>
</defs>

 
 <rect class="fil0" x="4.8361e-5" y="1.6882e-5" width="451.56" height="450.43"/>
 <path class="fil1 str0" d="m28.873 4.731h395.53c10.186 0.7446 21.728 11.153 22.287 23.416v394.4c0.046626 9.7171-11.106 22.782-23.698 23.416h-394.96c-12.97 0.59404-23.008-14.482-23.416-23.698l0.56414-393.83c-0.16835-8.5141 10.986-24.283 23.698-23.698z"/>
 <path class="fil2" d="m370.59 15.04v0.029542h-290.96v0.029186h-46.674c-11.075-0.48477-17.397 7.0811-16.98 19.188v382.72c0.043779 8.1621 3.5108 17.959 14.773 18.158h48.322 2.1484l289.37-0.058728v0.029542h50.441c11.262-0.19861 14.759-9.9954 14.803-18.158v-382.75c0.41608-12.106-5.9052-19.672-16.98-19.188h-48.263zm0 62.624v294.67l-289.37 0.20608v-294.82l289.37-0.058728z"/>
 <path class="fil3" d="m101.42 160.58h248.54c0-13.019-8.1646-24.556-20.795-27.168h-206.95c-13.124 2.4424-20.796 14.181-20.796 27.168z"/>
 <polygon class="fil3" points="200.07 217.06 215.83 217.06 215.83 201.74 231.66 201.82 231.68 217.06 247.42 217.06 247.42 233.55 231.68 233.55 231.64 248.74 215.81 248.66 215.83 233.55 200.07 233.55"/>
 <path class="fil3" d="m101.35 290.04h248.54c0 13.019-8.1642 24.556-20.795 27.168h-206.95c-13.124-2.4424-20.795-14.181-20.795-27.168z"/>
 <path class="fil3" d="m266.38 167.74v114.98l17.451 0.029542v-49.44h21.924l24.132 49.381h20.423l-25.632-50.499c27.964-10.949 31.492-54.417-6.5038-64.331l-51.795-0.11781zm17.451 16.01h30.724c21.16 6.3864 17.767 26.796 0.94178 34.049h-31.665v-34.049z"/>
 <path class="fil4" d="m104.83 282.67v-114.76h43.071c8.7636 0 15.791 1.1756 21.081 3.4735 5.3172 2.3246 9.4584 5.9048 12.451 10.741 2.9926 4.8093 4.5156 9.8591 4.5156 15.15 0 4.8894-1.3361 9.5118-4.0081 13.84-2.6449 4.3284-6.6796 7.8286-12.05 10.5 6.947 2.0306 12.264 5.504 16.004 10.394 3.7408 4.916 5.6112 10.714 5.6112 17.394 0 5.3702-1.1489 10.367-3.4201 14.989s-5.0766 8.176-8.4166 10.687c-3.3396 2.5118-7.5346 4.3822-12.558 5.6646-5.0232 1.2824-11.195 1.9238-18.516 1.9238h-43.766zm15.203-67.598h24.822c6.7063 0 11.187-0.45736 14.126-1.3358 3.8458-1.15 6.7601-2.6901 8.7106-5.362s2.9389-5.3001 2.9389-9.3078c0-3.7942-0.90512-6.4515-2.7253-9.3345-1.8394-2.914-4.4612-4.8936-7.8286-5.9582-3.3916-1.072-8.8632-1.6031-17.118-1.6031h-22.925v32.901zm0 53.339h28.563c4.916 0 8.3657-0.5346 10.34-0.89017 3.5009-0.63106 6.4084-1.3386 8.764-2.7969 2.3438-1.4508 3.9365-3.2168 5.4421-6.0034 1.5106-2.7951 1.9149-5.6556 1.9149-9.316 0-4.275-1.0902-7.2826-3.2863-10.457-2.184-3.156-5.235-5.0235-9.1377-6.297-3.8707-1.2632-8.7753-1.8971-16.068-1.8971h-26.532v37.657z"/>

</svg>
`;

export const getFeatureStyler = (svgSize = 24, colorizer = getColorForProperties) => {
	return (feature) => {
		var color = Color(colorizer(feature.properties));
		let radius = svgSize / 2; //needed for the Tooltip Positioning
		let canvasSize = svgSize;
		if (feature.selected) {
			canvasSize = svgSize + 12;
		}

		let selectionBox = canvasSize - 6;
		let badge = feature.properties.svgBadge || fallbackSVG; //|| `<image x="${(svgSize - 20) / 2}" y="${(svgSize - 20) / 2}" width="20" height="20" xlink:href="/pois/signaturen/`+getSignatur(feature.properties)+`" />`;

		let svg = `<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}"> 
                    <style>
                    /* <![CDATA[ */
                        #badgefor_${feature.id} .bg-fill  {
                            fill: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .bg-stroke  {
                            stroke: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .fg-fill  {
                            fill: white;
                        }
                        #badgefor_${feature.id} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <svg x="${svgSize / 12}" y="${svgSize / 12}"  width="${svgSize -
			2 * svgSize / 12}" height="${svgSize - 2 * svgSize / 12}" viewBox="0 0 ${feature
			.properties.svgBadgeDimension.width} ${feature.properties.svgBadgeDimension
			.height}">       
                    ${badge}
                </svg>
                </svg>  `;

		if (feature.selected) {
			let selectionOffset = (canvasSize - selectionBox) / 2;

			let badgeDimension = svgSize - 2 * svgSize / 12;
			let innerBadgeOffset = (selectionBox - badgeDimension) / 2;

			svg =
				`<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}">
                    <style>
                    /* <![CDATA[ */
                        #badgefor_${feature.id} .bg-fill  {
                            fill: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .bg-stroke  {
                            stroke: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .fg-fill  {
                            fill: white;
                        }
                        #badgefor_${feature.id} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <rect x="${selectionOffset}" y="${selectionOffset}" rx="8" ry="8" width="${selectionBox}" height="${selectionBox}" fill="rgba(67, 149, 254, 0.8)" stroke-width="0"/>
                <svg x="${selectionOffset + innerBadgeOffset}" y="${selectionOffset +
					innerBadgeOffset}" width="${badgeDimension}" height="${badgeDimension}" viewBox="0 0 ` +
				feature.properties.svgBadgeDimension.width +
				` ` +
				feature.properties.svgBadgeDimension.height +
				`">
                ${badge}

                </svg>
                </svg>`;
		}

		const style = {
			radius,
			fillColor: color,
			color: color.darken(0.5),
			opacity: 1,
			fillOpacity: 0.8,
			svg,
			svgSize: canvasSize
		};
		return style;
	};
};
export const getPoiClusterIconCreatorFunction = (
	svgSize = 24,
	colorizer = getColorForProperties
) => {
	//return a function because the functionCall of the iconCreateFunction cannot be manipulated
	return (cluster) => {
		var childCount = cluster.getChildCount();
		const values = [];
		const colors = [];

		const r = svgSize / 1.5;
		// Pie with default colors
		let childMarkers = cluster.getAllChildMarkers();

		let containsSelection = false;
		let inCart = false;
		for (let marker of childMarkers) {
			values.push(1);
			colors.push(Color(colorizer(marker.feature.properties)));
			if (marker.feature.selected === true) {
				containsSelection = true;
			}
			if (marker.feature.inCart) {
				inCart = true;
			}
		}
		const pie = createSVGPie(values, r, colors);

		let canvasSize = svgSize / 3.0 * 5.0;
		let background = createElement('svg', {
			width: canvasSize,
			height: canvasSize,
			viewBox: `0 0 ${canvasSize} ${canvasSize}`
		});

		//Kleiner Kreis in der Mitte
		// (blau wenn selektion)
		let innerCircleColor = '#ffffff';
		if (containsSelection) {
			innerCircleColor = 'rgb(67, 149, 254)';
		}

		//inner circle
		pie.appendChild(
			createElement('circle', {
				cx: r,
				cy: r,
				r: svgSize / 3.0,
				'stroke-width': 0,
				opacity: '0.5',
				fill: innerCircleColor
			})
		);

		// //Debug Rectangle -should be commnented out
		// background.appendChild(createElement('rect', {
		//     x:0,
		//     y:0,
		//     width: canvasSize,
		//     height: canvasSize,
		//     "stroke-width":1,
		//     stroke: "#000000",
		//     opacity: "1",
		//     fill: "#ff0000"

		// }));

		background.appendChild(pie);

		// Umrandung
		background.appendChild(
			createElement('circle', {
				cx: canvasSize / 2.0,
				cy: canvasSize / 2.0,
				r: r,
				'stroke-width': 2,
				stroke: '#000000',
				opacity: '0.5',
				fill: 'none'
			})
		);

		if (inCart) {
			background
				.appendChild(
					createElement('text', {
						x: '50%',
						y: '50%',
						'text-anchor': 'middle',
						'font-family': 'FontAwesome',
						fill: '#fff',
						'font-size': '26',
						dy: '.4em',
						opacity: '0.5'
					})
				)
				.appendChild(document.createTextNode('\uf005'));
		}

		background
			.appendChild(
				createElement('text', {
					x: '50%',
					y: '50%',
					'text-anchor': 'middle',
					dy: '.3em'
				})
			)
			.appendChild(document.createTextNode(childCount));

		pie.setAttribute('x', (canvasSize - r * 2) / 2.0);
		pie.setAttribute('y', (canvasSize - r * 2) / 2.0);

		var divIcon = L.divIcon({
			className: 'leaflet-data-marker',
			html: background.outerHTML || new XMLSerializer().serializeToString(background), //IE11 Compatibility
			iconAnchor: [ canvasSize / 2.0, canvasSize / 2.0 ],
			iconSize: [ canvasSize, canvasSize ]
		});
		//console.log(background.outerHtml)
		return divIcon;
	};
};

export const getColorForProperties = (properties) => {
	return '#003D7D';
};
export const getColorFromLebenslagenCombination = (combination) => {
	let qColorRules;
	let colorCandidate;
	let lookup = null;
	try {
		qColorRules = queryString.parse(store.getState().routing.location.search).colorRules;

		if (qColorRules) {
			try {
				lookup = JSON.parse(qColorRules);
			} catch (error) {
				console.error(error);
			}
		}
	} catch (error) {
		//problem dduring colorRulesn override
	}
	if (lookup === null) {
		lookup = poiColors;
	}

	colorCandidate = lookup[combination];
	if (colorCandidate) {
		return colorCandidate;
	} else {
		let colorHash = new ColorHash({ saturation: 0.3 });
		const c = colorHash.hex(combination);
		console.debug(
			"Keine vordefinierte Farbe für '" +
				combination +
				"' vorhanden. (Ersatz wird automatisch erstellt) --> " +
				c
		);
		return c;
	}
	//return "#A83F6A";
};

export const featureHoverer = (feature) => {
	return '<div>' + feature.text + '</div>';
};

const getSignatur = (properties) => {
	// if (properties.schluessel === 'P') {
	// 	return 'pr.svg';
	// } else {
	// 	return 'br.svg'; //TODO sinnvoller default
	// }
	return 'pikto_e-mobil.svg';
};

export const addSVGToFeature = (feature, manualReloadRequested) => {
	return new Promise(function(fulfilled, rejected) {
		let cacheHeaders = new Headers();
		if (true || manualReloadRequested) {
			cacheHeaders.append('pragma', 'no-cache');
			cacheHeaders.append('cache-control', 'no-cache');
		}

		fetch('/svgs/' + getSignatur(feature), { method: 'get', headers: cacheHeaders })
			.then((response) => {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error("Server svg response wasn't OK");
				}
			})
			.then((svgText) => {
				const svgDocument = new DOMParser().parseFromString(svgText, 'application/xml');
				const svgObject = svgDocument.documentElement;
				if (svgObject.tagName === 'svg') {
					feature.svgBadge = svgText;
					feature.svgBadgeDimension = {
						width: svgObject.getAttribute('width'),
						height: svgObject.getAttribute('height')
					};
					fulfilled(feature);
				} else {
					throw new Error("Server svg response wasn't a SVG");
				}
			})
			.catch(function(error) {
				console.error('Problem bei /svgs/' + getSignatur(feature), error);
				console.error(error);

				//fallback SVG
				console.log('Will use fallbackSVG for ' + getSignatur(feature));

				feature.svgBadge = fallbackSVG;
				feature.svgBadgeDimension = {
					width: '311.668',
					height: '311.668'
				};
				fulfilled(feature);
			});
	});
};

export const triggerLightBoxForPOI = (currentFeature, uiStateActions) => {
	if (
		currentFeature.properties.fotostrecke === undefined ||
		currentFeature.properties.fotostrecke === null ||
		currentFeature.properties.fotostrecke.indexOf('&noparse') !== -1
	) {
		uiStateActions.setLightboxUrls([
			currentFeature.properties.foto.replace(
				/http:\/\/.*fotokraemer-wuppertal\.de/,
				'https://wunda-geoportal-fotos.cismet.de/'
			)
		]);
		uiStateActions.setLightboxTitle(currentFeature.text);
		let linkUrl;
		if (currentFeature.properties.fotostrecke) {
			linkUrl = currentFeature.properties.fotostrecke;
		} else {
			linkUrl = 'http://www.fotokraemer-wuppertal.de/';
		}
		uiStateActions.setLightboxCaption(
			<a href={linkUrl} target='_fotos'>
				<Icon name='copyright' /> Peter Kr&auml;mer - Fotografie
			</a>
		);
		uiStateActions.setLightboxIndex(0);
		uiStateActions.setLightboxVisible(true);
	} else {
		fetch(
			currentFeature.properties.fotostrecke.replace(
				/http:\/\/.*fotokraemer-wuppertal\.de/,
				'https://wunda-geoportal-fotos.cismet.de/'
			),
			{
				method: 'get'
			}
		)
			.then(function(response) {
				return response.text();
			})
			.then(function(data) {
				var tmp = document.implementation.createHTMLDocument();
				tmp.body.innerHTML = data;
				let urls = [];
				let counter = 0;
				let mainfotoname = decodeURIComponent(currentFeature.properties.foto)
					.split('/')
					.pop()
					.trim();
				let selectionWish = 0;
				for (let el of tmp.getElementsByClassName('bilderrahmen')) {
					let query = queryString.parse(
						el.getElementsByTagName('a')[0].getAttribute('href')
					);
					urls.push(
						'https://wunda-geoportal-fotos.cismet.de/images/' + query.dateiname_bild
					);
					if (mainfotoname === query.dateiname_bild) {
						selectionWish = counter;
					}
					counter += 1;
				}
				uiStateActions.setLightboxUrls(urls);
				uiStateActions.setLightboxTitle(currentFeature.text);
				uiStateActions.setLightboxCaption(
					<a href={currentFeature.properties.fotostrecke} target='_fotos'>
						<Icon name='copyright' /> Peter Kr&auml;mer - Fotografie
					</a>
				);
				uiStateActions.setLightboxIndex(selectionWish);
				uiStateActions.setLightboxVisible(true);
			})
			.catch(function(err) {
				console.log(err);
			});
	}
};

export const getPRSVG = (
	svgSize = 30,
	bg = '#FF0000',
	kind = '-',
	svgStyleRelatedId = 'default',
	svgCodeInput = prSVG
) => {
	let bdim = {
		width: 20,
		height: 20
	};

	let svgCode = `<svg  id="${svgStyleRelatedId}" height="${svgSize}" width="${svgSize}"> 
                    <style>
                    /* <![CDATA[ */
                        #${svgStyleRelatedId} .bg-fill  {
                            fill: ${bg};
                        }
                        #${svgStyleRelatedId} .bg-stroke  {
                            stroke: ${bg};
                        }
                        #${svgStyleRelatedId} .fg-fill  {
                            fill: white;
                        }
                        #${svgStyleRelatedId} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <svg x="${svgSize / bdim.width / 2}" y="${svgSize /
		bdim.height /
		2}"  width="${svgSize - 2 * svgSize / bdim.width / 2}" height="${svgSize -
		2 * svgSize / bdim.height / 2}" viewBox="0 0 ${bdim.width} ${bdim.height || 24}">       
                    ${svgCodeInput}
                </svg>
                </svg>  `;

	return <SVGInline svg={svgCode} />;
};
