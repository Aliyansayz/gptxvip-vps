export const getCameraTransform = (
  currentPoint: { x: number; y: number },
  containerWidth: number,
  containerHeight: number,
  cameraScale: number
) => {
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  const tx = centerX - currentPoint.x * cameraScale;
  const ty = centerY - currentPoint.y * cameraScale;

  return { tx, ty };
};
