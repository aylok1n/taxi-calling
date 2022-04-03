import { crew } from "../redux/crewsSlice"
import { useAppSelector } from "../redux/hooks"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useState } from "react";
import { IconButton, ListItemButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

const CrewCard = (crew: crew) => {
    return (
        <>
            <ListItem alignItems="center">
                <ListItemAvatar>
                    <DirectionsCarIcon style={{ fontSize: 64 }} />
                </ListItemAvatar>
                <ListItemText
                    primary={crew.car_mark + ' ' + crew.car_model}
                    secondary={
                        <>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {crew.car_color} {crew.car_number}
                            </Typography><br />
                            <span>
                                {crew.driver_phone} {crew.driver_name}
                            </span>
                        </>
                    }
                />
                <Typography
                    sx={{ display: 'inline' }}
                    component="h3"
                    variant="body2"
                    color="text.primary"
                >
                    {crew.distance} M
                </Typography>
                <ArrowForwardIosIcon />
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    )
}


const Crews = () => {
    const [show, setShow] = useState(true)

    const { crews } = useAppSelector(store => store.crews)

    if (!crews.length) return null
    if (show) return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', overflow: 'scroll' }} >
            <div style={{ justifyContent: 'end', height: 50, width: '100%' }}>
                <IconButton onClick={() => setShow(false)} >
                    <CloseIcon />
                </IconButton>
            </div>

            {crews.map((crew: crew) => <CrewCard key={crew.lat + '_' + crew.lon + '_' + Math.random()} {...crew} />)}
        </List >
    )
    else return (
        <div style={{ alignItems: 'start', height: 50 }}>
            <IconButton onClick={() => setShow(true)} >
                <MenuIcon />
            </IconButton>
        </div >
    )


}

export default Crews