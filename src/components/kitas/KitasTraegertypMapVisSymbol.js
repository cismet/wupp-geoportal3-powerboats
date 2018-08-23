import React from "react";
import { Icon } from "react-fa";
import { getColorForProperties } from "../../utils/kitasHelper";
import { constants as kitasConstants } from "../../redux/modules/kitas";

const KitasTraegertypMapVisSymbol = ({traegertyp}) => {
  return (
    <Icon
      style={{
        color: getColorForProperties(
          { traegertyp },
          kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP
        ),
        width: "30px",
        textAlign: "center"
      }}
      name={"circle"}
    />
  );
};

export default KitasTraegertypMapVisSymbol;
