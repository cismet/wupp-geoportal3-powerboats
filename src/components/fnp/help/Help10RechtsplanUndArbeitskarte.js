import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='RechtsplanUndArbeitskarte'
			sectionTitle='Rechtsplan und Arbeitskarte'
			sectionBsStyle='warning'
			sectionContent={
				<div>
					<p>
						Der Wuppertaler Flächenutzungsplan (FNP) vom 17.01.2005 wird standardmäßig
						dargestellt (Rechtsplan). Mithilfe der Schaltfläche (random Switch) ist ein
						Wechsel zur Arbeitskarte möglich, welche die fortgeschriebenen
						Hauptnutzungen des Wuppertaler FNPs visualisiert; dies entspricht keiner
						Neuaufstellung des FNPs. Ein erneuter Klick auf (random Switch) führt zurück
						zur Darstellung des Rechtsplans.
					</p>
					<p>
						<strong>Rechtsplan</strong>
					</p>
					<p>
						Der Rechtsplan stellt den FNP dar, welcher am 17.01.2005 Rechtskraft erlangt
						hat. Dieser löst den zweiten Wuppertaler FNP vom 30.06.1967 in großen Teilen
						ab. (Rücksprache zu Bernd Heimann bzgl. der nicht-genehmigten Flächen
						halten) Nach §5 Abs. 1 BauGB besteht die Aufgabe des FNPs darin, für
						&quot;das gesamte Gemeindegebiet die sich aus der beabsichtigten
						städtebaulichen Entwicklung ergebende Art der Bodennutzung&quot; (z.B.
						Wohnbaufläche oder gewerbliche Baufläche) &quot;nach den vorhersehbaren
						Bedürfnissen der Gemeinde in den Grundzügen darzustellen&quot;. Der
						Flächennutzungsplan (vorbereitende Bauleitplanung) und die aus ihm zu
						entwickelnden Bebauungspläne (verbindliche Bauleitplanung) sind Instrumente
						der kommunalen Bauleitplanung.
					</p>
					<p>
						<strong>Arbeitskarte</strong>
					</p>
					<p>
						Innerhalb der Arbeitskarte wird ein informeller FNP-Auszug geboten. Dabei
						werden die Hauptnutzungen des FNPs vom 17.01.2005 aufgrund von
						rechtskräftigen
					</p>
					<ul>
						<li>Änderungsverfahren gem. §2 ff. BauGB und</li>
						<li>Berichtigungen gem. §13a BauGB</li>
					</ul>
					<p>
						fortgeschrieben. Die ausschließliche Einarbeitung dieser Änderungsverfahren
						bzw. Berichtigungen in die Hauptnutzungen des FNPs entspricht keiner
						Neuaufstellung. Die Arbeitskarte bietet daher dem Nutzer eine komfortable
						Möglichkeit zum Einstieg in den Themenkomplex des Wuppertaler FNPs.
					</p>
				</div>
			}
		/>
	);
};
export default Component;