maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
  container: "map",
  style: "streets-v2",
  center: listing.geometry.coordinates, // [lng, lat]
  zoom: 15,
});

if (listing && listing.geometry && listing.geometry.coordinates) {
  const marker = new maptilersdk.Marker({
    color: "#44444",
    draggable: false,
  })
    .setLngLat(listing.geometry.coordinates)
    .addTo(map);
} else {
  console.error("Coordinates not found in listing object");
}
map.on("styleimagemissing", (e) => {
  console.warn(`Missing image: ${e.id}`);
});
