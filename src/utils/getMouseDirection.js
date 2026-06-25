// utils/getMouseDirection.js

export const getMouseDirection = (event, element) => {
  if (!element) return null;

  const rect = element.getBoundingClientRect();

  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;

  const angle = Math.atan2(y, x) * (180 / Math.PI);

  if (angle >= -45 && angle < 45) {
    return "right";
  }

  if (angle >= 45 && angle < 135) {
    return "bottom";
  }

  if (angle >= -135 && angle < -45) {
    return "top";
  }

  return "left";
};