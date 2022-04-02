import { Autocomplete, AutocompleteInputChangeReason, FormControl, FormHelperText, Input, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";


let onChangeTimeout: NodeJS.Timeout | null = null
const Form = () => {
    // form value
    const [value, setValue] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [autoCompleteOptions, setAutoCompleteOptions] = useState([])
    //redux stores
    const addressStore = useAppSelector((state) => state.address)
    const { lng, lat } = useAppSelector(store => store.userPosition)

    useEffect(() => {
        if (addressStore?.address) setValue(addressStore.address)
    }, [addressStore])



    const onChangeTextHandrler = (event: React.SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
        if (onChangeTimeout) clearTimeout(onChangeTimeout)
        setInputValue(value)
        if (reason === 'input') onChangeTimeout = setTimeout(() => {
            axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng || ''},${lat || ''}%${value}.json?access_token=${mapboxgl.accessToken}`)
                .then(res => console.log(res.data))
        }, 300)
    }

    return (
        <FormControl style={{ width: 300, marginBottom: 50 }}>

            <Autocomplete
                value={value}
                // onChange={(_,value) => }
                inputValue={inputValue}
                onInputChange={onChangeTextHandrler}
                aria-describedby="helper-text"
                options={autoCompleteOptions}
                sx={{ width: 300 }}
                renderInput={(params: any) => <TextField {...params} label={"Откуда"} />}
            />
            <FormHelperText id="helper-text">Также можете поставить метку на карте.</FormHelperText>
        </FormControl>
    )
}

export default Form