import React from 'react';

const Comp = () => {
	return (
		<li>
			<strong>Luftbildkarte</strong>: (1) Kartendienst (WMS) der Stadt Wuppertal.
			Datengrundlage: <strong>True Orthophoto aus Bildflug vom 19.04.2018</strong>,
			hergestellt durch Aerowest GmbH/Dortmund, Bodenauflösung 10 cm. (True Orthophoto: Aus
			Luftbildern mit hoher Längs- und Querüberdeckung in einem automatisierten
			Bildverarbeitungsprozess berechnetes Bild in Parallelprojektion, also ohne
			Gebäudeverkippung und sichttote Bereiche.) © Stadt Wuppertal (<a
				target='_legal'
				href='https://www.wuppertal.de/geoportal/Nutzungsbedingungen/NB-GDIKOM-C_Geodaten.pdf'
			>
				NB-GDIKOM C
			</a>). (2) Kartendienste (WMS) des Regionalverbandes Ruhr (RVR). Datengrundlagen:{' '}
			<strong>Stadtplanwerk 2.0</strong> und{' '}
			<strong>Kartenschrift aus dem Stadtplanwerk 2.0</strong>. (Details s. Hintergrundkarte
			Stadtplan).
		</li>
	);
};

export default Comp;