import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';
/* eslint-disable jsx-a11y/anchor-is-valid */

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='karteninhalt'
			sectionTitle='Karteninhalt auswählen'
			sectionBsStyle='success'
			sectionContent={
				<div>
					<p>
						Die Starkregengefahrenkarte unterstützt zwei verschiedene Kartenansichten.
						In der stets sichtbaren Titelzeile oben im Kartenfenster wird Ihnen die
						gerade aktive Kartenansicht angezeigt. Standardmäßig werden die maximalen
						Wasserstände dargestellt, die im Verlauf eines simulierten
						Starkregenereignisses auftreten. Mit der Schaltfläche{' '}
						<a>
							<Icon name='random' />
						</a>{' '}
						auf der rechten Seite der Titelzeile können Sie zur Anzeige der maximalen
						Fließgeschwindigkeiten wechseln. (Ein erneuter Klick führt wieder zurück zur
						Anzeige der maximalen Wasserstände.)
					</p>
					<p>
						In der rechten unteren Ecke der Anwendung (bei kleinen Displays unten direkt
						über dem Eingabefeld) finden Sie das <b>Kontrollfeld</b>, mit dem Sie den
						weiteren Karteninhalt nach Ihren Wünschen festlegen können. Klicken Sie
						unter <b>Simulation</b> auf eine der vier Schaltflächen, um die
						Starkregensimulation auszuwählen, die angezeigt werden soll. Details zu den
						Simulationsberechnungen finden Sie hier in der Kompaktanleitung unter{' '}
						<a onClick={() => showModalMenu('datengrundlage')}>Datengrundlagen</a> und{' '}
						<a onClick={() => showModalMenu('szenarien')}>Simulierte Szenarien</a>.
					</p>
					<p>
						Unter <b>Karte</b> können Sie aus drei verschiedenen Hintergrundkarten
						auswählen: einer topographischen Karte in Graustufen, einer Luftbildkarte
						und einem Stadtplan. Die topographische Karte verschafft Ihnen den besten
						Überblick über die Situation, da sie einen plastischen Geländeeindruck
						vermittelt.. Der Stadtplan eignet sich gut für die sichere Identifizierung
						Ihres Hauses, da hier die Hausnummern aller Gebäude dargestellt werden. Die
						Luftbildkarte ist die anschaulichste Kartengrundlage, sie eignet sich daher
						vor allem für Detailbetrachtungen. Näheres zu den Geodaten, die diesen
						Karten zu Grunde liegen, finden Sie ebenfalls unter{' '}
						<a onClick={() => showModalMenu('datengrundlage')}>Datengrundlagen</a>.
					</p>
					<p>
						Unter <b>Animation</b> finden Sie einen Wechselschalter zum An- und
						Ausschalten einer animierten Darstellung des Fließgeschehens. Standardmäßig
						ist diese Animation aktiviert. Sie basiert auf den Maximalbeträgen der
						Geschwindigkeitsvektoren, die für jede Rasterzelle im Verlauf einer
						Simulationsberechnung bestimmt werden. Es wird also der Abfluss in die
						Richtung animiert, in der sich die größte Geschwindigkeit einstellt. Die
						Animation vermittelt ein besonders anschauliches Bild des komplexen
						Abflussgeschehens bei einem Starkregenereignis. Die Animation steht nur bei
						der Betrachtung der Starkregengefahrenkarte in einem Detailmaßstab
						(Zoomstufen 13 bis 18) zur Verfügung, in den Übersichtsmaßstäben (Zoomstufen
						12 und kleiner) wird sie automatisch ausgeblendet. Wenn die Animation nicht
						angezeigt wird, blenden wir in der Kartenansicht "max.
						Fließgeschwindigkeiten" in Detailmaßstäben (hier bis zur Zoomstufe 12)
						statische Fließrichtungspfeile ein, um die Richtungen des
						Regenwasserabflusses zu visualisieren.
					</p>
					<p>
						Am oberen Rand des Kontrollfeldes befindet sich eine platzsparende Legende,
						mit der die zur Klassifizierung der maximalen simulierten Wasserstände bzw.
						Fließgeschwindigkeiten verwendeten Farben erläutert werden. Direkt darunter
						finden Sie die Bezeichnung und (in kleiner Schrift) eine Kurzbeschreibung
						des aktuell ausgewählten Simulations-Szenarios. Über den Link{' '}
						<a onClick={() => showModalMenu('szenarien')}>(mehr)</a> am Ende jeder
						Kurzbeschreibung gelangen Sie zu einer ausführlicheren Darstellung aller
						vier Szenarien in der Kompaktanleitung. Mit der Schaltfläche{' '}
						<Icon name='chevron-circle-down' /> rechts neben der Simulationsbezeichnung
						lässt sich das Kontrollfeld so verkleinern, dass nur noch die Legende und
						die Simulationsbezeichnung angezeigt werden - nützlich für Endgeräte mit
						kleinem Display. Mit der Schaltfläche <Icon name='chevron-circle-up' />{' '}
						können Sie das Kontrollfeld dann wieder vollständig einblenden.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
Component.defaultProps = {
	showModalMenu: () => {}
};
