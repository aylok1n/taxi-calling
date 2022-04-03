import { AppBar, Toolbar, Typography } from '@mui/material';
import { useEffect } from 'react';
import '../index.css'
import { useAppDispatch } from '../redux/hooks';
import { setPosition } from '../redux/userPositionSlice';
import Form from "./Form";
import Map from './Map';


function App() {

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          dispatch(setPosition({ lat: latitude, lng: longitude }))
        },
        null,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
    }
  }, [])

  return (
    <div className="App">
      <AppBar sx={{ alignItems: "center", position: 'static', marginBottom: 2 }}>
        <Toolbar sx={{ width: '100%', maxWidth: 1000 }} >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Детали заказа
          </Typography>
        </Toolbar>
      </AppBar>
      <Form />
      <Map />
    </div>
  );
}

export default App;
