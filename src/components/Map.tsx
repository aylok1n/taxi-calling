import { useRef, useEffect, useState } from 'react';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import '../index.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiYXlsb2sxbiIsImEiOiJjbDE0ZmRramswbWFrM2JtdGYwbnU2d2d3In0.QRmUHL8-H_ExM2o2p2AEBw'

export default function Map() {
    const [map, setMap] = useState<mapboxgl.Map>();
    const mapNode = useRef<HTMLDivElement>(null);
    const [center, setCenter] = useState([37.617633, 55.755820])

    //init map
    useEffect(() => {
        const node = mapNode.current;
        if (typeof window === "undefined" || node === null) return;

        navigator.geolocation.getCurrentPosition((position) => {
            const { longitude, latitude } = position.coords
            setCenter([longitude, latitude])
        })

        const mapboxMap = new mapboxgl.Map({
            container: node,
            style: "mapbox://styles/aylok1n/cl14g5yku002r14rkia9s9csi",
            accessToken: 'pk.eyJ1IjoiYXlsb2sxbiIsImEiOiJjbDE0ZmRramswbWFrM2JtdGYwbnU2d2d3In0.QRmUHL8-H_ExM2o2p2AEBw',
            center: [37.617633, 55.755820],
            zoom: 9,

        });
        setMap(mapboxMap);

        mapboxMap.on('click', onClickHandler)

        return () => {
            mapboxMap.remove();
        };
    }, []);

    useEffect(() => {
        map?.setCenter({ lng: center[0], lat: center[1] })
    }, [center])



    const onClickHandler = (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {

        if (map) new mapboxgl.Marker({ color: 'FFFF00' }).setLngLat(event.lngLat).addTo(map)

    }


    return <div ref={mapNode} id='__next' />
}
