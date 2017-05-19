export const bplanFeatureStyler = (feature) => {
  const style = {
    "color": getColorFromFeatureConsideringSelection(feature),
    "weight": 6,
    "opacity": 1.0,
    "fillColor": getColorFromFeature(feature),
    "fillOpacity": 0.3
  };
  return style;
};

export const getColorFromFeature = (feature) => {
  let color = '#ff0000';
  switch (feature.properties.status) {
    case 'rechtskräftig':
      color = "#2AFF00";
      break;
    case 'nicht rechtskräftig':
      color = "#FC0000";
      break;
    default:
      color = "#0000FF";
  }
  return color;
};


export const getColorFromFeatureConsideringSelection = (feature) => {
  if (feature.selected) {
    return '#4395FE';
  }else {
    return getColorFromFeature(feature);
  }
}


export const bplanLabeler = (feature) => {

  return "<h3 style='color:"+getColorFromFeatureConsideringSelection(feature)+";'>"+feature.properties.nummer+"</h3>";
}