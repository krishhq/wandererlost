mapboxgl.accessToken=mapToken;
const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map', // container ID
    center: coordinates || [174.77557, -41.28664], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});
console.log(coordinates);

const marker= new mapboxgl.Marker({color:"red"}).setLngLat(coordinates || [174.77557, -41.28664]).addTo(map);