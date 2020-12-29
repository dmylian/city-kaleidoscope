import { useState, useMemo, useEffect } from 'react';
import MapGL, {  Source, Layer } from 'react-map-gl';
import Switch from 'react-input-switch';

import './App.css';
import data from './features.json';

const ageFill = {
    "fill-opacity": [
        'case',
        ['has', 'start_date'],
        0.75,
        0.5
    ],
    "fill-color": [
        "case",
        ["has", "start_date"],
        [
            "interpolate",
            ["linear"],
            ["to-number", ["get", "start_date"]],
            1800,
            '#d53e4f',
            1850,
            '#f46d43',
            1900,
            '#fdae61',
            1920,
            '#fee08b',
            1950,
            '#e6f598',
            1980,
            '#abdda4',
            2000,
            '#66c2a5',
            2019,
            '#3288bd'
        ],
        'black',
    ],
};

const levelsFill = {
    "fill-opacity": 1,
    "fill-color": [
        "case",
        ["has", "building:levels"],
        [
            'interpolate',
            ['linear'],
            ["to-number", ["get", "building:levels"]],
            1,
            '#f0f9e8',
            2,
            '#ccebc5',
            3,
            '#a8ddb5',
            5,
            '#7bccc4',
            9,
            '#43a2ca',
            20,
            '#0868ac',
        ],
        'black',
    ],
};

function App() {

  const [viewport, setViewport] = useState({
    latitude: 49.842957,
    longitude: 24.031111,
    zoom: 12,
    pitch: 0,
  });

  const [value, setValue] = useState(0);
  const [showExtrusion, setShowExtrusion] = useState(0);

  const layerPaint = useMemo(() => {
      if (!value) {
          return ageFill;
      }
      return {
          ...levelsFill,
          'fill-opacity': showExtrusion ? 0 : 1
      };
  }, [value, showExtrusion]);

  useEffect(() => {
      setViewport(p => ({
          ...p,
          pitch: showExtrusion ? 70 : 0,
      }));
  }, [showExtrusion]);

  return (
    <div className="App">
        <div className="absolute ml3 mt3 pa2 z-999 bg-white sans-serif">
            <Switch value={value} onChange={setValue} />
            <Switch disabled={!value} value={showExtrusion} onChange={setShowExtrusion} />
        </div>
        <MapGL
            {...viewport}
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/light-v10"
            mapboxApiAccessToken="pk.eyJ1IjoiZGFubnktbXlsaWFuIiwiYSI6InVCQVpLU2MifQ.YnpbOBfhLx6djpOiAorE2A"
            onViewportChange={setViewport}
        >
            <Source
                type="geojson"
                data={data}
            >
                <Layer
                    id="extruded"
                    type="fill-extrusion"
                    paint={{
                        'fill-extrusion-opacity': showExtrusion,
                        "fill-extrusion-color": [
                            "case",
                            ["has", "building:levels"],
                            [
                                'interpolate',
                                ['linear'],
                                ["to-number", ["get", "building:levels"]],

                                1,
                                '#f0f9e8',
                                2,
                                '#ccebc5',
                                3,
                                '#a8ddb5',
                                5,
                                '#7bccc4',
                                9,
                                '#43a2ca',
                                20,
                                '#0868ac',
                            ],
                            'black'],
                        "fill-extrusion-height": ['*', 8, ["to-number", ["get", "building:levels"]]]
                    }}
                />
                <Layer
                    id="age-layer"
                    type="fill"
                    paint={layerPaint}
                />
            </Source>
        </MapGL>
    </div>
  );
}

export default App;
