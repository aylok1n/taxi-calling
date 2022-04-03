import { Autocomplete, AutocompleteChangeReason, AutocompleteInputChangeReason, Box, Button, FormControl, FormHelperText, Input, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setAddress } from '../redux/addressSlice';
import '../index.css'
import Map from "./Map";
import { callTaxiMock, getСrewsMock } from '../utils'
import { setActiveCrew, setCrews } from "../redux/crewsSlice";
import Crews, { CrewCard } from "./Crews";

interface AutoCompleteOption {
    address: string
    subtitle?: string
    lng: number
    lat: number
}

let onChangeTimeout: NodeJS.Timeout | null = null
const Form = () => {
    // form value
    const [error, setError] = useState<string | null>(null)
    const [value, setValue] = useState<AutoCompleteOption | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<AutoCompleteOption[]>([])
    const [mounted, setMounted] = useState(false)
    const [loader, setLoader] = useState(false)
    //redux stores
    const addressStore = useAppSelector(state => state.address)
    const userPosition = useAppSelector(store => store.userPosition)
    const { activeCrew, crews } = useAppSelector(store => store.crews)
    const activeCrewData = crews.find(crew => crew.crew_id === activeCrew)
    const dispatch = useAppDispatch()

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        const { address, lng, lat } = addressStore
        if (address && lng && lat) setValue({
            address,
            lng,
            lat
        })
        else if (mounted) {
            setValue(null)
            setError('Адрес не найден')
        }
    }, [addressStore])

    const onChangeTextHandrler = (event: React.SyntheticEvent<Element, Event>, val: string, reason: AutocompleteInputChangeReason) => {
        if (onChangeTimeout) clearTimeout(onChangeTimeout)
        setInputValue(val)
        if (reason === 'input') onChangeTimeout = setTimeout(() => {
            const query = new URLSearchParams({
                types: 'address,poi,region',
                access_token: mapboxgl.accessToken
            })
            if (userPosition.lng && userPosition.lat) query.append("proximity", userPosition.lng + ',' + userPosition.lat)
            axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?` + query)
                .then(res => {
                    const features = res.data?.features
                    if (features?.length) {
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

        if (reason === 'clear') {
            dispatch(setAddress({
                address: null,
                lat: null,
                lng: null
            }))
            dispatch(setActiveCrew(null))
            dispatch(setCrews([]))
        }

        if (reason === 'reset' && !value) setError('Адрес не найден')
        else setError(null)
    }

    const onSetValueHandler = (event: React.SyntheticEvent<Element, Event>, value: AutoCompleteOption | null, reason: AutocompleteChangeReason) => {
        setValue(value)
        if (value && reason == 'selectOption') dispatch(setAddress({
            address: value.address,
            lat: value.lat,
            lng: value.lng
        }))
    }

    const onClickHandler = async () => {
        const now = new Date()
        if (!value || error) return setError('Адрес не найден')
        else if (activeCrewData) {
            setLoader(true)
            await callTaxiMock({
                source_time: now.toISOString().replace(/(\.\d{3})|[^\d]/g, ''),
                addresses: [
                    value
                ],
                crew_id: activeCrewData.crew_id
            })
            setLoader(false)
        }
        else {
            dispatch(setActiveCrew(null))

            setLoader(true)
            const response = await getСrewsMock({
                source_time: now.toISOString().replace(/(\.\d{3})|[^\d]/g, ''),
                addresses: [
                    value
                ]
            })

            if (response.code === 0) {
                const resultCrews = response.data.crews_info.sort((a, b) => a.distance - b.distance)
                dispatch(setActiveCrew(resultCrews[0].crew_id))
                dispatch(setCrews(resultCrews))
            }

            setLoader(false)
        }
    }

    return (
        <div className="form">
            {!!loader && <div>Идет поиск</div>}
            <div style={{
                display: 'flex',
                flexDirection: window.innerWidth < 700 ? 'column' : 'row',
                alignItems: window.innerWidth < 700 ? 'center' : 'start',
                justifyContent: activeCrewData ? 'space-between' : 'center',
                width: '100%'
            }}>
                <div>
                    <Autocomplete
                        style={{ width: 300 }}
                        isOptionEqualToValue={(option, value) => option.lat === value.lat && option.lng === value.lng}
                        value={value}
                        onChange={onSetValueHandler}
                        getOptionLabel={(option) => option.address}
                        inputValue={inputValue}
                        blurOnSelect
                        onInputChange={onChangeTextHandrler}
                        noOptionsText="Не найдено"
                        renderOption={(props, option) => <li {...props} className='option' key={option.lng + '_' + option.lat}>
                            <div>{option.address}</div>
                            {!!option.subtitle && <small style={{}} >
                                {option.subtitle}
                            </small>}
                        </li>}
                        aria-describedby="helper-text"
                        options={autoCompleteOptions}
                        sx={{ width: 300 }}
                        renderInput={(params: any) => <TextField
                            required
                            error={!!error}
                            {...params}
                            label={"Откуда"}
                            helperText={error}
                        />}
                    />
                    <FormHelperText style={{ marginBottom: 50 }} id="helper-text">Также можете поставить метку на карте.</FormHelperText>
                </div>
                {!!activeCrewData && <div style={{ width: '100%', maxWidth: 360, border: '1px solid grey', borderRadius: 10, padding: 2, marginBottom: 10 }} >
                    <strong>За вами приедет</strong>
                    <CrewCard {...activeCrewData} />
                </div>}
            </div>
            <Button
                variant="contained"
                style={{ marginBottom: 50 }}
                disabled={!!error || loader}
                onClick={onClickHandler}
            >
                {activeCrewData ? "Заказать" : 'Найти'}
            </Button>
            <div className="formBody">
                <Map />
                <Crews />
            </div>
        </div>
    )
}

export default Form