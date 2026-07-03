# Doskoi Style (Astro Template)

Static-first Astro template for a food truck website with:

- Embedded Google Calendar schedule display
- Catering request form with all required fields
- Server endpoint that emails catering requests via SMTP

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment variables

Set these in `.env`:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CATERING_EMAIL_FROM`
- `CATERING_EMAIL_TO`

## Google Calendar setup

1. Create/use a Google Calendar for truck schedule.
2. Make the calendar public.
3. Replace the embed URL in `src/components/ScheduleCalendar.astro` with your calendar's embed link if needed.

The schedule is shown through a Google Calendar iframe, so no API key is needed.

## Catering form behavior

The form posts to `/api/catering`, validates required fields, and sends an email using your SMTP configuration.

## Build

```bash
npm run build
```