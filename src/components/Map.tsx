import { useRef, useEffect, useState } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../index.css'
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setAddress } from '../redux/addressSlice';
import { drawMarker } from '../utils';
import mapboxgl from 'mapbox-gl';
import { crew, setActiveCrew, setCrews } from '../redux/crewsSlice';

// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default

let userMarker: mapboxgl.Marker | null = null
const crewsMarkers: mapboxgl.Marker[] = []
let onClickTimeout: NodeJS.Timeout | null = null

export default function Map() {
    const [map, setMap] = useState<mapboxgl.Map>();
    const mapNode = useRef<HTMLDivElement>(null);


    //redux
    const dispatch = useAppDispatch()
    const addressStore = useAppSelector(store => store.address)
    const positionStore = useAppSelector(store => store.userPosition)
    const { crews } = useAppSelector(store => store.crews)

    useEffect(() => {
        crewsMarkers.forEach(marker => marker.remove())
        crewsMarkers.length = 0
        if (map) {
            crews.forEach((crew: crew) => {
                const marker = new mapboxgl.Marker(drawMarker("green")).setLngLat({ lat: crew.lat, lng: crew.lon }).addTo(map)
                crewsMarkers.push(marker)
            })
        }

    }, [crews])

    useEffect(() => {
        if (addressStore.address) {
            const { lng, lat } = addressStore
            createMarker({ lng, lat } as mapboxgl.LngLat)
        }
        else {
            userMarker?.remove()
            crewsMarkers.forEach(marker => marker.remove())
            crewsMarkers.length = 0
        }
    }, [addressStore])

    //init map
    useEffect(() => {
        const node = mapNode.current;
        if (typeof window === "undefined" || node === null) return;

        setMap(new mapboxgl.Map({
            container: node,
            style: "mapbox://styles/aylok1n/cl14g5yku002r14rkia9s9csi",
            accessToken: mapboxgl.accessToken,
            center: [37.617633, 55.755820],
            zoom: 14,
        }));

        return () => {
            if (onClickTimeout) clearTimeout(onClickTimeout)
            map?.remove();
        };
    }, []);

    // set map center 
    useEffect(() => {
        if (map) {
            const { lat, lng } = positionStore
            if (lat && lng) map.setCenter({ lat, lng })
            map.on('click', onClickHandler)
        }
    }, [map, positionStore])

    const createMarker = (lngLat: mapboxgl.LngLat, error: boolean = false) => {
        userMarker?.remove()
        if (map) {
            userMarker = new mapboxgl.Marker(error ? drawMarker('red', "Адрес<br/>не найден") : drawMarker("yellow"))
                .setLngLat(lngLat)
                .addTo(map)

            if (error) {
                dispatch(setAddress({
                    address: null,
                    lng: null,
                    lat: null
                }))
                dispatch(setActiveCrew(null))
                dispatch(setCrews([]))
            }
            else map.setCenter(lngLat)
        }
    }

    const onClickHandler = (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        // fix so many calls issue 
        if (onClickTimeout) return
        onClickTimeout = setTimeout(() => onClickTimeout = null, 300)

        // create user marker
        const { lng, lat } = event.lngLat
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?&types=address,poi,region&access_token=${mapboxgl.accessToken}`)
            .then(res => {
                const place = res.data.features[0]
                if (!place || Math.abs(lng - place?.center[0]) > 0.001 || Math.abs(lat - place?.center[1]) > 0.001) {
                    createMarker(event.lngLat, true)
                }
                else {
                    dispatch(setAddress({
                        address: res.data.features[0].properties.address || res.data.features[0].text,
                        lng: place.center[0],
                        lat: place.center[1]
                    }))
                }
            })
            .catch(() => createMarker(event.lngLat, true))
    }


    return <div ref={mapNode} id='__next' />
}
