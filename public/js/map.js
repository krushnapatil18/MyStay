document.addEventListener('DOMContentLoaded', function() {
    // console.log('Map token:', mapToken);
    // console.log('Coordinates:', coordinates);
    
    if (!mapToken) {
        console.error('Mapbox token is missing!');
        return;
    }
    
    // Check if coordinates exist and are valid
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
        console.error('Invalid or missing coordinates:', coordinates);
        // Show a message to the user that map is not available
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = '<div style="height: 400px; width: 100%; border-radius: 10px; margin-top: 10px; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; border: 2px dashed #dee2e6;"><p style="color: #6c757d; margin: 0;">Map not available for this location</p></div>';
        }
        return;
    }
    
    // Validate coordinate values
    const [lng, lat] = coordinates;
    if (typeof lng !== 'number' || typeof lat !== 'number' || 
        lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        console.error('Invalid coordinate values:', coordinates);
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = '<div style="height: 400px; width: 100%; border-radius: 10px; margin-top: 10px; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; border: 2px dashed #dee2e6;"><p style="color: #6c757d; margin: 0;">Invalid location coordinates</p></div>';
        }
        return;
    }
    
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]
        zoom: 9, // starting zoom
        style: 'mapbox://styles/mapbox/streets-v12' // Add a default style
    });

    const marker = new mapboxgl.Marker({color: 'red'})
        .setLngLat(coordinates)
        .addTo(map);
        
});

