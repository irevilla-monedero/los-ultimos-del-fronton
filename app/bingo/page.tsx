"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleDot,
  Dice5,
  History,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  Wallet,
} from "lucide-react";

type GameMode = "linea" | "bingo";
type BigBanner = "linea" | "bingo" | null;

type SavedBingoGame = {
  calledNumbers: number[];
  currentNumber: number | null;
  phraseIndex: number;
  mode: GameMode;
  linePrize: string;
  bingoPrize: string;
};

const STORAGE_KEY = "bingo-del-fronton-game";

const bingoPhrases = [
  "¡Silencio en el frontón!",
  "¡Atención que sale bola!",
  "¡Los últimos del frontón reparten suerte!",
  "¡Que no se escape nadie de la barra!",
  "¡Ojo a los cartones!",
  "¡La suerte también viene a la verbena!",
  "¡Número calentito recién salido del bombo!",
];

export default function BingoPage() {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [mode, setMode] = useState<GameMode>("linea");
  const [linePrize, setLinePrize] = useState("");
  const [bingoPrize, setBingoPrize] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [bigBanner, setBigBanner] = useState<BigBanner>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const savedGame = window.localStorage.getItem(STORAGE_KEY);

    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame) as SavedBingoGame;

        setCalledNumbers(parsedGame.calledNumbers ?? []);
        setCurrentNumber(parsedGame.currentNumber ?? null);
        setPhraseIndex(parsedGame.phraseIndex ?? 0);
        setMode(parsedGame.mode ?? "linea");
        setLinePrize(parsedGame.linePrize ?? "");
        setBingoPrize(parsedGame.bingoPrize ?? "");
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    const gameToSave: SavedBingoGame = {
      calledNumbers,
      currentNumber,
      phraseIndex,
      mode,
      linePrize,
      bingoPrize,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameToSave));
  }, [
    calledNumbers,
    currentNumber,
    phraseIndex,
    mode,
    linePrize,
    bingoPrize,
    hasLoaded,
  ]);

  const availableNumbers = useMemo(() => {
    return Array.from({ length: 90 }, (_, index) => index + 1).filter(
      (number) => !calledNumbers.includes(number)
    );
  }, [calledNumbers]);

  const lastNumbers = useMemo(() => {
    return calledNumbers.slice(-5).reverse();
  }, [calledNumbers]);

  const callNextNumber = () => {
    if (availableNumbers.length === 0 || isDrawing) return;

    setIsDrawing(true);

    window.setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const nextNumber = availableNumbers[randomIndex];

      setCurrentNumber(nextNumber);
      setCalledNumbers((numbers) => [...numbers, nextNumber]);
      setPhraseIndex((index) => (index + 1) % bingoPhrases.length);
      setIsDrawing(false);
    }, 1200);
  };

  const resetGame = () => {
    const confirmReset = window.confirm(
      "¿Seguro que quieres reiniciar el bingo? Se borrarán los números cantados."
    );

    if (!confirmReset) return;

    setCalledNumbers([]);
    setCurrentNumber(null);
    setPhraseIndex(0);
    setMode("linea");
    setBigBanner(null);
    setIsDrawing(false);
  };

  const repeatNumber = () => {
    if (!currentNumber) return;

    setPhraseIndex((index) => (index + 1) % bingoPhrases.length);
  };

  const showBanner = (banner: BigBanner) => {
    setBigBanner(banner);

    window.setTimeout(() => {
      setBigBanner(null);
    }, 5000);
  };

  const activePrize = mode === "linea" ? linePrize : bingoPrize;

  return (
    <main className="min-h-screen overflow-hidden bg-[#101713] text-white">
      {bigBanner && (
        <PrizeBanner
          type={bigBanner}
          prize={bigBanner === "linea" ? linePrize : bingoPrize}
          onClose={() => setBigBanner(null)}
        />
      )}

      <section className="relative min-h-screen p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f2a14a_0%,transparent_30%),radial-gradient(circle_at_bottom_right,#256d3f_0%,transparent_34%)] opacity-25" />

        <div className="absolute inset-0 opacity-[0.08]">
          <div className="h-full w-full bg-[linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(180deg,#ffffff_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1700px] gap-6 xl:grid-cols-[430px_1fr_360px]">
          <aside className="flex flex-col gap-6">
            <div className="rounded-[2.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f2a14a]/30 bg-[#f2a14a]/10 px-4 py-2 text-sm font-black uppercase tracking-widest text-[#ffd8a8]">
                <Sparkles size={16} />
                Noche de bingo
              </div>

              <h1 className="text-6xl font-black leading-none tracking-tight">
                Bingo
                <span className="block text-[#f2a14a]">del Frontón</span>
              </h1>

              <p className="mt-5 text-xl font-bold text-zinc-300">
                Cartones listos, barra llena y suerte dando vueltas por el
                polideportivo.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#18261d] p-6">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9fd08f]">
                Estamos jugando a
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("linea")}
                  className={`rounded-2xl px-5 py-5 text-xl font-black transition ${
                    mode === "linea"
                      ? "bg-[#f2a14a] text-[#2a1405]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Línea
                </button>

                <button
                  onClick={() => setMode("bingo")}
                  className={`rounded-2xl px-5 py-5 text-xl font-black transition ${
                    mode === "bingo"
                      ? "bg-[#f2a14a] text-[#2a1405]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Bingo
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Wallet className="text-[#f2a14a]" />
                <h2 className="text-3xl font-black">Premios</h2>
              </div>

              <div className="grid gap-4">
                <label className="block">
                  <span className="text-sm font-black uppercase tracking-[0.25em] text-[#9fd08f]">
                    Línea
                  </span>
                  <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                    <input
                      value={linePrize}
                      onChange={(event) => setLinePrize(event.target.value)}
                      placeholder="Ej: 35"
                      inputMode="decimal"
                      className="w-full bg-transparent text-4xl font-black text-white outline-none placeholder:text-zinc-600"
                    />
                    <span className="text-4xl font-black text-[#f2a14a]">
                      €
                    </span>
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-black uppercase tracking-[0.25em] text-[#9fd08f]">
                    Bingo
                  </span>
                  <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                    <input
                      value={bingoPrize}
                      onChange={(event) => setBingoPrize(event.target.value)}
                      placeholder="Ej: 120"
                      inputMode="decimal"
                      className="w-full bg-transparent text-4xl font-black text-white outline-none placeholder:text-zinc-600"
                    />
                    <span className="text-4xl font-black text-[#f2a14a]">
                      €
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
                Progreso
              </p>

              <p className="mt-2 text-6xl font-black text-white">
                {calledNumbers.length}
                <span className="text-2xl text-zinc-500"> / 90</span>
              </p>

              <div className="mt-5 h-5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#f2a14a] transition-all duration-500"
                  style={{ width: `${(calledNumbers.length / 90) * 100}%` }}
                />
              </div>
            </div>
          </aside>

          <section className="flex flex-col gap-6">
            <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_0.75fr]">
              <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#f2a14a] p-8 text-[#111713] shadow-2xl">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20" />
                <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-black/10" />

                <div className="relative z-10 flex h-full min-h-[430px] flex-col items-center justify-center text-center">
                  <p className="mb-4 text-xl font-black uppercase tracking-[0.35em]">
                    Número cantado
                  </p>

                  <BingoBall
                    currentNumber={currentNumber}
                    isDrawing={isDrawing}
                  />

                  <p className="mt-8 max-w-2xl text-4xl font-black leading-tight">
                    {isDrawing
                      ? "La bola está saliendo..."
                      : currentNumber
                        ? bingoPhrases[phraseIndex]
                        : "Pulsa cantar número para empezar."}
                  </p>

                  {activePrize && (
                    <p className="mt-4 rounded-full bg-[#111713] px-6 py-3 text-xl font-black text-[#f2a14a]">
                      Premio actual: {activePrize}€
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6">
                <button
                  onClick={callNextNumber}
                  disabled={availableNumbers.length === 0 || isDrawing}
                  className="rounded-[2.5rem] bg-[#9fd08f] p-8 text-left text-[#07110b] shadow-2xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Dice5 size={48} />
                  <p className="mt-6 text-5xl font-black leading-none">
                    Cantar número
                  </p>
                  <p className="mt-3 text-xl font-bold">
                    Quedan {availableNumbers.length} bolas.
                  </p>
                </button>

                <button
                  onClick={repeatNumber}
                  disabled={!currentNumber || isDrawing}
                  className="rounded-[2.5rem] border border-white/10 bg-white/10 p-8 text-left shadow-2xl backdrop-blur transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Volume2 size={48} className="text-[#f2a14a]" />
                  <p className="mt-6 text-4xl font-black leading-none">
                    Repetir número
                  </p>
                  <p className="mt-3 text-xl font-bold text-zinc-300">
                    Para despistados de la barra.
                  </p>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => showBanner("linea")}
                    className="rounded-[2rem] bg-[#f2a14a] p-6 text-left text-[#2a1405] shadow-2xl transition hover:-translate-y-1"
                  >
                    <Trophy size={40} />
                    <p className="mt-4 text-4xl font-black leading-none">
                      Línea
                    </p>
                  </button>

                  <button
                    onClick={() => showBanner("bingo")}
                    className="rounded-[2rem] bg-white p-6 text-left text-[#111713] shadow-2xl transition hover:-translate-y-1"
                  >
                    <Trophy size={40} />
                    <p className="mt-4 text-4xl font-black leading-none">
                      Bingo
                    </p>
                  </button>
                </div>

                <button
                  onClick={resetGame}
                  className="rounded-[2.5rem] border border-red-400/20 bg-red-400/10 p-8 text-left shadow-2xl transition hover:-translate-y-1"
                >
                  <RotateCcw size={48} className="text-red-300" />
                  <p className="mt-6 text-4xl font-black leading-none">
                    Reiniciar
                  </p>
                  <p className="mt-3 text-xl font-bold text-red-200">
                    Nueva partida desde cero.
                  </p>
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <History className="text-[#f2a14a]" />
                <h2 className="text-3xl font-black">Últimos números</h2>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {lastNumbers.length > 0 ? (
                  lastNumbers.map((number) => (
                    <div
                      key={number}
                      className="flex h-24 items-center justify-center rounded-3xl bg-white text-5xl font-black text-[#111713]"
                    >
                      {number}
                    </div>
                  ))
                ) : (
                  <p className="col-span-5 text-xl font-bold text-zinc-400">
                    Todavía no ha salido ningún número.
                  </p>
                )}
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-[#24150a] p-6">
              <div className="mb-4 flex items-center gap-3">
                <Trophy className="text-[#f2a14a]" />
                <h3 className="text-3xl font-black">
                  {mode === "linea" ? "Premio línea" : "Premio bingo"}
                </h3>
              </div>

              <p className="text-6xl font-black text-[#f2a14a]">
                {activePrize ? `${activePrize}€` : "—"}
              </p>

              <p className="mt-4 text-xl font-bold text-zinc-300">
                Revisad bien antes de cantar. El frontón no perdona.
              </p>
            </div>

            <div className="flex-1 rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <CircleDot className="text-[#9fd08f]" />
                <h3 className="text-3xl font-black">Tablero</h3>
              </div>

              <div className="grid grid-cols-9 gap-2">
                {Array.from({ length: 90 }, (_, index) => {
                  const number = index + 1;
                  const isCalled = calledNumbers.includes(number);
                  const isCurrent = currentNumber === number;

                  return (
                    <div
                      key={number}
                      className={`flex aspect-square items-center justify-center rounded-xl text-lg font-black transition ${
                        isCurrent
                          ? "bg-[#f2a14a] text-[#111713] ring-4 ring-white"
                          : isCalled
                            ? "bg-[#9fd08f] text-[#07110b]"
                            : "bg-black/30 text-zinc-500"
                      }`}
                    >
                      {number}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function BingoBall({
  currentNumber,
  isDrawing,
}: {
  currentNumber: number | null;
  isDrawing: boolean;
}) {
  return (
    <div className="relative flex h-80 w-80 items-center justify-center md:h-[26rem] md:w-[26rem]">
      <div className="absolute inset-0 rounded-full border-[18px] border-[#111713] bg-white shadow-2xl" />

      <div className="absolute -bottom-6 h-16 w-56 rounded-full bg-black/20 blur-xl" />

      {isDrawing && (
        <div className="bingo-ball-drawing absolute flex h-32 w-32 items-center justify-center rounded-full border-[8px] border-[#111713] bg-white text-5xl font-black shadow-2xl">
          ?
        </div>
      )}

      <div
        className={`relative z-10 flex h-64 w-64 items-center justify-center rounded-full border-[10px] border-[#111713] bg-white transition duration-300 md:h-80 md:w-80 ${
          isDrawing ? "scale-90 opacity-30" : "scale-100 opacity-100"
        }`}
      >
        <p className="text-[8rem] font-black leading-none md:text-[12rem]">
          {currentNumber ?? "—"}
        </p>
      </div>
    </div>
  );
}

function PrizeBanner({
  type,
  prize,
  onClose,
}: {
  type: "linea" | "bingo";
  prize: string;
  onClose: () => void;
}) {
  const isBingo = type === "bingo";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur">
      <div
        className={`prize-banner relative w-full max-w-6xl overflow-hidden rounded-[3rem] border-8 p-10 text-center shadow-2xl ${
          isBingo
            ? "border-[#f2a14a] bg-white text-[#111713]"
            : "border-white bg-[#f2a14a] text-[#2a1405]"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full bg-black/15 px-5 py-3 text-sm font-black uppercase tracking-widest"
        >
          Cerrar
        </button>

        <p className="text-2xl font-black uppercase tracking-[0.45em]">
          Los últimos del frontón
        </p>

        <h2 className="mt-8 text-[7rem] font-black leading-none md:text-[12rem]">
          {isBingo ? "¡BINGO!" : "¡LÍNEA!"}
        </h2>

        <p className="mt-8 text-5xl font-black md:text-7xl">
          Premio: {prize ? `${prize}€` : "por confirmar"}
        </p>

        <p className="mt-8 text-3xl font-black">
          Revisando cartón en el frontón...
        </p>
      </div>
    </div>
  );
}