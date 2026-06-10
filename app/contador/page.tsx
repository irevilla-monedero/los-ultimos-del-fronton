"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Beer,
  CalendarDays,
  Dice5,
  Flame,
  MapPin,
  Music,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Trophy,
  X,
} from "lucide-react";

type EventType = "barra" | "bingo" | "hacienda" | "dj" | "promo" | "ruleta";

type FrontonEvent = {
  id: number;
  title: string;
  subtitle: string;
  start: string;
  end?: string;
  type: EventType;
  location: string;
};

const STORAGE_KEY = "contador-fronton-events";

const defaultEvents: FrontonEvent[] = [
  {
    id: 1,
    title: "Apertura de barra",
    subtitle: "Empieza la noche en Los últimos del frontón",
    start: "2026-08-10T22:00:00",
    end: "2026-08-10T23:30:00",
    type: "barra",
    location: "Barra del frontón",
  },
  {
    id: 2,
    title: "Bingo popular",
    subtitle: "Cartones, suerte y silencio en el polideportivo",
    start: "2026-08-10T23:30:00",
    end: "2026-08-11T00:15:00",
    type: "bingo",
    location: "Pantalla del frontón",
  },
  {
    id: 3,
    title: "Promo chupitos",
    subtitle: "Oferta relámpago hasta que acabe la canción",
    start: "2026-08-11T00:15:00",
    end: "2026-08-11T00:30:00",
    type: "promo",
    location: "Barra",
  },
  {
    id: 4,
    title: "DJ en el frontón",
    subtitle: "La verbena sigue hasta que aguante el cuerpo",
    start: "2026-08-11T01:00:00",
    end: "2026-08-11T03:30:00",
    type: "dj",
    location: "Frontón municipal",
  },
  {
    id: 5,
    title: "La Hacienda del Frontón",
    subtitle: "Los cubatas cotizan como en la bolsa",
    start: "2026-08-11T23:45:00",
    end: "2026-08-12T01:00:00",
    type: "hacienda",
    location: "Pantalla de la barra",
  },
  {
    id: 6,
    title: "Ruleta del Frontón",
    subtitle: "Premios, retos y alguna que otra sorpresa",
    start: "2026-08-12T00:30:00",
    end: "2026-08-12T01:00:00",
    type: "ruleta",
    location: "Barra",
  },
];

const emptyEvent: FrontonEvent = {
  id: 0,
  title: "",
  subtitle: "",
  start: "",
  end: "",
  type: "barra",
  location: "Frontón municipal",
};

export default function ContadorPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [events, setEvents] = useState<FrontonEvent[]>(defaultEvents);
  const [hasLoadedEvents, setHasLoadedEvents] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FrontonEvent | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  useEffect(() => {
    const savedEvents = window.localStorage.getItem(STORAGE_KEY);

    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents) as FrontonEvent[];

        if (Array.isArray(parsedEvents)) {
          setEvents(parsedEvents);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setHasLoadedEvents(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedEvents) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events, hasLoadedEvents]);

  useEffect(() => {
    setNow(new Date());

    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  }, [events]);

  const currentEvent = useMemo(() => {
    if (!now) return null;

    return (
      sortedEvents.find((event) => {
        if (!event.end) return false;

        const start = new Date(event.start).getTime();
        const end = new Date(event.end).getTime();
        const current = now.getTime();

        return current >= start && current < end;
      }) ?? null
    );
  }, [now, sortedEvents]);

  const nextEvent = useMemo(() => {
    if (!now) return sortedEvents[0] ?? null;

    return (
      sortedEvents.find(
        (event) => new Date(event.start).getTime() > now.getTime()
      ) ?? null
    );
  }, [now, sortedEvents]);

  const featuredEvent = currentEvent ?? nextEvent;

  const upcomingEvents = useMemo(() => {
    if (!now) return sortedEvents.slice(0, 8);

    return sortedEvents
      .filter((event) => {
        const eventEnd = event.end
          ? new Date(event.end).getTime()
          : new Date(event.start).getTime();

        return eventEnd >= now.getTime();
      })
      .slice(0, 8);
  }, [now, sortedEvents]);

  const countdown = useMemo(() => {
    if (!now || !featuredEvent) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isLive: false,
      };
    }

    const start = new Date(featuredEvent.start).getTime();
    const current = now.getTime();
    const difference = start - current;

    if (currentEvent) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isLive: true,
      };
    }

    const totalSeconds = Math.max(0, Math.floor(difference / 1000));

    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      totalSeconds,
      isLive: false,
    };
  }, [now, featuredEvent, currentEvent]);

  const previousEvent = useMemo(() => {
    if (!featuredEvent) return null;

    const index = sortedEvents.findIndex(
      (event) => event.id === featuredEvent.id
    );

    if (index <= 0) return null;

    return sortedEvents[index - 1];
  }, [featuredEvent, sortedEvents]);

  const progress = useMemo(() => {
    if (!now || !featuredEvent) return 0;

    if (currentEvent && currentEvent.end) {
      const start = new Date(currentEvent.start).getTime();
      const end = new Date(currentEvent.end).getTime();
      const current = now.getTime();

      return Math.min(
        100,
        Math.max(0, ((current - start) / (end - start)) * 100)
      );
    }

    if (!previousEvent) return 0;

    const previousTime = previousEvent.end
      ? new Date(previousEvent.end).getTime()
      : new Date(previousEvent.start).getTime();

    const nextTime = new Date(featuredEvent.start).getTime();
    const current = now.getTime();

    return Math.min(
      100,
      Math.max(0, ((current - previousTime) / (nextTime - previousTime)) * 100)
    );
  }, [now, featuredEvent, currentEvent, previousEvent]);

  const openCreateEvent = () => {
    const nowDate = new Date();
    nowDate.setMinutes(0, 0, 0);

    const start = toLocalInputValue(nowDate);

    const endDate = new Date(nowDate);
    endDate.setHours(endDate.getHours() + 1);

    const end = toLocalInputValue(endDate);

    setIsCreatingEvent(true);
    setEditingEvent({
      ...emptyEvent,
      id: Date.now(),
      start,
      end,
    });
  };

  const saveEvent = (eventToSave: FrontonEvent) => {
    if (!eventToSave.title.trim()) {
      window.alert("El evento necesita un título.");
      return;
    }

    if (!eventToSave.start) {
      window.alert("El evento necesita una fecha y hora de inicio.");
      return;
    }

    if (
      eventToSave.end &&
      new Date(eventToSave.end) <= new Date(eventToSave.start)
    ) {
      window.alert("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    setEvents((currentEvents) => {
      const exists = currentEvents.some((event) => event.id === eventToSave.id);

      if (exists) {
        return currentEvents.map((event) =>
          event.id === eventToSave.id ? eventToSave : event
        );
      }

      return [...currentEvents, eventToSave];
    });

    setEditingEvent(null);
    setIsCreatingEvent(false);
  };

  const deleteEvent = (eventId: number) => {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres borrar este evento?"
    );

    if (!confirmDelete) return;

    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== eventId)
    );

    setEditingEvent(null);
    setIsCreatingEvent(false);
  };

  const resetDefaultEvents = () => {
    const confirmReset = window.confirm(
      "¿Quieres volver a los eventos de ejemplo? Se perderán los eventos actuales."
    );

    if (!confirmReset) return;

    setEvents(defaultEvents);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0f1712] text-white">
      {editingEvent && (
        <EventEditor
          event={editingEvent}
          isCreating={isCreatingEvent}
          onChange={setEditingEvent}
          onClose={() => {
            setEditingEvent(null);
            setIsCreatingEvent(false);
          }}
          onSave={saveEvent}
          onDelete={deleteEvent}
        />
      )}

      <section className="relative min-h-screen p-6">
        <Background />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1700px] gap-6 xl:grid-cols-[1fr_440px]">
          <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#f2a14a] p-8 text-[#111713] shadow-2xl">
              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/20" />
              <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-black/10" />

              <div className="relative z-10 flex h-full min-h-[calc(100vh-3rem)] flex-col justify-between">
                <div>
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    {featuredEvent && <EventPill type={featuredEvent.type} />}

                    <span className="rounded-full bg-[#111713] px-4 py-2 text-sm font-black uppercase tracking-widest text-[#f2a14a]">
                      {currentEvent ? "En directo" : "Próximo evento"}
                    </span>
                  </div>

                  <p className="text-lg font-black uppercase tracking-[0.4em]">
                    {currentEvent ? "Está pasando ahora" : "Empieza en"}
                  </p>

                  <h1 className="mt-5 text-7xl font-black leading-none tracking-tight md:text-8xl xl:text-9xl">
                    {featuredEvent?.title ?? "Sin eventos"}
                  </h1>

                  <p className="mt-8 max-w-4xl text-3xl font-black leading-tight md:text-4xl">
                    {featuredEvent?.subtitle ??
                      "Añade eventos desde la cola de la derecha."}
                  </p>
                </div>

                <div>
                  {currentEvent ? (
                    <div className="rounded-[2rem] bg-[#111713] p-8 text-white">
                      <p className="text-xl font-black uppercase tracking-[0.35em] text-[#9fd08f]">
                        En marcha
                      </p>
                      <p className="mt-3 text-8xl font-black text-[#f2a14a]">
                        AHORA
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3">
                      <TimeBox label="Días" value={countdown.days} />
                      <TimeBox label="Horas" value={countdown.hours} />
                      <TimeBox label="Min" value={countdown.minutes} />
                      <TimeBox label="Seg" value={countdown.seconds} />
                    </div>
                  )}

                  <div className="mt-6 rounded-[2rem] bg-[#111713] p-5 text-white">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-[#9fd08f]">
                        {currentEvent
                          ? "Progreso del evento"
                          : "Camino al evento"}
                      </p>

                      <p className="text-sm font-black uppercase tracking-widest text-zinc-400">
                        {Math.round(progress)}%
                      </p>
                    </div>

                    <div className="relative h-7 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#f2a14a] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />

                      <div
                        className="contador-ball absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border-4 border-[#111713] bg-white shadow-xl transition-all duration-500"
                        style={{ left: `calc(${progress}% - 20px)` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="grid gap-6">
              <div className="rounded-[2.5rem] border border-white/10 bg-black/35 p-6 backdrop-blur">
                <p className="text-sm font-black uppercase tracking-[0.35em] text-[#9fd08f]">
                  Ahora
                </p>

                <p className="mt-3 text-6xl font-black">
                  {now
                    ? now.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "--:--:--"}
                </p>

                <p className="mt-3 text-xl font-bold text-zinc-400">
                  Paracuellos de la Vega
                </p>
              </div>

              <div className="rounded-[2.5rem] border border-white/10 bg-[#18261d] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <MapPin className="text-[#9fd08f]" size={34} />
                  <h3 className="text-3xl font-black">Dónde</h3>
                </div>

                <p className="text-4xl font-black text-[#f2a14a]">
                  {featuredEvent?.location ?? "Frontón"}
                </p>

                <p className="mt-4 text-xl font-bold text-zinc-300">
                  Frontón del polideportivo · Serranía de Cuenca
                </p>
              </div>

              <div className="rounded-[2.5rem] border border-white/10 bg-black/30 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <CalendarDays className="text-[#f2a14a]" size={34} />
                  <h3 className="text-3xl font-black">Hora</h3>
                </div>

                <p className="text-5xl font-black">
                  {featuredEvent
                    ? new Date(featuredEvent.start).toLocaleTimeString(
                        "es-ES",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "--:--"}
                </p>

                <p className="mt-3 text-xl font-bold text-zinc-400">
                  {featuredEvent
                    ? new Date(featuredEvent.start).toLocaleDateString(
                        "es-ES",
                        {
                          day: "2-digit",
                          month: "long",
                        }
                      )
                    : "Sin fecha"}
                </p>
              </div>

              <div className="relative flex-1 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#174438] p-6">
                <div className="fronton-mini-numbers">
                  {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                    <span key={number}>{number}</span>
                  ))}
                </div>

                <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-end">
                  <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f3d2a3]">
                    Los últimos del frontón
                  </p>

                  <p className="mt-3 text-4xl font-black leading-tight">
                    Si queda tiempo,
                    <span className="block text-[#f2a14a]">queda plan.</span>
                  </p>
                </div>
              </div>
            </aside>
          </section>

          <aside className="flex flex-col gap-6">
            <div className="rounded-[2.5rem] border border-white/10 bg-black/35 p-6 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.35em] text-[#9fd08f]">
                    En cola
                  </p>

                  <h2 className="mt-3 text-5xl font-black">Próximos</h2>
                </div>

                <button
                  onClick={openCreateEvent}
                  className="rounded-2xl bg-[#f2a14a] p-4 text-[#111713] transition hover:-translate-y-1"
                  title="Añadir evento"
                >
                  <Plus size={32} />
                </button>
              </div>

              <p className="mt-4 text-sm font-bold text-zinc-400">
                Haz click en cualquier evento para editarlo.
              </p>

              <div className="mt-6 grid gap-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <QueueEvent
                      key={event.id}
                      event={event}
                      active={currentEvent?.id === event.id}
                      featured={featuredEvent?.id === event.id}
                      onClick={() => {
                        setEditingEvent(event);
                        setIsCreatingEvent(false);
                      }}
                    />
                  ))
                ) : (
                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-2xl font-black">
                      No hay más eventos programados.
                    </p>
                    <p className="mt-3 text-lg text-zinc-400">
                      Pulsa + para añadir uno nuevo.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={resetDefaultEvents}
                className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-black uppercase tracking-widest text-zinc-300 transition hover:bg-white/10"
              >
                Restaurar eventos de ejemplo
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function EventEditor({
  event,
  isCreating,
  onChange,
  onClose,
  onSave,
  onDelete,
}: {
  event: FrontonEvent;
  isCreating: boolean;
  onChange: (event: FrontonEvent) => void;
  onClose: () => void;
  onSave: (event: FrontonEvent) => void;
  onDelete: (eventId: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur">
      <div className="w-full max-w-3xl rounded-[2.5rem] border border-white/10 bg-[#111713] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#9fd08f]">
              {isCreating ? "Nuevo evento" : "Editar evento"}
            </p>

            <h2 className="mt-2 text-5xl font-black">
              {isCreating ? "Añadir plan" : "Modificar plan"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl bg-white/10 p-3 transition hover:bg-white/20"
          >
            <X />
          </button>
        </div>

        <div className="grid gap-4">
          <label>
            <span className="text-sm font-black uppercase tracking-widest text-[#f2a14a]">
              Título
            </span>
            <input
              value={event.title}
              onChange={(e) => onChange({ ...event, title: e.target.value })}
              placeholder="Ej: Bingo popular"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-xl font-black outline-none placeholder:text-zinc-600"
            />
          </label>

          <label>
            <span className="text-sm font-black uppercase tracking-widest text-[#f2a14a]">
              Subtítulo
            </span>
            <input
              value={event.subtitle}
              onChange={(e) =>
                onChange({ ...event, subtitle: e.target.value })
              }
              placeholder="Ej: Cartones, suerte y silencio en el frontón"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-xl font-bold outline-none placeholder:text-zinc-600"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="text-sm font-black uppercase tracking-widest text-[#f2a14a]">
                Inicio
              </span>
              <input
                type="datetime-local"
                value={toLocalInputValue(new Date(event.start))}
                onChange={(e) => onChange({ ...event, start: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-lg font-black outline-none"
              />
            </label>

            <label>
              <span className="text-sm font-black uppercase tracking-widest text-[#f2a14a]">
                Fin
              </span>
              <input
                type="datetime-local"
                value={event.end ? toLocalInputValue(new Date(event.end)) : ""}
                onChange={(e) => onChange({ ...event, end: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-lg font-black outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="text-sm font-black uppercase tracking-widest text-[#f2a14a]">
                Tipo
              </span>
              <select
                value={event.type}
                onChange={(e) =>
                  onChange({ ...event, type: e.target.value as EventType })
                }
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#1b241d] px-5 py-4 text-lg font-black outline-none"
              >
                <option value="barra">Barra</option>
                <option value="bingo">Bingo</option>
                <option value="hacienda">Hacienda</option>
                <option value="dj">DJ</option>
                <option value="promo">Promo</option>
                <option value="ruleta">Ruleta</option>
              </select>
            </label>

            <label>
              <span className="text-sm font-black uppercase tracking-widest text-[#f2a14a]">
                Lugar
              </span>
              <input
                value={event.location}
                onChange={(e) =>
                  onChange({ ...event, location: e.target.value })
                }
                placeholder="Ej: Barra del frontón"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-lg font-black outline-none placeholder:text-zinc-600"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => onSave(event)}
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-[#9fd08f] px-6 py-5 text-lg font-black uppercase tracking-widest text-[#07110b] transition hover:-translate-y-1"
          >
            <Save />
            Guardar
          </button>

          {!isCreating && (
            <button
              onClick={() => onDelete(event.id)}
              className="flex items-center justify-center gap-3 rounded-2xl bg-red-400/15 px-6 py-5 text-lg font-black uppercase tracking-widest text-red-200 transition hover:-translate-y-1"
            >
              <Trash2 />
              Borrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Background() {
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

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[2rem] bg-white p-5 text-center text-[#111713] shadow-xl">
      <p className="text-5xl font-black md:text-6xl">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-[#c45f2c]">
        {label}
      </p>
    </div>
  );
}

function QueueEvent({
  event,
  active,
  featured,
  onClick,
}: {
  event: FrontonEvent;
  active: boolean;
  featured: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[2rem] border p-5 text-left transition hover:-translate-y-1 ${
        active
          ? "border-[#9fd08f] bg-[#9fd08f]/15"
          : featured
            ? "border-[#f2a14a] bg-[#f2a14a]/15"
            : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-white/10 p-3 text-[#f2a14a]">
          {getEventIcon(event.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-3xl font-black">{event.title}</p>

            <p className="rounded-full bg-black/30 px-3 py-1 text-sm font-black text-[#f2a14a]">
              {new Date(event.start).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <p className="mt-2 text-lg font-bold text-zinc-300">
            {event.subtitle}
          </p>
        </div>
      </div>
    </button>
  );
}

function EventPill({ type }: { type: EventType }) {
  const labels: Record<EventType, string> = {
    barra: "Barra",
    bingo: "Bingo",
    hacienda: "Hacienda",
    dj: "DJ",
    promo: "Promo",
    ruleta: "Ruleta",
  };

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-widest text-[#111713]">
      {getEventIcon(type)}
      {labels[type]}
    </span>
  );
}

function getEventIcon(type: EventType) {
  const icons: Record<EventType, ReactNode> = {
    barra: <Beer size={22} />,
    bingo: <Dice5 size={22} />,
    hacienda: <Trophy size={22} />,
    dj: <Music size={22} />,
    promo: <Flame size={22} />,
    ruleta: <Sparkles size={22} />,
  };

  return icons[type];
}

function toLocalInputValue(date: Date) {
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}