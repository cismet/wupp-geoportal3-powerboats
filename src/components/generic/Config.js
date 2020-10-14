export const createConfigJSON = () => {
	console.log('tmConfig', JSON.stringify(defaultConfig.tmConfig, null, 2));
	console.log('featureDefaults', JSON.stringify(defaultConfig.featureDefaultConfig, null, 2));
	console.log('infoBoxConfig', JSON.stringify(defaultConfig.info, null, 2));
	console.log('featureDefaultProperties', JSON.stringify(defaultProperties, null, 2));
	console.log('features', JSON.stringify(config.features, null, 2));
	console.log('helpTextblocks', JSON.stringify(helpTextblocks, null, 2));
};

export const defaultConfig = {
	tmConfig: {
		fullScreenControl: true,
		locatorControl: true,
		gazetteerSearchBox: true,
		noInitialLoadingText: true,
		gazetteerSearchBoxPlaceholdertext: 'Suchbegriff hier eingeben.',
		photoLightBox: true,
		fallbackBackgroundlayers: 'wupp-plan-live@90',
		gazetteerTopicsList: [ 'pois', 'kitas', 'quartiere', 'bezirke', 'adressen' ],
		home: {
			center: [ 51.22665888065321, 7.146690085998209 ],
			zoom: 14
		},
		applicationMenuTooltipString: 'Einstellungen | Anleitung',
		applicationMenuIconname: 'bars',
		clusterOptions: {
			spiderfyOnMaxZoom: false,
			showCoverageOnHover: false,
			zoomToBoundsOnClick: false,
			maxClusterRadius: 40,
			disableClusteringAtZoom: 19,
			animate: false,
			cismapZoomTillSpiderfy: 12,
			selectionSpiderfyMinZoom: 12
		},
		minZoom: 5,
		maxZoom: 19
	},
	featureDefaultConfig: {
		crs: {
			type: 'name',
			properties: {
				name: 'urn:ogc:def:crs:EPSG::25832'
			}
		},
		type: 'Feature',
		selected: false
	},
	info: {
		pixelwidth: 300,
		header: 'Wasserstofftankstelle',
		navigator: {
			noun: {
				singular: 'Wasserstofftankstelle',
				plural: 'Wasserstofftankstellen'
			}
		},
		noCurrentFeatureTitle: 'Keine Wasserstofftankstelle gefunden',
		noCurrentFeatureContent: ''
	},
	city: 'Wuppertal'
};
export const defaultProperties = {
	color: '#247CE0',

	svgBadge: `
	<svg width="132px" height="132px" viewBox="0 0 132 132" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<g id="piktogramm_wasserstoff_kfz">
				<path d="M13.11,-1.42108547e-14 L117.97,-1.42108547e-14 C125.18,-1.42108547e-14 131.08,5.9 131.08,13.11 L131.08,117.97 C131.08,125.18 125.18,131.08 117.97,131.08 L13.11,131.08 C5.9,131.08 -1.42108547e-14,125.18 -1.42108547e-14,117.97 L-1.42108547e-14,13.11 C-1.42108547e-14,5.9 5.9,-1.42108547e-14 13.11,-1.42108547e-14 Z" id="Path" class="bg-fill" fill="#247CE0"></path>
				<path d="M31.77,124.37 C27.88,124.37 24.36,122.79 21.81,120.24 C19.27,117.7 17.69,114.17 17.69,110.29 C17.69,106.4 19.27,102.88 21.81,100.33 C24.36,97.78 27.88,96.2 31.77,96.2 C35.66,96.2 39.18,97.78 41.73,100.33 C44.28,102.88 45.85,106.4 45.85,110.29 C45.85,114.17 44.28,117.7 41.73,120.24 C39.18,122.79 35.66,124.37 31.77,124.37 L31.77,124.37 Z M26.45,115.61 C27.81,116.97 29.69,117.82 31.77,117.82 C33.85,117.82 35.73,116.97 37.09,115.61 C38.46,114.25 39.3,112.37 39.3,110.29 C39.3,108.21 38.46,106.33 37.09,104.96 C35.73,103.6 33.85,102.76 31.77,102.76 C29.69,102.76 27.81,103.6 26.45,104.96 C25.09,106.33 24.24,108.21 24.24,110.29 C24.24,112.37 25.09,114.25 26.45,115.61 L26.45,115.61 Z" id="Shape" fill="#FFFFFF" class="fg-fill" fill-rule="nonzero"></path>
				<path d="M95.54,124.37 C91.66,124.37 88.13,122.79 85.59,120.24 C83.04,117.7 81.46,114.17 81.46,110.29 C81.46,106.4 83.04,102.88 85.59,100.33 C88.13,97.78 91.66,96.2 95.54,96.2 C99.43,96.2 102.95,97.78 105.5,100.33 C108.05,102.88 109.63,106.4 109.63,110.29 C109.63,114.17 108.05,117.7 105.5,120.24 C102.95,122.79 99.43,124.37 95.54,124.37 L95.54,124.37 Z M90.22,115.61 C91.58,116.97 93.46,117.82 95.54,117.82 C97.62,117.82 99.5,116.97 100.87,115.61 C102.23,114.25 103.07,112.37 103.07,110.29 C103.07,108.21 102.23,106.33 100.87,104.96 C99.5,103.6 97.62,102.76 95.54,102.76 C93.46,102.76 91.58,103.6 90.22,104.96 C88.86,106.33 88.02,108.21 88.02,110.29 C88.02,112.37 88.86,114.25 90.22,115.61 L90.22,115.61 Z" id="Shape" fill="#FFFFFF" class="fg-fill" fill-rule="nonzero"></path>
				<path d="M40.57,83.95 L105.43,83.95 C105.07,82.88 104.74,81.77 104.4,80.65 C102.47,75.19 100.53,69.08 95.11,68.08 C89.99,67.14 85.11,66.74 80.41,66.64 C73.25,66.49 67.44,67.03 65.42,67.43 C60.38,68.42 56.93,71.72 53.3,75.19 C52.21,76.23 51.1,77.29 49.85,78.38 C49.77,78.46 49.69,78.52 49.6,78.58 C47.25,80.35 44.79,81.91 42.23,83.17 C41.68,83.44 41.13,83.7 40.57,83.95 L40.57,83.95 Z M11.66,108.46 C7.01,105.74 5.29,101.61 5.61,96.75 C6.32,85.76 16.81,84.46 32.38,81.15 C32.52,81.09 32.68,81.04 32.84,81.01 C35.29,80.49 37.66,79.63 39.93,78.51 C42.22,77.38 44.4,76 46.47,74.44 C47.54,73.5 48.64,72.45 49.72,71.42 C53.91,67.42 57.9,63.6 64.42,62.31 C66.63,61.88 72.9,61.28 80.51,61.44 C85.47,61.55 91.03,61.97 96.44,62.97 C107.89,65.08 106.74,76.64 114.9,82.46 C117.28,84.15 118.41,85.16 120.59,87.01 C130.61,95.46 125.49,112.22 115.18,111.92 L115.1,111.92 C115.14,111.38 115.16,110.84 115.16,110.29 C115.16,104.91 112.98,100.05 109.46,96.53 C105.94,93 101.07,90.82 95.7,90.82 C90.33,90.82 85.46,93 81.94,96.53 C78.42,100.05 76.24,104.91 76.24,110.29 C76.24,110.65 76.25,111.02 76.27,111.38 L51.17,111.4 C51.19,111.03 51.2,110.66 51.2,110.29 C51.2,104.91 49.02,100.05 45.5,96.53 C41.98,93 37.11,90.82 31.74,90.82 C26.36,90.82 21.5,93 17.98,96.53 C14.84,99.66 12.77,103.85 12.35,108.52 L11.66,108.46 L11.66,108.46 Z" id="Shape" class="fg-fill" fill="#FFFFFF"></path>
				<path d="M22.06,46.41 L22.06,29.47 L22.02,29.94 C20.19,29.8 19.2,30.02 18.74,30.6 C18.22,31.25 18.1,32.5 18.1,34.25 L18.1,34.25 L18.1,41.74 L18.1,41.78 C18.03,43.87 16.87,45.22 15.41,45.82 C14.84,46.06 14.22,46.17 13.6,46.17 C12.98,46.16 12.36,46.03 11.79,45.78 C10.37,45.15 9.29,43.8 9.28,41.75 L9.27,41.74 L9.27,23.99 L9.28,23.99 C9.26,23.2 9.29,22.67 9.41,22.21 C9.54,21.66 9.77,21.27 10.13,20.84 L10.12,20.84 L15.57,13.71 L17.65,15.3 L14.28,19.7 C15.06,19.87 15.76,20.27 16.31,20.81 C17.05,21.55 17.5,22.57 17.5,23.7 C17.5,24.84 17.05,25.86 16.31,26.6 C15.57,27.34 14.54,27.8 13.41,27.8 C12.87,27.8 12.36,27.7 11.89,27.51 L11.89,41.74 L11.89,41.74 C11.89,42.6 12.31,43.15 12.85,43.39 C13.08,43.5 13.35,43.55 13.62,43.55 C13.89,43.56 14.16,43.51 14.42,43.4 C14.99,43.17 15.44,42.61 15.49,41.74 L15.48,41.74 L15.48,34.25 L15.49,34.25 C15.49,31.93 15.71,30.19 16.7,28.96 C17.72,27.69 19.35,27.14 22.06,27.32 L22.06,9.01 L28.22,9.01 L28.22,23.74 L40.39,23.74 L40.39,9.01 L46.55,9.01 L46.55,46.41 L40.39,46.41 L40.39,30.06 L28.22,30.06 L28.22,46.41 L22.06,46.41 Z M14.45,22.66 C14.19,22.4 13.82,22.23 13.41,22.23 C13,22.23 12.64,22.4 12.37,22.66 C12.1,22.93 11.94,23.3 11.94,23.7 C11.94,24.11 12.1,24.48 12.37,24.75 C12.64,25.01 13,25.18 13.41,25.18 C13.82,25.18 14.19,25.01 14.45,24.75 C14.72,24.48 14.88,24.11 14.88,23.7 C14.88,23.3 14.72,22.93 14.45,22.66 Z M58.69,48.48 L58.69,51.65 L48.86,51.65 C48.96,50.45 49.28,49.31 49.82,48.22 C50.36,47.14 51.41,45.72 52.97,43.95 C54.2,42.55 54.96,41.6 55.24,41.11 C55.66,40.38 55.87,39.66 55.87,38.93 C55.87,38.15 55.7,37.56 55.35,37.16 C55,36.77 54.54,36.57 53.98,36.57 C52.74,36.57 52.07,37.5 51.98,39.36 L49.18,38.99 C49.35,37.17 49.85,35.84 50.7,34.99 C51.54,34.14 52.66,33.72 54.05,33.72 C55.59,33.72 56.75,34.22 57.52,35.22 C58.3,36.22 58.69,37.36 58.69,38.66 C58.69,39.39 58.59,40.1 58.39,40.78 C58.2,41.47 57.89,42.16 57.48,42.86 C57.06,43.55 56.38,44.44 55.41,45.51 C54.51,46.53 53.94,47.2 53.7,47.53 C53.46,47.85 53.27,48.17 53.12,48.48 L58.69,48.48 L58.69,48.48 Z" id="Shape" fill="#FFFFFF" class="fg-fill" fill-rule="nonzero"></path>
			</g>
		</g>
	</svg>
   `,
	svgBadgeDimension: {
		width: '132',
		height: '132'
	}
};

const helpTextblocks = [
	{
		type: 'FAQS',
		configs: [
			{
				title: 'Datengrundlage',
				bsStyle: 'warning',
				contentBlockConf: {
					type: 'DOCBLOCK',
					docBlockConfigs: [
						{
							type: 'HTML',
							html: `
										Die Karte <b>Wasserstoff in Wuppertal</b> bietet ihnen die folgenden
										Hintergrundkarten an, die auf verschiedenen Geodatendiensten und Geodaten
										basieren:
										`
						},
						{
							type: 'HTML',
							html: '<p><ul><li id="lic_lbk"/><li id="lic_sp"/></ul></p>',
							replaceConfig: {
								lic_lbk: { type: 'LICENSE_LBK' },
								lic_sp: { type: 'LICENSE_STADTPLAN' }
							}
						}
					]
				}
			},
			{
				title: 'Hintergrund',
				bsStyle: 'warning',
				contentBlockConf: {
					type: 'HTML',
					html: `
			<p>
				Eine Wasserstofftankstelle ist eine Tankstelle zum Betanken von
				Kraftfahrzeugen mit Wasserstoff. Sie verfügt über eine oder mehrere
				Zapfsäulen mit der der Energievorrat mobiler Wasserstoffverbraucher,
				meist Brennstoffzellenfahrzeuge aufgefüllt werden kann. Für die
				Wasserstofftankstelle wird der flüssige oder komprimiert gasförmige
				Wasserstoff in Tanks bereitgehalten. Eine Wasserstofftankstelle
				verfügt typischerweise über Pumpen und Zapfvorrichtungen zum
				Anschluss an die jeweiligen Fahrzeugtanks. Damit eine Nutzung
				derartiger Fahrzeuge überregional möglich wird, wurde vor allem in
				Nordamerika der Aufbau von Tankstellen entlang sogenannter „Hydrogen
				highways“ geplant. Der erste Highway wurde im September 2017
				eingeweiht. In Deutschland erfolgt der Aufbau maßgeblich in sieben
				Regionen (Hamburg, Berlin, Rhein-Ruhr, Frankfurt, Nürnberg,
				Stuttgart und München) sowie entlang der verbindenden Autobahnen und
				Fernstraßen.
			</p>
				`
				}
			},
			{
				title: 'Mein Standort',
				bsStyle: 'default',
				contentBlockConf: {
					type: 'MYLOCATION'
				}
			}
		]
	}
];

export const config = {
	...defaultConfig,
	helpTextblocks,
	features: [
		{
			index: 0,
			id: 42,
			text: 'Wasserstofftankstelle Schmiedestraße',
			type: 'Feature',
			selected: true,
			geometry: {
				type: 'Point',
				coordinates: [ 378213.832675781275611, 5685536.171230468899012 ]
			},
			properties: {
				...defaultProperties,
				info: {
					title: 'Shell Tankstelle',
					subtitle:
						'Autobahnanbindung A1 (Dreieck Wuppertal Nord) und A46 (Wuppertal Oberbarmen).',
					additionalInfo: 'Schmiedestraße 91',
					actions: [ { name: 'zoomToFeature' }, {} ]
				},
				tel: '+49-202-6294410',
				url:
					'https://www.think-ing.de/unternehmen/shell-deutsche-shell-holding-gmbh-hamburg',
				email: 'info@cismet.de',
				foto: 'https://updates.cismet.de/docs/h2.shell.0.png',
				fotos: [
					'https://updates.cismet.de/docs/h2.shell.0.png',
					'https://updates.cismet.de/docs/h2.shell.1.png',
					'https://updates.cismet.de/docs/h2.shell.2.png'
				],
				secondaryInfos: {
					title: 'Datenblatt: Wasserstoffstation Shell Tankstelle',
					iconName: 'charging-station',
					image: 'https://updates.cismet.de/docs/h2.shell.0.png',
					md:
						'**Adresse**:\nSchmiedestraße 91\n\n<div style="padding-top:20px;"/>Autobahnanbindung A1 (Dreieck Wuppertal Nord) und A46 (Wuppertal Oberbarmen).\n\n<div style="padding-top:20px;"/>\n\n**Öffnungszeiten: **24 Stunden / 7 Tage',
					secondarySections: [
						{
							title: 'Zapfmöglichkeit verfügbar (online)',
							type: 'info',
							md: '**Zapfsäulen:** 2'
						},
						{
							title: 'Bezahlen',
							type: 'warning',
							md:
								'**Authentifizierung:** Offener Zugang während der Öffnungszeit.\n\n**Ladekosten:** Tagespreis für Wasserstoff.'
						},
						{
							title: 'Betreiber',
							type: 'success',
							md:
								'Deutsche Shell Holding GmbH\n\nSchmiedestraße 91\n\n42279 Wuppertal',
							links: true
						}
					]
				}
			}
		}
	]
};
