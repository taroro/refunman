export function DistanceFormat(distance) {
  if(distance < 1000) {
    return (distance).toLocaleString(navigator.language, { maximumFractionDigits: 1 }) + "m";
  } else {
    return (distance/1000).toLocaleString(navigator.language, { maximumFractionDigits: 1 }) + "km";
  }
}