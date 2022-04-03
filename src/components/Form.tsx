import { Autocomplete, AutocompleteChangeReason, AutocompleteInputChangeReason, Box, FormControl, FormHelperText, Input, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setAddress } from '../redux/addressSlice';
import '../index.css'

interface AutoCompleteOption {
    address: string
    subtitle?: string
    lng: number
    lat: number
}

let onChangeTimeout: NodeJS.Timeout | null = null
const Form = () => {
    // form value
    const [value, setValue] = useState<AutoCompleteOption | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<AutoCompleteOption[]>([])

    //redux stores
    const addressStore = useAppSelector((state) => state.address)
    const userPosition = useAppSelector(store => store.userPosition)

    const dispatch = useAppDispatch()

    useEffect(() => {
        const { address, lng, lat } = addressStore
        if (address && lng && lat) setValue({
            address,
            lng,
            lat
        })
    }, [addressStore])



    const onChangeTextHandrler = (event: React.SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
        if (onChangeTimeout) clearTimeout(onChangeTimeout)
        setInputValue(value)
        if (reason === 'input') onChangeTimeout = setTimeout(() => {
            axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/
                ${value}.json?
                ${(userPosition.lng && userPosition.lat) ? '&proximity=' + userPosition.lng + ',' + userPosition.lat : ''}
                &access_token=${mapboxgl.accessToken}`)
                .then(res => {
                    const features = res.data?.features
                    if (features?.length) {
                        console.log(features)
                        setAutoCompleteOptions(features.map((feature: any) => {
                            let address: string = feature.text + `${feature.address ? ', ' + feature.address : ''}`
                            const [lng, lat]: number[] = feature.center
                            return {
                                subtitle: feature.place_name,
                                address,
                                lng,
                                lat
                            }
                        }))
                    }
                })
        }, 300)

        if (reason === 'clear') dispatch(setAddress({
            address: null,
            lat: null,
            lng: null
        }))
    }

    const onSetValue = (event: React.SyntheticEvent<Element, Event>, value: AutoCompleteOption | null, reason: AutocompleteChangeReason) => {
        setValue(value)
        if (value && reason == 'selectOption') dispatch(setAddress({
            address: value.address,
            lat: value.lat,
            lng: value.lng
        }))
    }

    return (
        <FormControl style={{ width: 300, marginBottom: 50 }}>

            <Autocomplete
                value={value}
                onChange={onSetValue}
                getOptionLabel={(option) => option.address}
                inputValue={inputValue}
                onInputChange={onChangeTextHandrler}
                renderOption={(props, option) => <li {...props} className='option' key={option.lng + '_' + option.lat}>
                    <div>{option.address}</div>
                    {!!option.subtitle && <small style={{}} >
                        {option.subtitle}
                    </small>}
                </li>}
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