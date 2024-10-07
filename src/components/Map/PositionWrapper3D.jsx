export default function PositionWrapper3D({ position, angle, children }) {
  return (
    <group position={[...position, 0]} rotation={[0, 0, angle]}>
      {children}
    </group>
  );
}
