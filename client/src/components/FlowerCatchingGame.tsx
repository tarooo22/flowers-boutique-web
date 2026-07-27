'use client';
import { useState, useEffect, useRef } from 'react';

interface Flower {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

interface BasketPosition {
  x: number;
}

const FLOWER_EMOJIS = ['🌹', '🌷', '🌸', '🌼', '🌻', '💐'];
const GAME_WIDTH = 300;
const GAME_HEIGHT = 400;
const BASKET_WIDTH = 50;
const BASKET_HEIGHT = 40;
const FLOWER_SIZE = 30;

export default function FlowerCatchingGame() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [basketPos, setBasketPos] = useState<BasketPosition>({ x: GAME_WIDTH / 2 - BASKET_WIDTH / 2 });
  const [score, setScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile
  useEffect(() => {
    setIsMobile(/mobile|android|iphone|ipad|tablet/i.test(navigator.userAgent.toLowerCase()));
  }, []);

  // Handle mouse/touch movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameRef.current || isMobile) return;
      const rect = gameRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - BASKET_WIDTH / 2;
      setBasketPos({
        x: Math.max(0, Math.min(x, GAME_WIDTH - BASKET_WIDTH)),
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!gameRef.current || !isMobile) return;
      const rect = gameRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left - BASKET_WIDTH / 2;
      setBasketPos({
        x: Math.max(0, Math.min(x, GAME_WIDTH - BASKET_WIDTH)),
      });
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      } else {
        window.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isMobile]);

  // Spawn flowers
  useEffect(() => {
    spawnLoopRef.current = setInterval(() => {
      const newFlower: Flower = {
        id: nextIdRef.current++,
        x: Math.random() * (GAME_WIDTH - FLOWER_SIZE),
        y: -FLOWER_SIZE,
        emoji: FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)],
      };
      setFlowers((prev) => [...prev, newFlower]);
    }, 600);

    return () => {
      if (spawnLoopRef.current) clearInterval(spawnLoopRef.current);
    };
  }, []);

  // Game loop - move flowers and check collisions
  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      setFlowers((prev) => {
        const updated = prev
          .map((f) => ({ ...f, y: f.y + 5 }))
          .filter((f) => f.y < GAME_HEIGHT);

        // Check collision with basket
        const caught = updated.filter((f) => {
          const flowerCenterX = f.x + FLOWER_SIZE / 2;
          const flowerCenterY = f.y + FLOWER_SIZE / 2;

          return (
            flowerCenterX >= basketPos.x &&
            flowerCenterX <= basketPos.x + BASKET_WIDTH &&
            flowerCenterY >= GAME_HEIGHT - BASKET_HEIGHT &&
            flowerCenterY <= GAME_HEIGHT
          );
        });

        if (caught.length > 0) {
          setScore((s) => s + caught.length);
          return updated.filter((f) => !caught.includes(f));
        }

        return updated;
      });
    }, 50);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [basketPos]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800 mb-2">AI ქმნის თქვენს თაიგულს...</p>
        <p className="text-sm text-gray-600">დაჭერილი ყვავილები: {score}</p>
      </div>

      {/* Game Area */}
      <div
        ref={gameRef}
        className="relative bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg overflow-hidden border-2 border-blue-200"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Falling Flowers */}
        {flowers.map((flower) => (
          <div
            key={flower.id}
            className="absolute text-3xl"
            style={{
              left: flower.x,
              top: flower.y,
              width: FLOWER_SIZE,
              height: FLOWER_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {flower.emoji}
          </div>
        ))}

        {/* Basket */}
        <div
          className="absolute bottom-2 bg-orange-400 rounded-full flex items-center justify-center text-2xl transition-all"
          style={{
            left: basketPos.x,
            width: BASKET_WIDTH,
            height: BASKET_HEIGHT,
          }}
        >
          🧺
        </div>
      </div>

      <p className="text-xs text-gray-500">
        {isMobile ? 'სვაიპი მარცხნივ/მარჯვნივ' : 'გადაიტანე თაგუნი'}
      </p>
    </div>
  );
}
