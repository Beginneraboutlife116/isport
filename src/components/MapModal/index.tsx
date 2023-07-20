import { useEffect, useState, MouseEvent, useRef } from 'react';
import styled from './styles.module.scss';
import { Wrapper } from '@googlemaps/react-wrapper';

type MapProps = {
	lat: number;
	lng: number;
	storeName: string;
	map?: google.maps.Map;
};

type ModalProps = {
	storeName: string;
	onClose: (event: MouseEvent<HTMLDivElement>) => void;
	lat: number;
	lng: number;
};

declare global {
	interface Window {
		google: any;
	}
}

const MapComponent = ({ lat, lng, storeName }: MapProps) => {
	const mapRef = useRef(null);
	const [map, setMap] = useState<google.maps.Map | null>(null);

	useEffect(() => {
		if (mapRef.current && !map) {
			const mapOptions = {
				center: { lat: lat, lng: lng },
				zoom: 15,
			};
			setMap(new window.google.maps.Map(mapRef.current, mapOptions));
		}
	}, [lat, lng, map]);

	return (
		<div style={{ height: '300px', width: '100%' }} ref={mapRef}>
			{map && <Marker lat={lat} lng={lng} map={map} storeName={storeName} />}
		</div>
	);
};

function Marker({ lat, lng, map, storeName }: MapProps) {
	const markerRef = useRef<google.maps.Marker | null>(null);

	useEffect(() => {
		const markerOptions = {
			position: { lat: lat, lng: lng },
			map: map,
		};

		const newMarker = new window.google.maps.Marker(markerOptions);
		markerRef.current = newMarker;

		// 標記資訊
		const infoWindowOptions = {
			content: storeName, // Info Window 的內容
		};

		const newInfoWindow = new window.google.maps.InfoWindow(infoWindowOptions);

		// 在標記上設置點擊監聽器
		newMarker.addListener('click', () => {
			newInfoWindow.open(map, newMarker);
		});

		return () => {
			if (markerRef.current) {
				markerRef.current.setMap(null);
			}
		};
	}, [lat, lng, map]);

	return null;
}

function MapModal({ lat, lng, storeName, onClose }: ModalProps) {
	const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS;

	const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
	};

	return (
		// Important! Always set the container height explicitly
		<div className={styled.container} onClick={onClose}>
			<div className={styled.container__modal} onClick={handleContentClick}>
				<h2>{storeName}</h2>
				<Wrapper apiKey={apiKey}>
					<MapComponent lat={lat} lng={lng} storeName={storeName} />
				</Wrapper>
			</div>
		</div>
	);
}

export default MapModal;
