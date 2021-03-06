import React, {useEffect} from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  HeatmapLayer
} from "@react-google-maps/api";

import {useAppContext} from "../../utils/GlobalState";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import bigfoot from "./bigfoot.png";
import {getHeatmapData, getFakeHeatmapData} from '../../utils/API.js'
import {Redirect} from "react-router-dom";
//reducer actions
import {STORE_HEATMAP_DATA} from '../../utils/actions';

const libraries = ["places","visualization"] ;
const mapContainerStyle = {
  height: "94vh",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true
};
const center = {
  lat: 33.6846,
  lng: -117.8265049
};

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBzMU8Sce5illSkT0uXrZgEN7rqAoW1hNI",
    libraries
  });
  const [state, dispatch] = useAppContext();
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [location, setLocation] = React.useState({
    show: false,
    lat: "",
    lgn: ""
  });

  console.log(state.heatmap)

  useEffect(()=> {
    if(state?.location) panTo(state.location);
    getFakeHeatmapData(500).then(({data})=> {
      dispatch({type:STORE_HEATMAP_DATA, payload: data})
    })
  }, [state?.location])

  const onMapClick = React.useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date()
      }
    ]);
  }, []);

  // const renderLocateBtn = () => <button
  //     className="locate"
  //     onClick={() => {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //            setLocation({
  //              lat: position.coords.latitude,
  //              lng: position.coords.longitude,
  //              show: true
  //            });
  //          panTo({
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude,
  //           })
  //           ;
  //         },
  //         () => null
  //       );
  //     }}
  //   >
  //     <img src="/compass.svg" alt="compass" />
  //   </button>

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(11);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <>
    {!state.user ? <Redirect to="/auth/login"/> : ""}
    <div>
      <h1>
        {/* 
        Anti-Social Social{" "} */}

        <div className="container">
          {/* <img src="./DrakeCartoon2.jpg" style={{ maxWidth: "70px" }}></img>
          <span role="img" aria-label="tent" style={{ left: "10px" }}>
            🧑🏻‍🤝‍🧑🏻🧑🏽‍🤝‍🧑🏽🧑🏻‍🤝‍🧑🏻🧑🏽‍🤝‍🧑🏽🧑🏾‍🤝‍🧑🏾
          </span> */}
          {/* <span
            role="img"
            aria-label="tent"
            style={{ top: "20px", left: "-192px" }}
          >
            🧑🏼‍🤝‍🧑🏼🧑🏻‍🤝‍🧑🏽🧑🏻‍🤝‍🧑🧑🏻‍🤝‍🧑
          </span> */}
        </div>
      </h1>

      {/* {renderLocateBtn()} */}
      <Marker
        key={`${location.lat}-${location.lng}`}
        position={{ lat: location.lat, lng: location.lng }}
        // onClick={() => {
        //   setSelected(marker);
        // }}
        icon={{
          url: `https://image.flaticon.com/icons/svg/2750/2750711.svg`,
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15),
          scaledSize: new window.google.maps.Size(30, 30)
        }}
      />
      {/* <Search panTo={panTo} /> */}

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={12.5}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        <HeatmapLayer
          data={state.heatmap.map(
            (coord) => new window.google.maps.LatLng(coord)
          )}
        />
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
            icon={{
              url: `https://image.flaticon.com/icons/svg/2750/2750711.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30)
            }}
          />
        ))}
        {/*from state check if current position lat/long then use that state in marker position */}
        {state.location && (
          <Marker
            key={`${state.location.lat}-${state.location.lng}`}
            position={{ lat: state.location.lat, lng: state.location.lng }}
            // onClick={() => {
            //   setSelected(marker);
            // }}
            icon={{
              url: bigfoot,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30)
            }}
          />
        )}
        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>
                <span role="img" aria-label="Prohibited">
                  <img
                    src="./DrakeCartoon2.jpg"
                    style={{ maxWidth: "70px" }}
                  ></img>{" "}
                 
                </span>{" "}
               
                <img
                  src={require("./CasualPeople.jpg")}
                  style={{ maxWidth: "90px" }}
                ></img>
              </h2>
              <p>Spotted {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
    </>
  );
};

// function Search({ panTo }) {
//   const {
//     ready,
//     value,
//     suggestions: { status, data },
//     setValue,
//     clearSuggestions
//   } = usePlacesAutocomplete({
//     requestOptions: {
//       location: { lat: () => 43.6532, lng: () => -79.3832 },
//       radius: 100 * 1000
//     }
//   });

//   // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

//   const handleInput = (e) => {
//     setValue(e.target.value);
//   };

//   const handleSelect = async (address) => {
//     setValue(address, false);
//     clearSuggestions();

//     try {
//       const results = await getGeocode({ address });
//       const { lat, lng } = await getLatLng(results[0]);
//       panTo({ lat, lng });
//     } catch (error) {
//       console.log("😱 Error: ", error);
//     }
//   };

//   return (
//     <div className="search">
//       <Combobox onSelect={handleSelect}>
//         <ComboboxInput
//           value={value}
//           onChange={handleInput}
//           disabled={!ready}
//           placeholder="Search your location"
//         />
//         <ComboboxPopover>
//           <ComboboxList>
//             {status === "OK" &&
//               data.map(({ id, description }) => (
//                 <ComboboxOption key={id} value={description} />
//               ))}
//           </ComboboxList>
//         </ComboboxPopover>
//       </Combobox>
//     </div>
//   );
// }
