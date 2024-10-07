export default function calculateAngle(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const deltaLonRad = toRadians(lon2 - lon1);
  const x = Math.sin(deltaLonRad) * Math.cos(lat2Rad);
  const y =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLonRad);
  const angle = Math.atan2(x, y);
  return angle;
  const b = 9;
}
