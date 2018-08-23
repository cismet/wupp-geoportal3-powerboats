import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import bplaenenReducer from "./modules/bplaene";
import ehrenamtReducer from "./modules/ehrenamt";
import stadtplanReducer from "./modules/stadtplan";
import kitasReducer from "./modules/kitas";
import mappingReducer from "./modules/mapping";
import gazetteerTopicsReducer from "./modules/gazetteerTopics";
import uiStateReducer from "./modules/uiState";
import { persistReducer } from "redux-persist";
import localForage from "localforage";

const gazetteerTopicsStorageConfig = {
  key: "gazetteerTopics",
  storage: localForage
};

const ehrenamtStorageConfig = {
  key: "ehrenamtOffers",
  storage: localForage,
  whitelist: [
    "offers",
    "offersMD5",
    "globalbereiche",
    "kenntnisse",
    "zielgruppen",
    "filterX",
    "cart"
  ]
};

const stadtplanStorageConfig = {
  key: "stadtplanPOIs",
  storage: localForage,
  whitelist: [
    "pois",
    "poisMD5",
    "filter",
    "poitypes",
    "lebenslagen",
    "poiSvgSize"
  ]
};
const kitasStorageConfig = {
  key: "kitas",
  storage: localForage,
  whitelist: ["kitas", "kitasMD5", "filter", "kitaSvgSize"] //['kitas','kitasMD5']
};

const uiStateStorageConfig = {
  key: "uiState",
  storage: localForage,
  whitelist: ["applicationMenuVisible", "applicationMenuActiveKey"]
};

const appReducer = combineReducers({
  bplaene: bplaenenReducer,
  ehrenamt: persistReducer(ehrenamtStorageConfig, ehrenamtReducer),
  stadtplan: persistReducer(stadtplanStorageConfig, stadtplanReducer),
  kitas: persistReducer(kitasStorageConfig, kitasReducer),
  mapping: mappingReducer,
  uiState: persistReducer(uiStateStorageConfig, uiStateReducer),
  routing: routerReducer,
  gazetteerTopics: persistReducer(
    gazetteerTopicsStorageConfig,
    gazetteerTopicsReducer
  )
  // gazetteerTopics: gazetteerTopicsReducer, // uncomment to skip persitent gazetteer data
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_ALL") {
    Object.keys(state).forEach(key => {
      localForage.removeItem(`persist:${key}`);
    });
  }
  return appReducer(state, action);
};

export function resetAll() {
  console.log("RESET_ALL");
  return dispatch => {
    dispatch({
      type: "RESET_ALL"
    });
  };
}

export default rootReducer;
