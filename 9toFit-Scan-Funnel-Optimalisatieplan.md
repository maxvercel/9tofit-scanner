# 9toFit Scan-Funnel — Optimalisatieplan

> Op basis van een volledige testrun met drie agents: (1) live end-to-end test, (2) berichtgeving-audit (alle mails), (3) links- & flow-audit. Geprioriteerd van kritiek → nice-to-have, met per punt: wat, waar, en de aanbevolen fix.

---

## 0. Status — regressie opgelost (live bevestigd) ✅

De eerdere bug (leeg 0-dagen schema + client niet gekoppeld) is verholpen. Live geverifieerd:

- Beide clients (pijn + fitness) staan **automatisch in de Klanten-lijst** met "Nieuw"-badge.
- Pijn-schema: **"7-Dagen Knee Recovery Startprogramma"**, 7 dagen gevuld, **Glute Bridge + Clamshell als vaste basis** + wisselende accessoires per dag.
- Fitness-schema: 4-daags hypertrofie, gevuld.
- Telefoon optioneel, tier-CTA's kloppen, magic-link-URL's correct.

Oorzaak was `program_type='rehab'`, dat de coach-weergave naar een blok-view stuurde die `program_blocks` verwacht. Teruggedraaid → klassieke weergave toont de dagen weer.

---

## 1. KRITIEK — fix vóór je opschaalt met ads/DM's

Deze doen direct pijn zodra je verkeer gaat sturen.

### Berichtgeving
1. **Kapotte CTA-links in de lead-nurture sequence** (`email-templates.ts`). Dag 4/6/8 → `/auth/signup` (bestaat niet), dag 0 → `/downloads/7-day-pain-free-plan` (bestaat niet), dag 2 → blog-slug `lower-back-pain-common-mistakes` (echte slug = `rugpijn-fitness-veilig-trainen`), referral → `/join` (bestaat niet). Je belangrijkste pre-trial conversie-CTA's leiden nu naar **404**. → vervang door bestaande routes (`/portal/login?mode=register`, echte blog-slug).
2. **Foute prijzen + niet-werkende kortingscodes in trial-mails.** `trialDay6Email` noemt €9,99–12,99/maand; echte pricing = €149–397 per 4 weken. Ondermijnt je premium-positionering (precies wat de Hormozi-audit voor de homepage al oploste). Kortingscodes (`EXTRA7DAYS`, "20%") worden nergens in de checkout ingelost. → prijzen gelijktrekken/weghalen; korting alleen tonen als de code écht werkt.
3. **Geen `List-Unsubscribe`-header op bulk-mails.** Sinds 2024 eisen Gmail/Yahoo one-click unsubscribe voor bulk-senders — zonder dit riskeren **álle** mails de spambox. De `/api/unsubscribe`-route bestaat al maar wordt nergens gelinkt. → headers + afmeldlink in `createEmailBase`-footer, migratie draaien.
4. **Programma-duur klopt niet in de mail.** Pijn-magic-link zegt "persoonlijk **14-dagen** programma"; het schema is **7 dagen**. → tekst → "7-daags startprogramma".

### Links & flow
5. **resend-magic-link mist `&email=`** (`api/auth/resend-magic-link/route.ts:88`). Op het verlopen-link-scherm is het e-mailveld dan leeg → gebruiker moet z'n adres opnieuw typen. → `&email=${encodeURIComponent(email)}` toevoegen.
6. **UTM-attributie gaat verloren** tussen scan-submit en de CRM-lead. `utm` zit wel in `scan_submissions.answers`, maar niet in het `scan_data`-object dat `upsertLead` schrijft → je ziet in de pipeline niet welk kanaal (paid vs organic) je scan-leads bracht. → `utm` opnemen in `scan_data` bij `upsertLead`.
7. **Env-var split** `NEXT_PUBLIC_SITE_URL` (magic-links + Mollie) vs `NEXT_PUBLIC_APP_URL` (mails). Als in een omgeving maar één gezet is, wijzen de andere naar de hardcoded default → in staging/preview kunnen magic-links en betaal-redirects naar productie wijzen. → consolideren naar één var of beide expliciet zetten.

---

## 2. BELANGRIJK

### Berichtgeving
- **Inconsistente van-adressen/reply-to.** Coach-stem-mails ("Max hier") komen van `noreply@` zonder reply-to → breekt de illusie dat Max je persoonlijk mailt. → alle coach-stem-mails `reply_to: max@9tofit.nl`.
- **Drie support-adressen** door elkaar (`support@`, `info@`, `max@`). → kies één, verifieer dat het bestaat en gemonitord wordt.
- **Fictieve social proof** ("het verhaal van Jeroen (47)") in nurture-mails botst met de Hormozi-beslissing om fake testimonials te schrappen. Referral-beloningen ("gratis Q&A", "groepssessie") alleen beloven als ze echt bestaan.
- **Spam-trigger subjects**: "Exclusief: 20% korting", "Limited Time Offer" (Engels in NL-mail), "Laatste bericht — je account wordt gearchiveerd" (dreigend) + veel emoji. → verzachten, vertalen, max 1 emoji.
- **Ontbrekende lifecycle-mails**: **betaal-mislukt** (nu stille churn!), **trial-eindigt-morgen (dag 13)**, wachtwoord-reset in huisstijl. Trial dag-12 gebruikt bovendien de verkeerde "halverwege"-template.
- **Twee gescheiden e-mail-designsystemen** (scanner vs platform vs de aparte magic-link-HTML). Eén lead krijgt binnen 30 min 2–3 mails met zichtbaar verschillende huisstijl. → één gedeelde base-template.

### Links & flow
- **CTA-kanaal inconsistent**: scanner stuurt naar Calendly, maar `portal/welkom`'s constante `CALENDLY_URL` bevat een **WhatsApp-link**. → kies één kanaal; hernoem de misleidende constante.
- **Scanner Calendly-link hardcoded in de mails** (negeert `NEXT_PUBLIC_CALENDLY_URL`). → env gebruiken, zodat een gewijzigde slug niet naar een dode link wijst.
- **"Open je schema" in de speed-to-lead-mail** → `/portal/login?from=scan` (plain login). Deze users hebben geen wachtwoord → potentieel dead-end. → knop ook naar magic-link/wachtwoord-instellen laten wijzen.
- **Gedeelde-rapport-CTA's** (`report/[token]`) linken naar de generieke homepage i.p.v. scan/checkout → gemiste conversie.
- **CORS**: bevestig dat het feitelijke scanner-productiedomein in de allowlist (`SCANNER_ALLOWED_ORIGINS`) staat, anders worden submits van dat domein geblokkeerd.

### Scanner / App UX (uit de live test)
- **Analyse-loader hangt ~30 s** terwijl de 4 vinkjes al na ~4 s groen zijn → voelt als een hang, juist bij je **hot** pijn-leads. → voortgangsindicator of "dit kan even duren".
- **Layout-shift** na de eerste interactie (pagina verspringt; eerste klik "mist" soms).
- **Scan-resultaatscherm** toont alleen dag 1 volledig; dag 2–7 tonen enkel titels (in de app zijn ze wél gevuld) → weergave-inconsistentie fixen.
- **Coach-app** toont "Schema loopt af · nooit getraind" op **splinternieuwe** clients → misleidend (lijkt actie nodig). → onderdruk voor net-aangemaakte 1-weeks schema's.
- **Taalfout**: fitness-schema Dag 3 = "Pull & **Rückenopbouw**" (Duits) → "Rugopbouw".
- **"(tijdelijk)"** in de programmanaam is coach-jargon — check of de client dit ziet.

---

## 3. NICE-TO-HAVE / polish
- Hardcoded `https://app.9tofit.nl` in ~10 componenten → `process.env.NEXT_PUBLIC_APP_URL` (breekt anders in staging).
- Hardcoded jaartal `&copy; 2026` in mailfooter → `new Date().getFullYear()`.
- Geen plain-text fallback op mails (`text`-veld) → deliverability + toegankelijkheid.
- NL-taalfouten/anglicismen in copy: "je **program**", "**hier's** het", "starten weer **fresco** op", "**Alle je** voortgang", "Quality over quantity!".
- 0-guard op trial-mails ("**0 oefeningen** voltooid, je bent geweldig bezig!" is tegenstrijdig).
- Coach-notificaties zonder dedup/rate-limit → bij volume een inbox-firehose; overweeg digest of alleen hot-tier.
- robots/sitemap: bevestig dat `app.9tofit.nl/robots.txt` niet de marketing-sitemap (`9tofit.nl`) uitserveert.
- Scanner `reset()` (in-app "nieuwe scan" zonder reload) verliest UTM voor de 2e submit — randgeval.

---

## 4. Voorgestelde volgorde

**Sprint 1 — "stop de bloeding" (deze week, vóór ads/DM's):**
kapotte nurture-links (#1) · List-Unsubscribe (#3) · foute prijzen (#2) · programma-duur-tekst (#4) · resend-email-param (#5). Dit zijn 404's + spam-risico + prijs-geloofwaardigheid — precies wat betaald verkeer verspilt.

**Sprint 2 — attributie & consistentie:**
UTM in CRM (#6) · env-vars (#7) · van-adressen/reply-to · één CTA-kanaal (Calendly vs WhatsApp) · ontbrekende payment-failed + trial-dag-13 mails · speed-to-lead-knop.

**Sprint 3 — UX & polish:**
loader + layout-shift · scan-resultaat-weergave · "schema loopt af"-status · taalfouten · hardcoded URL's · één mail-design · dedup coach-notificaties.

---

## 5. Wat ik meteen kan oppakken
Veruit het meeste zijn zelfstandige code-fixes die ik direct kan doen: kapotte links, resend-email-param, UTM in scan_data, programma-duur-tekst, taalfouten, Calendly-env, hardcoded URL's, van-adressen/reply-to, en de List-Unsubscribe-header. De prijzen, ontbrekende mails en het één-design-systeem vragen kort jouw input (welke prijzen/kanaal/afzender).

Zeg welke sprint ik als eerste oppak, dan begin ik.
