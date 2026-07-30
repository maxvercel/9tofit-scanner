# 9toFit Scan v2 — Go-live checklist

Alles is lokaal gebouwd en statisch/functioneel getest. Dit is wat er nog moet gebeuren om live te gaan, plus de smoke-test die je daarna per pad afvinkt.

---

## A. Deploy (jouw acties — de sandbox kan niet pushen)

- [ ] **Scanner** (`9tofit-scanner`): `git add -A && git commit && git push`
- [ ] **Platform** (`Performance-platform`): `git add -A && git commit && git push`
- [ ] Vercel: beide projecten laten deployen, wacht tot **Ready**
- [ ] (optioneel) SQL-migratie `ScanV2-LeadTier-Migration.sql` in Supabase draaien — niet nodig om te werken, wel handig voor rapportage

---

## B. Config verifiëren (kritisch — meest waarschijnlijke stille faal)

**Platform env (Vercel → Performance-platform):**

- [ ] `ANTHROPIC_API_KEY` — anders geen schema-generatie
- [ ] `RESEND_API_KEY` — anders geen magic-link/coach-mail
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://app.9tofit.nl` — basis van de magic link
- [ ] Supabase: `NEXT_PUBLIC_SUPABASE_URL` + service-role key (voor admin-client)
- [ ] `DEFAULT_COACH_ID` — wordt als `coach_id` op het programma gezet
- [ ] `NEXT_PUBLIC_COACH_EMAIL` — ontvanger van lead-notificaties/alerts
- [ ] `SCANNER_ALLOWED_ORIGINS` — **moet de origin van je scanner bevatten** (bijv. `https://scan.9tofit.nl`), anders wordt élke submit met CORS geweigerd
- [ ] Resend: domein `9tofit.nl` (`noreply@9tofit.nl`) geverifieerd

**Scanner env (Vercel → 9tofit-scanner):**

- [ ] `NEXT_PUBLIC_PLATFORM_URL` = `https://app.9tofit.nl`
- [ ] `NEXT_PUBLIC_CALENDLY_URL` (voor de belafspraak-CTA)
- [ ] (optioneel) `NEXT_PUBLIC_META_PIXEL_ID` voor ads-tracking

---

## C. Smoke-test — één scan per pad

Gebruik plus-tags op één inbox zodat je losse accounts krijgt en makkelijk kunt opruimen:
`jouwnaam+pijn@gmail.com`, `+fitness@`, `+fysio@`, `+koud@`.

### Pad 1 — Pijn (verwacht tier: hot)

Invoer: leeftijd 35-45 · ervaring 2-4 jr · doel pijnvrij · **intentie = nú aanpakken** · situatie kantoor · **urgentie = direct** · pijnlocatie knie · intensiteit 7 · duur chronisch · triggers squatten. Gate: naam + e-mail, **telefoon leeg laten**.

- [ ] Gate laat door zónder telefoon
- [ ] Rapport rendert; CTA = "Plan mijn intake →" met schaarste-tekst (hot)
- [ ] Magic-link mail binnen ~1 min
- [ ] Magic link → automatisch ingelogd, geen wachtwoord
- [ ] Training-tab toont een **knie-specifiek** correctief schema (niet generiek) → bewijst de id-fix
- [ ] CRM: lead aanwezig, `source=scan`, `scan_data.lead_tier=hot`
- [ ] Coach-taak "HOT lead — bel vandaag" aangemaakt

### Pad 2 — Fitness (verwacht tier: warm)

Invoer: doel spiermassa · **intentie = serieus, wil eerst inzicht** · geen pijn · 4 trainingsdagen. Gate zonder telefoon.

- [ ] Success-scherm zegt "je startschema staat klaar" (niet "kies je pakket")
- [ ] Magic link → Training-tab toont een **fitness-startschema** met "(tijdelijk)" + de "Startschema klaar!"-banner
- [ ] CRM-lead `lead_tier=warm`

### Pad 3 — Fysio

Open met `?ref=fysio_test` of kies het fysio-pad.

- [ ] Startschema aangemaakt in de app
- [ ] Urgente **intake-taak** voor de coach
- [ ] CRM-lead aanwezig

### Koud-lead check (frictie + tier)

Invoer: **intentie = oriënteren** · **urgentie = binnenkort**.

- [ ] Pijn-pad slaat de trigger-stap over (minder vragen)
- [ ] Uitkomst heeft zachte/nurture-toon (geen harde belafspraak-push)
- [ ] Géén "bel vandaag"-taak; lead gaat de nurture-flow in

---

## D. Rollback

- Faalt de AI-schema-generatie? Dan wordt automatisch een **statisch fallback-schema** ingevoegd en krijgt de coach een alert-mail — de lead ziet dus altijd iets.
- Er is **geen feature-flag** voor de scanner-v2 wijzigingen. Terugdraaien = `git revert` van de betreffende commits + opnieuw deployen.

---

## E. Browser-doortest door een agent (na deploy)

Zodra het live staat kan ik een agent je Chrome laten aansturen die de smoke-test hierboven per pad uitvoert: door de scan klikken, screenshots maken, en het resultaatscherm + tier-CTA verifiëren. Voorwaarden:

1. De nieuwe versie moet **gedeployed** zijn (anders test de agent de oude funnel).
2. Gebruik een **wegwerp-testmail** — de test maakt echte trial-accounts + CRM-leads aan.
3. Jouw akkoord om formulieren op productie te versturen (dat is een echte actie).

De agent kan het klikken/verifiëren doen; de coach-app + CRM-controles (stappen die inloggen in het admin vereisen) doen we samen of laat ik de agent met een test-coachaccount doen.
