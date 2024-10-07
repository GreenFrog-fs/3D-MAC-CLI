import { useEffect, useState } from "react";
import useUserStore from "../../stores/userStore";
import PositionWrapper3D from "./PositionWrapper3D";
import UserModel3D from "./UserModel3D";

export default function User3D({ position, prev }) {
  const { avatar_src } = useUserStore();
  const [currentPosition, setCurrentPosition] = useState(prev);
  const [angle, setAngle] = useState(0);

  function calculateAngle(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    return angle;
  }

  useEffect(() => {
    if (isNaN(prev[0]) || isNaN(prev[1])) {
      setCurrentPosition(position);
    } else {
      let frame = 0;
      const transitionFrames = 60;
      const startPosition = [...prev];
      const animate = () => {
        frame++;
        const lerpPosition = [
          startPosition[0] +
            ((position[0] - startPosition[0]) * frame) / transitionFrames,
          startPosition[1] +
            ((position[1] - startPosition[1]) * frame) / transitionFrames,
        ];
        setCurrentPosition(lerpPosition);
        if (prev[0] != position[0] && prev[1] != position[1]) {
          setAngle(calculateAngle(prev[0], prev[1], position[0], position[1]));
        }
        if (frame < transitionFrames) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [position, prev]);

  return (
    <PositionWrapper3D
      position={[currentPosition[0], currentPosition[1]]}
      angle={(Math.PI * 3) / 2 + angle}
    >
      <UserModel3D
        avatar_src={avatar_src}
        walk={prev[0] != position[0] && prev[1] != position[1]}
      />
    </PositionWrapper3D>
  );
}
