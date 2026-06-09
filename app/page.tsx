"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Beer,
  CalendarDays,
  MapPin,
  Music,
  Sparkles,
  Utensils,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#111713] text-white">
      <Hero />

      <section id="carta" className="relative px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#c45f2c_0%,transparent_30%)] opacity-10" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f2b36d]">
              Barra de fiestas
            </p>

            <h2 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Lo que se pide entre verbena y verbena.
            </h2>

            <p className="mt-5 text-xl text-zinc-300">
              Bebidas rápidas, bocatas, música y ambiente de pueblo hasta que
              se apaguen las luces del frontón.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <ProductCard
              icon={<Beer />}
              title="Cubatas"
              price="5€"
              text="Ron, ginebra, whisky, vodka y combinados clásicos."
              tag="Última ronda"
            />
            <ProductCard
              icon={<Beer />}
              title="Cerveza"
              price="2€"
              text="Fría, directa y perfecta para empezar la verbena."
              tag="Bien fría"
            />
            <ProductCard
              icon={<Utensils />}
              title="Bocatas"
              price="4€"
              text="Para volver a la pista con fuerzas."
              tag="Salvavidas"
            />
          </div>
        </div>
      </section>

      <section id="info" className="px-6 py-24">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur md:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#9fd08f]">
                Paracuellos de la Vega
              </p>

              <h2 className="mt-4 text-5xl font-black md:text-7xl">
                Del 10 al 20 de agosto.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={<MapPin />}
                title="Lugar"
                text="Frontón del polideportivo"
              />
              <InfoCard
                icon={<Music />}
                title="Plan"
                text="Verbena, música y barra"
              />
              <InfoCard
                icon={<Users />}
                title="Ambiente"
                text="Peñas, pueblo y visitantes"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen px-6 py-8">
      <MountainBackground />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f2b36d]/30 bg-[#c45f2c]/20 px-4 py-2 text-sm font-black text-[#ffd7a3] backdrop-blur">
              <Sparkles size={16} />
              Barra en el frontón · Fiestas 2026
            </div>

            <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-[#9fd08f]">
              Paracuellos de la Vega
            </p>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.88] tracking-tight md:text-8xl xl:text-9xl">
              Los últimos
              <span className="block text-[#f2a14a]">del frontón</span>
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-zinc-200 md:text-2xl">
              La barra que se monta donde bota la pelota, suena la verbena y
              siempre queda alguien pidiendo la última.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#carta"
                className="rounded-full bg-[#c45f2c] px-8 py-4 text-center text-lg font-black text-white shadow-[0_0_45px_rgba(196,95,44,0.45)] transition hover:-translate-y-1 hover:bg-[#e0783d]"
              >
                Ver carta
              </a>

              <a
                href="#info"
                className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-center text-lg font-black backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-[#111713]"
              >
                Fechas y lugar
              </a>
            </div>

            <p className="mt-6 text-sm font-bold text-zinc-400">
              Atrapa las pelotas del frontón
            </p>
          </div>

          <FrontonScene />
        </div>
      </div>
    </section>
  );
}

function MountainBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#18261d_0%,#111713_55%,#0d100d_100%)]" />

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#c45f2c]/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#315f3a]/30 blur-3xl" />

      <div className="mountain mountain-back" />
      <div className="mountain mountain-mid" />
      <div className="mountain mountain-front" />

      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#111713] to-transparent" />
    </div>
  );
}

function FrontonScene() {
  const [activeBall, setActiveBall] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOpen: false,
  });

  useEffect(() => {
    const openingDate = new Date("2026-08-10T00:00:00");

    const updateCountdown = () => {
      const now = new Date();
      const difference = openingDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isOpen: true,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOpen: false,
      });
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const hitBall = (ball: string) => {
    setActiveBall(ball);
    window.setTimeout(() => setActiveBall(null), 850);
  };

  return (
    <div className="relative min-h-[560px]">
      <InteractiveBall
        className="pelota pelota-1"
        active={activeBall === "uno"}
        label="¡Pam!"
        onHit={() => hitBall("uno")}
      />

      <InteractiveBall
        className="pelota pelota-2"
        active={activeBall === "dos"}
        label="¡Bote!"
        onHit={() => hitBall("dos")}
      />

      <InteractiveBall
        className="pelota pelota-3"
        active={activeBall === "tres"}
        label="¡Última!"
        onHit={() => hitBall("tres")}
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl">
        <div className="relative rounded-[2.5rem] border border-white/10 bg-[#d7c0a3] p-5 shadow-2xl shadow-black/50">
          <div className="fronton-photo relative overflow-hidden rounded-[2rem] border-[6px] border-[#243227] bg-[#174438]">
            <div className="fronton-fence" />

            <div className="fronton-side-wall" />
            <div className="fronton-corner-shadow" />

            <div className="fronton-numbers">
              {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                <span key={number}>{number}</span>
              ))}
            </div>

            <div className="fronton-posts">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="relative z-20 flex min-h-[360px] flex-col justify-between p-8">
              <div className="max-w-md rounded-[2rem] bg-[#174438]/70 p-5 backdrop-blur-sm">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#f3d2a3]">
                  Frontón municipal
                </p>

                <h2 className="mt-3 max-w-sm text-5xl font-black leading-none text-white md:text-6xl">
                  {timeLeft.isOpen ? "Barra abierta" : "Cuenta atrás"}
                </h2>
              </div>

              <div className="max-w-lg rounded-3xl border border-white/10 bg-black/40 p-5 text-white shadow-2xl backdrop-blur">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f2b36d]">
                  Del 10 al 20 de agosto
                </p>

                {timeLeft.isOpen ? (
                  <p className="mt-2 text-2xl font-black">
                    Si queda música, queda barra.
                  </p>
                ) : (
                  <>
                    <p className="mt-2 text-2xl font-black">
                      Todavía no hemos abierto.
                    </p>

                    <div className="mt-4 grid grid-cols-4 gap-2">
                      <CountdownBox label="Días" value={timeLeft.days} />
                      <CountdownBox label="Horas" value={timeLeft.hours} />
                      <CountdownBox label="Min" value={timeLeft.minutes} />
                      <CountdownBox label="Seg" value={timeLeft.seconds} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="fronton-floor relative mx-auto mt-0 h-40 overflow-hidden rounded-b-[2rem] bg-[#b96858]">
            <div className="absolute left-0 top-8 h-[3px] w-full bg-white/80" />
            <div className="absolute left-0 bottom-12 h-[3px] w-full bg-white/80" />
            <div className="absolute left-16 top-0 h-full w-[3px] bg-white/60" />
            <div className="absolute right-16 top-0 h-full w-[3px] bg-white/60" />
            <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-white/75" />

            <div className="absolute inset-x-0 bottom-5 text-center text-xs font-black uppercase tracking-[0.3em] text-white/60">
              Polideportivo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractiveBall({
  className,
  active,
  label,
  onHit,
}: {
  className: string;
  active: boolean;
  label: string;
  onHit: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onHit}
      onMouseEnter={onHit}
      className={`${className} ${active ? "pelota-active" : ""}`}
      aria-label="Pelota interactiva de frontón"
    >
      <span>{label}</span>
    </button>
  );
}

function CountdownBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center">
      <p className="text-2xl font-black text-white">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#f2b36d]">
        {label}
      </p>
    </div>
  );
}

function ProductCard({
  icon,
  title,
  price,
  text,
  tag,
}: {
  icon: ReactNode;
  title: string;
  price: string;
  text: string;
  tag: string;
}) {
  return (
    <div className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-2 hover:bg-white/10">
      <div className="mb-8 flex items-start justify-between">
        <div className="rounded-2xl bg-[#c45f2c] p-4 text-white">
          {icon}
        </div>

        <span className="rounded-full bg-[#9fd08f] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#102116]">
          {tag}
        </span>
      </div>

      <h3 className="text-3xl font-black">{title}</h3>
      <p className="mt-3 min-h-14 text-zinc-300">{text}</p>

      <div className="mt-8 flex items-end justify-between">
        <p className="text-5xl font-black text-[#f2a14a]">{price}</p>
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
          Barra
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#111b14] p-5">
      <div className="mb-4 text-[#f2a14a]">{icon}</div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-2 text-zinc-300">{text}</p>
    </div>
  );
}