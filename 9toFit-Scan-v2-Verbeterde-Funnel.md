# 9toFit Performance Scan v2 — Verbeterde funnel (ontwerp)

> Doel: van "iedereen dezelfde scan" naar een funnel die **op koopintentie kwalificeert**, de vragen en de uitkomst **per leadtype aanpast**, en je opvolging automatisch prioriteert. Zo krijg je toppleads i.p.v. volume.

---

## Implementatiestatus (1 juli 2026)

Doorgevoerd in de code (platform `Performance-platform`):

- **Fitness & fysio krijgen nu automatisch een schema.** Nieuw bestand `src/lib/ai/generateFitnessProgram.ts` — goal-gebaseerde oefeningenbibliotheek + Claude Haiku scheduler (~$0.005/lead), zelfde patroon en fallback als het pijn-pad. Ingeplugd in `src/app/api/scan-submit/route.ts`: bij `scan_path` fitness of fysio wordt een schema gegenereerd en ingevoegd (met 2× retry + statische fallback + coach-alert bij falen). De coach-taak blijft als review-stap bestaan.
- **Schema valt in de bestaande premium-UX.** De programmanaam krijgt de marker `(tijdelijk)`, waardoor de dashboard de al bestaande *"Startschema klaar!"*-banner toont en het als starter behandelt die de coach later vervangt.
- **Telefoon is optioneel gemaakt (platformkant).** `scan-submit` weigert een submit niet meer met een 400 als het telefoonnummer ontbreekt; een geldig nummer wordt nog steeds opgeslagen.
- **Geverifieerd:** TypeScript-check schoon op de gewijzigde bestanden.

Magic link + account: **werken al** (Supabase `admin.generateLink` → eigen token-link → Resend). Alleen niet lokaal end-to-end getest omdat `.env.local` leeg is; op productie draait dit op de Vercel-env.

### Update — scanner-frontend + CRM (doorgevoerd)

Scanner (`9tofit-scanner/src/app/page.jsx`):

- **Intentievraag toegevoegd** (nieuwe stap na Doelen): coach_now / serious / explore.
- **Lead-scoring + tier** (`computeLeadTier`): intentie + urgentie + modifiers (pijn-chroniciteit, intensiteit ≥7, ≥4 trainingsdagen, koopkrachtige leeftijd) → hot/warm/cold, met de harde regels uit dit ontwerp.
- **Tier-diepte**: oriënterende leads slaan de minst kritische pijn-trigger-stap over (minder frictie).
- **Telefoon optioneel**: veld gelabeld "(optioneel)" en niet meer verplicht om te versturen — de gate blokkeert alleen nog op naam + geldig e-mail.
- **`intent`, `lead_score`, `lead_tier` worden meegestuurd** naar `/api/scan-submit`.

Platform (`Performance-platform/src/app/api/scan-submit/route.ts`):

- Ontvangt en verwerkt `intent`, `lead_score`, `lead_tier` (opgeslagen in `scan_submissions.answers` JSONB).
- **CRM-koppeling gedicht**: scan-leads worden nu via `upsertLead()` in de `leads`-pipeline gezet (stage `trial`, `source='scan'`), mét de tier-data in `leads.scan_data`. Voorheen kwam een pure scan→magic-link lead niet in de CRM-pipeline. De coach kan nu sorteren op `scan_data->>'lead_tier'`.
- Optionele SQL-migratie voor losse tier-kolommen: `ScanV2-LeadTier-Migration.sql` (nog niet gedraaid).

Verificatie: scanner parseert schoon (Babel/JSX), platform TypeScript-check schoon.

### Update — kwaliteits- & conversiefixes (doorgevoerd)

- **#4 Pijnschema-personalisatie gefixt.** `generateCorrectivePlan` vertaalde scanner-id's (`lower_back`, `6m_2y`, `desk`, `bending`) niet naar de interne library-labels, waardoor lookups terugvielen op "algemeen"/"Beginner". Toegevoegd: normalisatie-maps (pijnlocatie, niveau, werk, triggers) + toepassing op in- en prompt-data. Geverifieerd: alle 18 vertaalwaarden resolven naar bestaande keys.
- **#5 Tier-gebaseerde opvolging.** Hot leads krijgen nu een **urgente `contact_call`-taak voor vandaag** (`sourceRule: scan_hot_lead`), ongeacht pad. De speed-to-lead-mail wordt tier-afhankelijk gepland: hot ≈ 5 min, warm ≈ 15 min, koud = standaard (30 min).
- **#8 Mail-copy fitness/fysio.** Magic-link-mail voor fitness meldt nu dat het startschema al klaarstaat ("Bekijk mijn startschema →", "Direct beschikbaar") i.p.v. "kies je pakket".
- **#10 Oefening-categorie.** `insertProgram` accepteert nu een categorie; fitness-schema's krijgen `strength` i.p.v. alles als `corrective` te labelen.

Geverifieerd: TypeScript-check schoon op alle gewijzigde bestanden; scoring- en normalisatie-logica getest.

### Update — tier-specifieke uitkomst-copy (doorgevoerd)

Beide uitkomstschermen in de scanner (`page.jsx`) zijn nu tier-bewust (`computeLeadTier` bij render):

- **Pijn-rapport CTA**: hot → "Plan je gratis intakegesprek" + schaarste ("deze week nog enkele plekken"), knop "Plan mijn intake →". Warm → bestaande strategiegesprek-CTA. Koud → zachte, vrijblijvende toon ("Geen haast — wanneer jij er klaar voor bent").
- **Success-scherm (fitness/fysio)**: hot → nadruk op direct gesprek plannen; warm → startschema klaar + coach verfijnt; koud → "begin wanneer jij wilt, geen druk". CTA-label past mee. Stap 2 zegt nu "je startschema staat al klaar" i.p.v. "kies je pakket".

Geverifieerd: JSX parseert schoon (2008 regels).

### Nog te doen (optioneel, volgende ronde)

- Volledige visuele loskoppeling (uitkomst tonen vóór contactgegevens, telefoon pas op het CTA-moment) — nu is telefoon optioneel maar de gate staat nog vóór de uitkomst.
- WhatsApp/SMS naar hot leads (vereist een provider die er nog niet is).
- Losse tier-kolommen in de `scan_submissions`-INSERT nadat de migratie is gedraaid.

---

## 1. Kernprincipes

1. **Twee kwalificatie-assen, niet één.** Nu vertak je alleen op *type probleem* (pijn/fitness/fysio). We voegen een tweede as toe: *koopintentie*. Die bepaalt uiteindelijk of iemand een hot lead is — niet waar het pijn doet.
2. **Elke route verdient een wow-uitkomst.** Nu krijgt alleen het pijn-pad een rijk AI-rapport; fitness/fysio krijgen een platte bevestiging. In v2 eindigt elk pad in iets persoonlijks en waardevols.
3. **Diepte volgt intentie.** Hot leads mogen méér vragen (meer investering = betere salescall + commitment). Koude leads krijgen minimale frictie.
4. **Score → tier → opvolging.** Eén leadscore stuurt uitkomst én de prioriteit waarmee jij (of je coach) opvolgt.
5. **Blijft ≤ 3 min, mobile-first** (draait als iframe in WordPress).
6. **Bron bepaalt de default-aanname.** Koude LinkedIn-DM-traffic vs. warme Meta-ad-traffic vraagt om andere framing (zie §8).

---

## 2. Funnel op hoofdlijnen

```
Landing
  → Kwalificatie (Q1 probleem · Q2 intentie · Q3 urgentie)
      → Lead-score berekend → tier bepaald (Hot / Warm / Koud)
          → Vragenset op maat van tier (diep → minimaal)
              → Gate op maat (telefoon verplicht → alleen e-mail)
                  → Uitkomst op maat (belafspraak → nurture)
                      → Opvolging op prioriteit
```

---

## 3. Kwalificatielaag (nieuw, aan het begin)

### Q1 — Probleem / doel  *(reframe van huidige pad-keuze)*
**"Wat brengt je hier vandaag?"**

| Optie | Pad | Kleur |
|---|---|---|
| 🩹 Pijn of klachten | `pain` | oranje |
| 💪 Fitter & sterker worden | `fitness` | groen |
| 🤝 Doorgestuurd door fysio | `fysio` | blauw *(of automatisch via URL `?ref=fysio_…`)* |

### Q2 — Intentie  *(NIEUW — de belangrijkste kwalificatievraag)*
**"Wat past het best bij waar je nu staat?"**

| Optie | Betekenis | Punten |
|---|---|---|
| Ik wil dit **nú aanpakken met begeleiding** | koopt-klaar | 3 |
| Ik ben serieus, maar wil **eerst weten wat er speelt** | overweegt | 2 |
| Ik **oriënteer me** / doe het liever zelf | verkennend | 1 |

### Q3 — Urgentie  *(nu naar voren gehaald — stond verstopt in stap 2)*
**"Wanneer wil je beginnen?"**

| Optie | Punten |
|---|---|
| Direct | 3 |
| Deze week | 2 |
| Binnenkort | 1 |
| Nog geen concrete planning | 0 |

---

## 4. Lead-scoring & tiers

**Basis-score = intentie (1–3) + urgentie (0–3).**
Na de assessment worden modifiers opgeteld:

| Signaal | +punten |
|---|---|
| Pijn chronisch (3–12 mnd of > 1 jaar) | +1 |
| Pijnintensiteit ≥ 7 | +1 |
| ≥ 4 trainingsdagen beschikbaar | +1 |
| Leeftijd 25–55 (koopkrachtige kern) | +1 |

### Tier-drempels

| Tier | Score | Harde regels |
|---|---|---|
| 🔥 **Hot** | ≥ 6 | Intentie "nú aanpakken" + urgentie direct/deze week → **altijd Hot** |
| 🌤️ **Warm** | 3 – 5 | — |
| ❄️ **Koud** | ≤ 2 | Intentie "oriënteer me" → **nooit hoger dan Warm** (zelf-doener) |

> De harde regels overrulen de score, zodat een duidelijk koopsignaal nooit als koud wordt weggezet en een zelf-doener nooit je salestijd opslokt.

---

## 5. Vragen per tier (diepte)

**Gedeeld door iedereen (kern):** leeftijd · doelen (multi) + jaardoel (vrije tekst).

| Blok | 🔥 Hot | 🌤️ Warm | ❄️ Koud |
|---|:--:|:--:|:--:|
| Leeftijd | ✅ | ✅ | ✅ |
| Doelen + jaardoel-tekst | ✅ | ✅ | ✅ |
| Trainingsachtergrond | ✅ | ✅ | – |
| Werksituatie | ✅ | ✅ | ✅ (1 vraag context) |
| Werkuren | ✅ | – | – |
| Kinderen (+ aantal) | ✅ | – | – |
| Trainingsdagen beschikbaar | ✅ | ✅ | – |
| **Pijn** — locatie + timing | ✅ | ✅ | locatie alleen |
| **Pijn** — intensiteit + duur | ✅ | ✅ | intensiteit alleen |
| **Pijn** — bewegingstriggers | ✅ | – | – |

**Waarom deze verdeling:** hot leads zijn al geïnvesteerd — extra vragen leveren een betere salescall op én verhogen commitment (sunk cost). Koude leads wil je juist niet vermoeien: net genoeg om een waardevolle mini-uitkomst te geven en een e-mail te vangen.

---

## 6. Gate (contact) per tier — telefoon losgekoppeld van de uitkomst

**Kernprincipe:** gate de uitkomst nooit achter het telefoonnummer. Alle tiers zien hun resultaat met **alleen naam + e-mail**. Het nummer vraag je pas ná de uitkomst, op het CTA-moment, als de motivatie piekt.

| Tier | Om uitkomst te zien | Telefoon | Copy op CTA-moment |
|---|---|---|---|
| 🔥 Hot | naam + e-mail | optioneel, sterk aangemoedigd — **of** Calendly self-book | "Plan direct je gratis intake, of laat je nummer achter dan belt je coach je." |
| 🌤️ Warm | naam + e-mail | optioneel | "Wil je dat je coach je belt? Laat je nummer achter." |
| ❄️ Koud | **alleen e-mail** | optioneel veld | "Nummer achterlaten? Dan denkt je coach vrijblijvend mee." |

> Telefoon als harde poort vóór de waarde kost je juist je beste leads. Door het los te koppelen verlaag je de drempel voor iedereen én behoud je de bereikbaarheid van hot leads (via nummer óf geboekte Calendly-slot).

---

## 7. Uitkomst per tier

### 🔥 Hot
- **Pijn:** het volledige AI "Pijn & Prestatie-rapport" (zoals nu) — risico, primair gebied, bewegingsbeperkingen, correctief plan.
- **Fitness/fysio:** gepersonaliseerde **"Jouw 12-weken focusplan"**-preview — 3 pijlers afgeleid van doelen + situatie.
- **CTA:** directe belafspraak / kalender-embed. *"Plan je gratis intake — deze week nog 3 plekken."* (urgentie + schaarste)

### 🌤️ Warm
- Lichtere gepersonaliseerde mini-analyse / plan-preview (niet het volle rapport).
- **Zachte CTA:** *"Je coach bekijkt je profiel en neemt binnen 24 uur contact."* + alternatief *"Liever zelf een moment kiezen? Plan hier."*
- Toevoegen aan e-mail-nurtureflow.

### ❄️ Koud
- **Waarde-uitkomst:** top-3 focuspunten óf één concrete quick-win-oefening (video/pdf).
- **Nurture opt-in:** *"Ontvang onze 5-daagse mini-cursus."*
- Geen salescall — puur nurture. Bij engagement (opent mails / klikt) automatisch herscoren richting Warm.

---

## 8. Bron-specifieke aanpassingen (LinkedIn vs. ads)

Je legt UTM al vast — gebruik dat om de instap te sturen:

- **LinkedIn koude DM's:** ga uit van een koudere start. Overweeg de **intentievraag eerst** te tonen en probleem daarna. Personaliseer je eerste opvolg-DM met de **jaardoel-tekst** die ze invulden — dat verhoogt reply- en closerate sterk.
- **Meta-ads (pijn-hoek):** het probleem is al bekend uit de advertentie. Vul **Q1 automatisch voor** via UTM (bijv. `utm_content=pijn`) en spring direct naar de intentievraag. Scheelt een klik en verhoogt de completion rate.

---

## 9. Datamodel-uitbreiding (`/api/scan-submit`)

Voeg toe aan de POST-body zodat je platform/CRM automatisch kan routeren:

```json
{
  "intent": 1,             // 1-3
  "urgency_score": 0,      // 0-3
  "lead_score": 0,         // berekende totaalscore
  "lead_tier": "hot"       // "hot" | "warm" | "cold"
}
```

---

## 10. Implementatie-mapping naar bestaande code

De branch-engine bestaat al — dit is vooral uitbreiden, niet herbouwen.

| Bestaand | Wijziging |
|---|---|
| `scanPath` state (`pain`/`fitness`/`fysio`) | Blijft = probleem-as |
| — | Nieuw: `intent`, `urgencyScore`, afgeleide `leadTier` state |
| `getSteps()` | Wordt `getSteps(scanPath, leadTier)` → filtert de vragenset uit §5 |
| Uitkomst-render (`phase === "result"` / `success`) | Switch op `leadTier` i.p.v. alleen `scanPath` |
| Gate-velden | Conditioneel op `leadTier` (§6) |
| `submitToPlatform()` body | Voeg `intent`, `lead_score`, `lead_tier` toe (§9) |
| `startUrgency` (nu stap 2) | Verplaatsen naar de kwalificatielaag (Q3) |

---

## 11. Verwacht effect

- **Hogere leadkwaliteit:** koopintentie wordt vroeg zichtbaar; je coach belt eerst de hot leads.
- **Minder verspilde salestijd:** zelf-doeners gaan naar nurture i.p.v. de telefoon.
- **Hogere completion op koude traffic:** minder vragen = minder afhakers waar het telt.
- **Betere personalisatie:** elke lead krijgt een uitkomst die past, wat vertrouwen en closerate verhoogt.
