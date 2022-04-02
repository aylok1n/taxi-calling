import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = "pk.eyJ1IjoiYXlsb2sxbiIsImEiOiJjbDE0ZmRramswbWFrM2JtdGYwbnU2d2d3In0.QRmUHL8-H_ExM2o2p2AEBw"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider >
  </React.StrictMode>,
  document.getElementById('root')
);
