import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Accordion, Panel } from 'react-bootstrap';
import Icon from 'components/commons/Icon';
import GenericRVRStadtplanwerkMenuFooter from '../commons/GenericRVRStadtplanwerkMenuFooter';
import CismetFooterAcks from 'components/commons/CismetFooterAcknowledgements';

const Comp = ({ visible, anlagenFeature, setVisibleState, uiHeight }) => {
	const close = () => {
		setVisibleState(false);
	};

	const modalBodyStyle = {
		overflowY: 'auto',
		overflowX: 'hidden',
		maxHeight: uiHeight - 200
	};
	const anlage = anlagenFeature.properties;
	let foto;
	if (anlage.foto !== undefined) {
		foto = 'https://www.wuppertal.de/geoportal/prbr/fotos/' + anlage.foto;
	}
	let plaetze_label = 'Plätze';
	if (anlage.ueberdachung === true) {
		plaetze_label = 'überdachter Plätze';
	}
	let kind = `${anlage.schluessel}+R Anlage`;
	let iconName = 'car';
	if (anlage.schluessel === 'B') {
		iconName = 'bicycle';
	}
	return (
		<Modal
			style={{
				zIndex: 2900000000
			}}
			height='100%'
			bsSize='large'
			show={visible}
			onHide={close}
			keyboard={false}
		>
			<Modal.Header>
				<Modal.Title>
					<Icon name={iconName} /> {`Datenblatt: ${kind} ${anlage.name}`}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={modalBodyStyle} id='myMenu' key={'prbr.secondaryInfo'}>
				<div style={{ minHeight: 200 }}>
					{foto !== undefined && (
						<img
							alt='Bild'
							style={{
								paddingLeft: 10,
								paddingRight: 10,
								float: 'right',
								paddingBottom: '5px'
							}}
							src={foto}
							width='250'
						/>
					)}
					{anlage.beschreibung}

					<br />
					<p style={{ paddingTop: 10 }}>
						Anzahl {plaetze_label}: {anlage.plaetze}
					</p>
					{anlage.anbindung_schwebebahn === true && (
						<p style={{ paddingTop: 10 }}>
							Die Anlage ist an die Schwebebahn angebunden und befindet sich{' '}
							{anlage.inUZ === true ? 'innerhalb' : 'außerhalb'} einer Umweltzone.
						</p>
					)}
					{anlage.anbindung_schwebebahn === false &&
					anlage.inUZ === true && (
						<p style={{ paddingTop: 10 }}>
							Die Anlage befindet sich in einer Umweltzone.
						</p>
					)}
					{anlage.anbindung_schwebebahn === false &&
					anlage.inUZ === false && (
						<p style={{ paddingTop: 10 }}>
							Die Anlage befindet sich außerhalb einer Umweltzone.
						</p>
					)}
				</div>
				{(anlage.bahnlinien.length > 0 || anlage.buslinien.length > 0) && (
					<Accordion
						key={'1'}
						name={'1'}
						style={{ marginBottom: 6 }}
						defaultActiveKey={'1'}
					>
						<Panel header={'ÖPNV'} eventKey={'1'} bsStyle={'info'}>
							{anlage.bahnlinien.length > 0 && (
								<div>
									<h4>
										<b>Bahnlinien</b>
									</h4>
									{anlage.bahnlinien.map((linie, index) => {
										return <div key={'bahnlinie.' + index}>{linie}</div>;
									})}
								</div>
							)}
							{anlage.buslinien.length > 0 && (
								<div>
									<h4>
										<b>Buslinien</b>
									</h4>
									{anlage.buslinien.join(', ')}
								</div>
							)}
						</Panel>
					</Accordion>
				)}
				<Accordion key={'2'} name={'2'} style={{ marginBottom: 6 }} defaultActiveKey={'2'}>
					<Panel header={'Fahrplanauskunft'} eventKey={'2'} bsStyle={'success'}>
						<a
							style={{ textDecoration: 'none' }}
							href={`http://efa.vrr.de/wswstd/XSLT_TRIP_REQUEST2?language=de&sessionID=0&odvMacro=true&commonMacro=true&lineRestriction=403&SpEncId=0&type_origin=any&type_destination=any&useRealtime=1&nameInfo_origin=invalid&nameInfo_destination=invalid&name_origin=${anlage.haltestellenname}&name_destination=`}
							target='_fahrplanauskunft'
						>
							<table style={{ width: '100%' }}>
								<tbody>
									<tr>
										<td
											style={{
												textAlign: 'left',
												verticalAlign: 'top',
												paddingRight: 10
											}}
										>
											<h4>
												Mit einem Klick die Fahrplanauskunft des VRR zu
												dieser Haltestelle öffnen.
											</h4>
											<img
												alt='Bild'
												style={{ paddingBottom: '5px' }}
												src='/images/logo-vrr.png'
												width='80'
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</a>
					</Panel>
				</Accordion>
			</Modal.Body>
			<Modal.Footer>
				<table
					style={{
						width: '100%'
					}}
				>
					<tbody>
						<tr>
							<td
								style={{
									textAlign: 'left',
									verticalAlign: 'top',
									paddingRight: '30px'
								}}
							>
								<div>
									<span style={{ verticalAlign: 'bottom', fontSize: '11px' }}>
										<CismetFooterAcks />
									</span>
								</div>
							</td>
							<td>
								<Button
									id='cmdCloseModalApplicationMenu'
									bsStyle='primary'
									type='submit'
									onClick={close}
								>
									Ok
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</Modal.Footer>
		</Modal>
	);
};

export default Comp;
Comp.propTypes = {
	menuIcon: PropTypes.string,
	menuTitle: PropTypes.string,
	menuIntroduction: PropTypes.object,
	menuSections: PropTypes.array,
	menuFooter: PropTypes.object,

	uiStateActions: PropTypes.object,
	uiState: PropTypes.object,
	kitasState: PropTypes.object,
	kitasActions: PropTypes.object,
	mappingState: PropTypes.object,
	mappingActions: PropTypes.object
};

Comp.defaultProps = {
	menuIcon: 'bars',
	menuTitle: 'Einstellungen und Hilfe',
	menuSections: [],
	menuFooter: <GenericRVRStadtplanwerkMenuFooter />
};
