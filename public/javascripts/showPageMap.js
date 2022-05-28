// displaying the map
mapboxgl.accessToken =
    "pk.eyJ1IjoiaWZ0ZWU5NyIsImEiOiJja3FrMXdvYnkxeDdmMnBwZXQ1MGloNWQzIn0._2k1mSb1MzX9lavu-nFpjA";
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/light-v10",
    center: campground.geometry.coordinates,
    zoom: 10,
});

map.addControl(new mapboxgl.NavigationControl());

// adding a pin/marker on the map's location
new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${campground.title}</h3><p>${campground.location}</p>`
        )
    )
    .addTo(map);
