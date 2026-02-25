import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  life: number;
};

const CursorTrail = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const handleMouseMove = (e: MouseEvent) => {
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
      });

      // limit points for performance
      if (pointsRef.current.length > 40) {
        pointsRef.current.shift();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pointsRef.current.forEach((p, i) => {
        p.life -= 0.03;

        // bubble
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.life})`;
        ctx.fill();

        // line to next point
        if (pointsRef.current[i + 1]) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(
            pointsRef.current[i + 1].x,
            pointsRef.current[i + 1].y
          );
          ctx.strokeStyle = `rgba(56, 189, 248, ${p.life})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // remove dead points
      pointsRef.current = pointsRef.current.filter((p) => p.life > 0);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default CursorTrail;





