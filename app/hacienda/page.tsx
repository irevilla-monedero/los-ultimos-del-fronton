"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Beer,
  Clock,
  Flame,
  Gavel,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type Drink = {
  id: number;
  name: string;
  short: string;
  price: number;
  previousPrice: number;
  min: number;
  max: number;
  trend: "up" | "down" | "stable";
  volume: number;
};

const initialDrinks: Drink[] = [
  {
    id: 1,
    name: "Ron cola",
    short: "RON",
    price: 5,
    previousPrice: 5,
    min: 4,
    max: 7,
    trend: "stable",
    volume: 82,
  },
  {
    id: 2,
    name: "Gin limón",
    short: "GIN",
    price: 5,
    previousPrice: 5,
    min: 4,
    max: 7,
    trend: "stable",
    volume: 75,
  },
  {
    id: 3,
    name: "Whisky cola",
    short: "WHS",
    price: 5,
    previousPrice: 5,
    min: 4,
    max: 7,
    trend: "stable",
    volume: 68,
  },
  {
    id: 4,
    name: "Vodka naranja",
    short: "VDK",
    price: 5,
    previousPrice: 5,
    min: 4,
    max: 7,
    trend: "stable",
    volume: 91,
  },
  {
    id: 5,
    name: "Cuba libre especial",
    short: "CUB",
    price: 5.5,
    previousPrice: 5.5,
    min: 4.5,
    max: 7.5,
    trend: "stable",
    volume: 56,
  },
];

const marketMessages = [
  "El Ron Cola se calienta en el parqué.",
  "El Gin Limón entra fuerte después de la charanga.",
  "El Whisky Cola aguanta como valor refugio.",
  "El Vodka Naranja sube por alta demanda en barra.",
  "Momento de comprar: precios en movimiento.",
  "La verbena altera el mercado de cubatas.",
  "Los últimos del frontón no recomiendan dormir.",
];

export default function HaciendaPage() {
  const [drinks, setDrinks] = useState<Drink[]>(initialDrinks);
  const [messageIndex, setMessageIndex] = useState(0);
  const [secondsToUpdate, setSecondsToUpdate] = useState(10);
  const [marketOpen, setMarketOpen] = useState(true);

  const cheapestDrink = useMemo(() => {
    return [...drinks].sort((a, b) => a.price - b.price)[0];
  }, [drinks]);

  const hottestDrink = useMemo(() => {
    return [...drinks].sort((a, b) => b.volume - a.volume)[0];
  }, [drinks]);

  useEffect(() => {
  if (!marketOpen) return;

  const countdown = window.setInterval(() => {
    setSecondsToUpdate((current) => {
      if (current <= 1) {
        updateMarket();
        return 10;
      }

      return current - 1;
    });
  }, 1000);

  return () => window.clearInterval(countdown);
}, [marketOpen]);

  const updateMarket = () => {
    setDrinks((currentDrinks) =>
      currentDrinks.map((drink) => {
        const movementOptions = [-0.5, 0, 0, 0.5, 0.5, -0.5];
        const movement =
          movementOptions[Math.floor(Math.random() * movementOptions.length)];

        const newPrice = Math.min(
          drink.max,
          Math.max(drink.min, drink.price + movement)
        );

        const newVolume = Math.min(
          100,
          Math.max(20, drink.volume + Math.floor(Math.random() * 31) - 15)
        );

        return {
          ...drink,
          previousPrice: drink.price,
          price: newPrice,
          volume: newVolume,
          trend:
            newPrice > drink.price
              ? "up"
              : newPrice < drink.price
                ? "down"
                : "stable",
        };
      })
    );

    setMessageIndex((current) => (current + 1) % marketMessages.length);
  };

  const forceCrash = () => {
    setDrinks((currentDrinks) =>
      currentDrinks.map((drink) => {
        const newPrice = Math.max(drink.min, drink.price - 0.5);

        return {
          ...drink,
          previousPrice: drink.price,
          price: newPrice,
          trend: newPrice < drink.price ? "down" : "stable",
          volume: Math.min(100, drink.volume + 8),
        };
      })
    );

    setMessageIndex(4);
    setSecondsToUpdate(10);
  };

  const forceBoom = () => {
    setDrinks((currentDrinks) =>
      currentDrinks.map((drink) => {
        const newPrice = Math.min(drink.max, drink.price + 0.5);

        return {
          ...drink,
          previousPrice: drink.price,
          price: newPrice,
          trend: newPrice > drink.price ? "up" : "stable",
          volume: Math.max(20, drink.volume - 6),
        };
      })
    );

    setMessageIndex(5);
    setSecondsToUpdate(10);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#07110b] text-white">
      <section className="relative min-h-screen p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f2a14a_0%,transparent_28%),radial-gradient(circle_at_bottom_right,#1f7a4d_0%,transparent_34%)] opacity-25" />

        <div className="absolute inset-0 opacity-[0.08]">
          <div className="h-full w-full bg-[linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(180deg,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1600px] flex-col">
          <header className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f2a14a]/30 bg-[#f2a14a]/10 px-4 py-2 text-sm font-black uppercase tracking-widest text-[#ffd8a8]">
                <Sparkles size={16} />
                Noche especial en la barra
              </div>

              <h1 className="text-6xl font-black leading-none tracking-tight md:text-8xl xl:text-9xl">
                La Hacienda
                <span className="block text-[#f2a14a]">del Frontón</span>
              </h1>

              <p className="mt-4 max-w-3xl text-xl font-bold text-zinc-300 md:text-2xl">
                Los cubatas cotizan en directo. Si baja, compras. Si sube,
                corres a la barra.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9fd08f]">
                    Estado del mercado
                  </p>
                  <p className="mt-2 text-4xl font-black">
                    {marketOpen ? "Abierto" : "Pausado"}
                  </p>
                </div>

                <button
                  onClick={() => setMarketOpen((value) => !value)}
                  className={`rounded-2xl px-5 py-3 text-sm font-black uppercase tracking-widest transition ${
                    marketOpen
                      ? "bg-[#9fd08f] text-[#07110b]"
                      : "bg-red-400 text-[#300909]"
                  }`}
                >
                  {marketOpen ? "ON" : "OFF"}
                </button>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-black/30 p-4">
                <Clock className="text-[#f2a14a]" />
                <div>
                  <p className="text-sm font-bold text-zinc-400">
                    Próxima actualización
                  </p>
                  <p className="text-3xl font-black">
                    {marketOpen ? `${secondsToUpdate}s` : "Pausada"}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid flex-1 gap-6 xl:grid-cols-[1fr_360px]">
            <section className="rounded-[2.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur">
              <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f2a14a]">
                    Cotización de cubatas
                  </p>
                  <h2 className="mt-1 text-4xl font-black">
                    Pantalla de precios
                  </h2>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={forceCrash}
                    className="rounded-full bg-[#9fd08f] px-5 py-3 text-sm font-black uppercase tracking-widest text-[#07110b] transition hover:-translate-y-1"
                  >
                    Bajada general
                  </button>

                  <button
                    onClick={forceBoom}
                    className="rounded-full bg-[#f2a14a] px-5 py-3 text-sm font-black uppercase tracking-widest text-[#2a1405] transition hover:-translate-y-1"
                  >
                    Subida general
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {drinks.map((drink) => (
                  <DrinkRow key={drink.id} drink={drink} />
                ))}
              </div>
            </section>

            <aside className="grid gap-6">
              <div className="rounded-[2rem] border border-white/10 bg-[#102116] p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Flame className="text-[#f2a14a]" />
                  <h3 className="text-2xl font-black">Chollo actual</h3>
                </div>

                <p className="text-5xl font-black text-[#9fd08f]">
                  {cheapestDrink.name}
                </p>
                <p className="mt-3 text-6xl font-black text-white">
                  {cheapestDrink.price.toFixed(2)}€
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#24150a] p-6">
                <div className="mb-4 flex items-center gap-3">
                  <TrendingUp className="text-[#f2a14a]" />
                  <h3 className="text-2xl font-black">Más demandado</h3>
                </div>

                <p className="text-5xl font-black text-[#f2a14a]">
                  {hottestDrink.name}
                </p>
                <p className="mt-3 text-xl font-bold text-zinc-300">
                  Demanda al {hottestDrink.volume}%
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="mb-4 flex items-center gap-3">
                  <Gavel className="text-[#9fd08f]" />
                  <h3 className="text-2xl font-black">Última noticia</h3>
                </div>

                <p className="text-3xl font-black leading-tight">
                  {marketMessages[messageIndex]}
                </p>
              </div>
            </aside>
          </div>

          <footer className="mt-6 overflow-hidden rounded-full border border-white/10 bg-black/40 py-3">
            <div className="ticker whitespace-nowrap text-xl font-black uppercase tracking-widest text-[#f2a14a]">
              RON +0.50 · GIN -0.50 · WHS estable · VDK en máximos · CUBATA
              REFUGIO · LOS ÚLTIMOS DEL FRONTÓN · PARACUELLOS DE LA VEGA ·
              COMPRA BAJO, BEBE CONTENTO ·
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}

function DrinkRow({ drink }: { drink: Drink }) {
  const difference = drink.price - drink.previousPrice;

  const trendStyles = {
    up: {
      text: "Sube",
      className: "text-red-300",
      bg: "bg-red-400/15",
      icon: <ArrowUp />,
    },
    down: {
      text: "Baja",
      className: "text-[#9fd08f]",
      bg: "bg-[#9fd08f]/15",
      icon: <ArrowDown />,
    },
    stable: {
      text: "Estable",
      className: "text-zinc-300",
      bg: "bg-white/10",
      icon: <Beer />,
    },
  }[drink.trend];

  const percent = ((drink.price - drink.min) / (drink.max - drink.min)) * 100;

  return (
    <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 md:grid-cols-[120px_1fr_180px_160px] md:items-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
          Código
        </p>
        <p className="mt-1 text-4xl font-black text-[#f2a14a]">
          {drink.short}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap items-end gap-3">
          <h3 className="text-4xl font-black">{drink.name}</h3>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${trendStyles.bg} ${trendStyles.className}`}
          >
            {trendStyles.icon}
            {trendStyles.text}
          </span>
        </div>

        <div className="mt-4 h-4 overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full bg-[#f2a14a] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs font-black uppercase tracking-widest text-zinc-500">
          <span>Mín. {drink.min.toFixed(2)}€</span>
          <span>Demanda {drink.volume}%</span>
          <span>Máx. {drink.max.toFixed(2)}€</span>
        </div>
      </div>

      <div>
        <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
          Precio
        </p>
        <p className="mt-1 text-6xl font-black text-white">
          {drink.price.toFixed(2)}€
        </p>
      </div>

      <div>
        <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
          Cambio
        </p>

        <p
          className={`mt-1 flex items-center gap-2 text-3xl font-black ${trendStyles.className}`}
        >
          {difference > 0 && "+"}
          {difference.toFixed(2)}€
        </p>
      </div>
    </div>
  );
}