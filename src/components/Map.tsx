import { useRef, useEffect, useState } from 'react';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../index.css'
import axios from 'axios';



export default function Map() {
    const [map, setMap] = useState<mapboxgl.Map>();
    const mapNode = useRef<HTMLDivElement>(null);
    const [center, setCenter] = useState([37.617633, 55.755820])

    let userMarker: mapboxgl.Marker | null = null

    //init map
    useEffect(() => {
        const node = mapNode.current;
        if (typeof window === "undefined" || node === null) return;

        navigator.geolocation.getCurrentPosition((position) => {
            const { longitude, latitude } = position.coords
            setCenter([longitude, latitude])
        })

        setMap(new mapboxgl.Map({
            container: node,
            style: "mapbox://styles/aylok1n/cl14g5yku002r14rkia9s9csi",
            accessToken: mapboxgl.accessToken,
            zoom: 13,
        }));

        return () => {
            map?.remove();
        };
    }, []);

    // set map center 
    useEffect(() => {
        if (map) {
            map.setCenter({ lng: center[0], lat: center[1] })
            map.on('click', onClickHandler)
        }
    }, [map, center])

    const createMarker = (lngLat: mapboxgl.LngLat) => {
        if (map) {
            if (userMarker) {
                userMarker.remove()
            }
            userMarker = new mapboxgl.Marker({ color: 'yellow' })
            userMarker.setLngLat(lngLat).addTo(map)
        }
    }

    const onClickHandler = (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        // create user marker
        const { lng, lat } = event.lngLat

        createMarker(event.lngLat)

        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
            .then(res => {
                console.log(res.data)
                if (res.status === 200) {
                    const place = res.data.features[0]
                    if (place) {
                        createMarker({ lng: place.center[0], lat: place.center[1] } as mapboxgl.LngLat)
                    }
                }
            })
    }


    return <div ref={mapNode} id='__next' />
}
