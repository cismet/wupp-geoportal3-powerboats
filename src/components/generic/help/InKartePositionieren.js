import React from 'react';
import Icon from 'components/commons/Icon';

export default () => {
  return (
    <div>
      <p>
        Um in der Karte direkt zu einer bestimmten Adresse zu gelangen, geben Sie den Anfang des
        betreffenden Straßennamens im Eingabefeld links unten ein (mindestens 2 Zeichen). In der
        inkrementellen Auswahlliste werden Ihnen passende Treffer angeboten. (Wenn Sie weitere
        Zeichen eingeben, wird der Inhalt der Auswahlliste angepasst.) Sie können auch andere
        Suchbegriffe eingeben, nämlich Stadtteil (Stadtbezirk oder Quartier), Straßenname (bei
        Straßen ohne zugeordnete Hausnummern) oder &quot;Point of Interest&quot; (interessanter Ort,
        kurz als POI bezeichnet).
      </p>
      <p>
        Durch das in der Auswahlliste vorangestellte Symbol erkennen Sie, ob es sich bei einem
        Treffer um einen{' '}
        <NW>
          <Icon name="circle" /> Stadtbezirk
        </NW>
        , ein{' '}
        <NW>
          <Icon name="pie-chart" /> Quartier
        </NW>
        , eine{' '}
        <NW>
          <Icon name="home" /> Adresse
        </NW>
        , eine{' '}
        <NW>
          <Icon name="road" /> Straße ohne Hausnummern
        </NW>
        , einen{' '}
        <NW>
          <Icon name="tag" /> POI
        </NW>
        , die{' '}
        <NW>
          <Icon name="tags" /> alternative Bezeichnung eines POI
        </NW>{' '}
        ,eine{' '}
        <NW>
          <Icon name="child" /> Kindertageseinrichtung oder eine{' '}
          <NW>
            <Icon name="graduation-cap" /> Schule
          </NW>
        </NW>{' '}
        handelt.
      </p>
      <p>
        Nach der Auswahl eines Treffers aus der Liste wird die Karte auf die zugehörige Position
        zentriert. Bei Suchbegriffen mit Punktgeometrie (Adresse, Straße, POI) wird außerdem ein
        großer Maßstab (Zoomstufe 14) eingestellt und ein Marker auf der Zielposition platziert. Bei
        Suchbegriffen mit Flächengeometrie (Stadtbezirk, Quartier) wird der Maßstab so eingestellt,
        dass die Fläche vollständig dargestellt werden kann. Zusätzlich wird der Bereich außerhalb
        dieser Fläche abgedunkelt (Spotlight-Effekt).
      </p>
      <p>
        Durch Anklicken des Werkzeugs <Icon name="times" /> links neben dem Eingabefeld können Sie
        die Suche zurücksetzen (Entfernung von Marker bzw. Abdunklung, Löschen des Textes im
        Eingabefeld).
      </p>
    </div>
  );
};
const NW = (props) => {
  return <span style={{ whiteSpace: 'nowrap' }}>{props.children}</span>;
};
