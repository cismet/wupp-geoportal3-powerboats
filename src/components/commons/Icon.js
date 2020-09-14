import {
	faClock,
	faInfoCircle,
	faSquareFull,
	faSearch,
	faSearchLocation,
	faChargingStation,
	faCircle,
	faChartPie,
	faHome,
	faRoad,
	faTag,
	faTags,
	faChild,
	faTimes,
	faMapMarker,
	faMapMarkerAlt,
	faExternalLinkSquareAlt,
	faCalendar,
	faCalendarAlt,
	faBars,
	faCodeBranch,
	faChartBar,
	faArrowsAltV,
	faArrowsAltH,
	faFileArchive
} from '@fortawesome/free-solid-svg-icons';
import { faFilePdf, faFile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitbucket } from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import { Icon } from 'react-fa';

const nameMap = {
	clock: faClock,
	phone: undefined, // faPhone,
	search: faSearch,
	lupe: faSearch,
	'search-location': faSearchLocation,
	info: faInfoCircle,
	file: faFile,
	'file-pdf-o': faFilePdf,
	home: faHome,
	adresse: faHome,
	road: faRoad,
	strasse: faRoad,
	tags: faTags,
	altpoi: faTags,
	tag: faTag,
	poi: faTag,
	times: faTimes,
	x: faTimes,
	close: faTimes,
	'external-link-square': faExternalLinkSquareAlt,
	'chevron-circle-down': undefined,
	user: undefined,
	calendar: faCalendarAlt,
	bars: faBars,
	'bar-chart': faChartBar,
	'minus-square': undefined,
	bitbucket: faBitbucket,
	'code-fork': faCodeBranch,
	car: undefined,
	'chevron-circle-up': undefined,
	'arrow-circle-up': undefined,
	bicycle: undefined,
	circle: faCircle,
	stadtbezirk: faCircle,
	'pie-chart': faChartPie,
	quartier: faChartPie,
	child: faChild,
	kita: faChild,
	'map-marker': faMapMarker,
	'battery-quarter': faChargingStation,
	'charging-station': faChargingStation,
	'square-full': faSquareFull,
	'arrows-v': faArrowsAltV,
	'arrows-h': faArrowsAltH,
	'file-archive-o': faFileArchive,
	'file-o': faFile
};

const IconComp = (props) => {
	// if (window.iconnames === undefined) {
	// 	window.iconnames = [ props.name ];
	// } else {
	// 	if (window.iconnames.indexOf(props.name) === -1) {
	// 		window.iconnames.push(props.name);
	// 	}
	// }
	// console.log('Icon.names', window.iconnames);

	let overlay = props.overlay;
	let lookupName = props.name;
	let icon = nameMap[lookupName];
	let marginRight = props.marginRight || '1px';
	let width = props.width || '18px';

	if (icon !== undefined) {
		if (overlay !== undefined) {
			return (
				<span className='fa-layers fa-w12 fa-lg' style={{ marginRight, width }}>
					<FontAwesomeIcon icon={icon} />
					<span
						style={{ fontSize: '1.0rem', paddingRight: '2px', paddingTop: '3px' }}
						className='fa-layers-text fa-inverse'
						data-fa-transform='rotate-90'
					>
						{overlay}
					</span>
				</span>
			);
		} else {
			return <FontAwesomeIcon {...props} icon={icon} />;
		}
	} else {
		return <Icon {...props} />;
	}
};

export default IconComp;
