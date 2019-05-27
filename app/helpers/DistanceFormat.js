export function DistanceFormat(distance) {
  return (distance/1000).toFixed(1);
  /*if(distance < 1000) {
    return (distance).toFixed(1) + "m";
  } else {
    return (distance/1000).toFixed(1) + "km";
  }*/
}