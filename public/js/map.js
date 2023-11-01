mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 8, // starting zoom
});
    
const marker = new mapboxgl.Marker({ color: "grey", rotation: 0 })
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 0})
.setHTML(`<h6>${listing.title}<h6><p><i>Exact location provide after booking</i></p>`))
.addTo(map);




map.on('load', () => {
// Load an image from an external URL.
map.loadImage(
    'https://res.cloudinary.com/dfd52un8n/image/upload/v1698368830/Screenshot_2023-10-27_063407-removebg-preview_sxzwmb.png',
    (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.addImage('icon', image);

        // Add a data source containing one point feature.
        map.addSource('point', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': listing.geometry.coordinates
                        }
                    }
                ]
            }
        });

        // Add a layer to use the image to represent the data.
        map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'point', // reference the data source
            'layout': {
                'icon-image': 'icon', // reference the image
                'icon-size': 0.06  
            }
        });
    }
);
});
