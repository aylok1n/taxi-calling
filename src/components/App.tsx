import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import '../index.css'
import Form from "./Form";
import Map from './Map';


function App() {

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
