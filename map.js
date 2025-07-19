/** @type L.Map */

const map = L.map("map", {
  center: [20, 10],
  zoom: 1.5,
  minZoom: 1.5,
  maxZoom: 4,
  maxBounds: [
    [-50, -220],
    [85, 240],
  ],
  maxBoundsViscosity: 1.0,
});

const defaultIcon = L.icon({
  iconUrl: "icons/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const hoverIcon = L.icon({
  iconUrl: "icons/marker-icon-orange.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
  maxZoom: 18,
}).addTo(map);

// Chargement du fichier JSON
fetch("morceaux.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((morceau) => {
      const popupContent = `
        <strong>${morceau.titre} - ${morceau.langue}</strong><br>
        <audio id="audio-${morceau.index}" controls style="margin:1rem;">
          <source src="${morceau.audio}" type="audio/mpeg">
          Votre navigateur ne supporte pas l’audio.
        </audio><br>
        <div>${morceau.description}</div>`;

      const marker = L.marker(morceau.coordonnees, { icon: defaultIcon }).addTo(
        map,
      );
      let popupOpen = false;

      marker
        .bindPopup(popupContent)
        .on("popupopen", () => {
          popupOpen = true;
          marker.setIcon(hoverIcon);
          const audio = document.getElementById(`audio-${morceau.index}`);
          if (audio) audio.volume = 0.5;
        })
        .on("popupclose", () => {
          popupOpen = false;
          marker.setIcon(defaultIcon);
        })
        .on("mouseover", () => {
          marker.setIcon(hoverIcon);
        })
        .on("mouseout", () => {
          if (!popupOpen) {
            marker.setIcon(defaultIcon);
          }
        });
    });
  })
  .catch((error) => {
    console.error("Erreur :", error);
  });
