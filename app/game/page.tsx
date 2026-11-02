"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const W = 400;
const H = 700;
const SPEED = 220;
const JOY_RADIUS = 60;
const ACTION = { x: W - 70, y: H - 90, r: 40 };

type Zone = {
  name: string;
  route: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: number;
};

const zones: Zone[] = [
  { name: "MENS", route: "/mens", x: 40, y: 60, w: 320, h: 220, color: 0x1e3a8a },
  { name: "WOMENS", route: "/womens", x: 40, y: 360, w: 320, h: 220, color: 0x9d174d },
];

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let game: { destroy: (removeCanvas: boolean) => void } | null = null;
    let cancelled = false;

    (async () => {
      const Phaser = (await import("phaser")).default;
      if (cancelled || !containerRef.current) return;

      class ShopScene extends Phaser.Scene {
        player!: Phaser.GameObjects.Rectangle;
        prompt!: Phaser.GameObjects.Text;
        cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        wasd!: Record<string, Phaser.Input.Keyboard.Key>;
        enterKey!: Phaser.Input.Keyboard.Key;

        joyBase!: Phaser.GameObjects.Arc;
        joyKnob!: Phaser.GameObjects.Arc;
        actionBtn!: Phaser.GameObjects.Arc;
        actionText!: Phaser.GameObjects.Text;

        joyActive = false;
        joyPointerId = -1;
        joyOriginX = 0;
        joyOriginY = 0;
        joyDx = 0;
        joyDy = 0;
        currentZone: Zone | null = null;

        constructor() {
          super("ShopScene");
        }

        create() {
          zones.forEach((z) => {
            this.add.rectangle(z.x + z.w / 2, z.y + z.h / 2, z.w, z.h, z.color, 0.6);
            this.add.text(z.x + 16, z.y + 12, z.name, { fontSize: "22px", color: "#ffffff" });
          });

          this.player = this.add.rectangle(W / 2, 320, 36, 36, 0xfacc15);

          // Joystick visuals (touch karne par dikhenge)
          this.joyBase = this.add.circle(0, 0, JOY_RADIUS, 0xffffff, 0.15).setVisible(false);
          this.joyKnob = this.add.circle(0, 0, 26, 0xffffff, 0.45).setVisible(false);

          // Action button (zone mein hone par dikhega)
          this.actionBtn = this.add
            .circle(ACTION.x, ACTION.y, ACTION.r, 0x22c55e, 0.75)
            .setVisible(false);
          this.actionText = this.add
            .text(ACTION.x, ACTION.y, "ENTER", { fontSize: "14px", color: "#ffffff" })
            .setOrigin(0.5)
            .setVisible(false);

          this.prompt = this.add.text(16, H - 40, "", {
            fontSize: "16px",
            color: "#ffffff",
          });

          // Keyboard (laptop ke liye)
          this.cursors = this.input.keyboard!.createCursorKeys();
          this.wasd = this.input.keyboard!.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key>;
          this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

          // Multi-touch: ek ungli joystick par, dusri action button par
          this.input.addPointer(2);
          this.input.on("pointerdown", (p: Phaser.Input.Pointer) => this.onDown(p));
          this.input.on("pointermove", (p: Phaser.Input.Pointer) => this.onMove(p));
          this.input.on("pointerup", (p: Phaser.Input.Pointer) => this.onUp(p));
        }

        isOnAction(p: Phaser.Input.Pointer) {
          return Phaser.Math.Distance.Between(p.x, p.y, ACTION.x, ACTION.y) < ACTION.r + 20;
        }

        enterZone() {
          if (this.currentZone) router.push(this.currentZone.route);
        }

        onDown(p: Phaser.Input.Pointer) {
          // Action button tap
          if (this.currentZone && this.isOnAction(p)) {
            this.enterZone();
            return;
          }
          // Left half par joystick shuru
          if (!this.joyActive && p.x < W / 2) {
            this.joyActive = true;
            this.joyPointerId = p.id;
            this.joyOriginX = p.x;
            this.joyOriginY = p.y;
            this.joyBase.setPosition(p.x, p.y).setVisible(true);
            this.joyKnob.setPosition(p.x, p.y).setVisible(true);
          }
        }

        onMove(p: Phaser.Input.Pointer) {
          if (!this.joyActive || p.id !== this.joyPointerId) return;

          let dx = p.x - this.joyOriginX;
          let dy = p.y - this.joyOriginY;
          const len = Math.hypot(dx, dy);
          if (len > JOY_RADIUS) {
            dx = (dx / len) * JOY_RADIUS;
            dy = (dy / len) * JOY_RADIUS;
          }
          this.joyDx = dx / JOY_RADIUS;
          this.joyDy = dy / JOY_RADIUS;
          this.joyKnob.setPosition(this.joyOriginX + dx, this.joyOriginY + dy);
        }

        onUp(p: Phaser.Input.Pointer) {
          if (p.id !== this.joyPointerId) return;
          this.joyActive = false;
          this.joyPointerId = -1;
          this.joyDx = 0;
          this.joyDy = 0;
          this.joyBase.setVisible(false);
          this.joyKnob.setVisible(false);
        }

        update(_time: number, delta: number) {
          const secs = delta / 1000;

          // Keyboard input
          let kx = 0;
          let ky = 0;
          if (this.cursors.left.isDown || this.wasd.A.isDown) kx -= 1;
          if (this.cursors.right.isDown || this.wasd.D.isDown) kx += 1;
          if (this.cursors.up.isDown || this.wasd.W.isDown) ky -= 1;
          if (this.cursors.down.isDown || this.wasd.S.isDown) ky += 1;

          // Joystick + keyboard dono mix
          const vx = Phaser.Math.Clamp(kx + this.joyDx, -1, 1);
          const vy = Phaser.Math.Clamp(ky + this.joyDy, -1, 1);

          this.player.x += vx * SPEED * secs;
          this.player.y += vy * SPEED * secs;

          // Screen ke bahar na jaye
          this.player.x = Phaser.Math.Clamp(this.player.x, 20, W - 20);
          this.player.y = Phaser.Math.Clamp(this.player.y, 20, H - 20);

          // Zone check
          this.currentZone =
            zones.find(
              (z) =>
                this.player.x > z.x &&
                this.player.x < z.x + z.w &&
                this.player.y > z.y &&
                this.player.y < z.y + z.h
            ) ?? null;

          if (this.currentZone) {
            this.actionBtn.setVisible(true);
            this.actionText.setVisible(true);
            this.prompt.setText(`${this.currentZone.name} mein jaane ke liye ENTER dabao`);
            if (Phaser.Input.Keyboard.JustDown(this.enterKey)) this.enterZone();
          } else {
            this.actionBtn.setVisible(false);
            this.actionText.setVisible(false);
            this.prompt.setText("Zone mein chalo, phir ENTER dabao");
          }
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: W,
        height: H,
        backgroundColor: "#111111",
        scene: ShopScene,
        input: { activePointers: 3 },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: W,
          height: H,
        },
      });
    })();

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, [router]);

  return (
    <main className="flex flex-col items-center p-2 gap-2">
      <div
        ref={containerRef}
        style={{ touchAction: "none", width: "100%", maxWidth: 400 }}
      />
    </main>
  );
}