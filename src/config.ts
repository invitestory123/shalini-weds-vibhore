// ─────────────────────────────────────────────────────────────
//  WEDDING CONFIG — edit this one file per customer
// ─────────────────────────────────────────────────────────────

export const wedding = {
  bride: "Shalini",
  groom: "Vibhore",
  brideFull: "Shalini",
  groomFull: "Vibhore",
  brideParents: "Daughter of Parents",
  groomParents: "Son of Parents",
  hashtag: "#ShaliniWedsVibhore",
  monogram: "S · V",

  // Wedding muhurat (countdown + calendar target) — one event only
  dateISO: "2026-11-20T20:00:00+05:30",
  dateLabel: "Friday, 20th November 2026",
  timeLabel: "Celebrations from 8:00 PM",

  venue: {
    name: "Drive in 24 Hotel & Resort",
    address: "Delhi Road, Opposite Circuit House, Moradabad, Uttar Pradesh",
    mapsQuery: "Drive in 24 Hotel & Resort, Delhi Road, Opposite Circuit House, Moradabad, Uttar Pradesh",
    mapsUrl: "https://share.google/IIRGUNf3L4QUEI0ZX",
  },

  verse: {
    hindi: "॥ श्री गणेशाय नमः ॥",
    text: "Together with their families, request the honour of your presence as two souls become one under a sky full of stars.",
  },

  // The one event for the day — Wedding only.
  events: [
    {
      name: "Wedding",
      icon: "heart",
      date: "Friday, 20th November 2026",
      dayLabel: "Friday",
      dayNum: "20",
      monthLabel: "November 2026",
      venue: "Drive in 24, Moradabad",
      note: "Celebrations & the sacred vows — the moment two souls become one.",
    },
  ],

  // Ceremony flow inside the wedding itself
  program: [
    { name: "Baraat Arrival", time: "8:00 PM" },
    { name: "Jaimala", time: "10:00 PM" },
    { name: "Vidai", time: "5:00 AM" },
  ],
  sections: {
    events: true,
    venue: true,
    countdown: true,
  },
};

// Google Calendar deep link — derived from dateISO so it stays correct.
export const googleCalendarUrl = () => {
  const start = new Date(wedding.dateISO);
  const end = new Date(start.getTime() + 7 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${wedding.bride} weds ${wedding.groom}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `${wedding.venue.name} — ${wedding.venue.address}. ${wedding.hashtag}`,
    location: `${wedding.venue.name}, ${wedding.venue.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Downloadable .ics file (works with Apple / Outlook / any calendar).
export const downloadICS = () => {
  const start = new Date(wedding.dateISO);
  const end = new Date(start.getTime() + 7 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//InviteStory//Wedding//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@invitestory`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${wedding.bride} weds ${wedding.groom}`,
    `DESCRIPTION:${wedding.venue.name} — ${wedding.venue.address}`,
    `LOCATION:${wedding.venue.name}\\, ${wedding.venue.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${wedding.bride}-${wedding.groom}-wedding.ics`;
  a.click();
  URL.revokeObjectURL(url);
};

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  wedding.venue.mapsQuery
)}&output=embed`;

export const mapsDirectionsUrl =
  wedding.venue.mapsUrl ||
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    wedding.venue.mapsQuery
  )}`;