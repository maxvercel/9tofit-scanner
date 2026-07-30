/**
 * Lightweight i18n for the scanner.
 *
 * Usage:
 *   import { useT } from '@/lib/i18n';
 *   const t = useT();
 *   return <h1>{t('Wat is je leeftijd?')}</h1>
 *
 * Locale is read from the `?lang=` URL param.
 * If no translation exists for a string in the active locale, the original NL string is returned
 * — so partial translation never breaks the UI.
 */

import { useEffect, useState } from 'react';

// Default locale; everything in the source code is in this language.
export const DEFAULT_LOCALE = 'nl';

// Supported locales for the picker
export const SUPPORTED_LOCALES = ['nl', 'en'];

/**
 * Translation dictionary: keys are exact Dutch source strings (the same text
 * that appears in JSX). Values are translations per locale.
 *
 * Adding more strings: just add a new entry — missing entries fall back to NL.
 */
const dict = {
  // ────────── LANDING ──────────
  'Gratis Performance Scan': { en: 'Free Performance Scan' },
  'Ontdek wat jouw': { en: 'Discover what your' },
  'lichaam': { en: 'body' },
  'nodig heeft.': { en: 'needs.' },
  'Of je nu sterker wilt worden, pijn wilt verhelpen, of doorgestuurd bent door een fysiotherapeut — deze scan geeft jouw coach een compleet beeld. In minder dan 3 minuten.': {
    en: 'Whether you want to get stronger, fix pain, or were referred by a physiotherapist — this scan gives your coach a complete picture. In less than 3 minutes.',
  },
  'Persoonlijk Profiel': { en: 'Personal Profile' },
  'Leeftijd, ervaring, doelen en situatie — alles wat je coach moet weten.': {
    en: 'Age, experience, goals and situation — everything your coach needs to know.',
  },
  'Pijn of Klachten?': { en: 'Pain or Complaints?' },
  'Heb je klachten? Dan krijg je direct een persoonlijke bewegingsanalyse en correctief plan.': {
    en: 'Have complaints? You get an instant personal movement analysis and corrective plan.',
  },
  'Coach Op Maat': { en: 'Custom Coach' },
  'Je coach bouwt een schema op basis van jouw unieke profiel. Geen standaard templates.': {
    en: 'Your coach builds a program based on your unique profile. No standard templates.',
  },
  'Start Je Scan': { en: 'Start Your Scan' },
  'Gratis · 3 minuten · Geen account nodig': {
    en: 'Free · 3 minutes · No account needed',
  },

  // ────────── PATH SELECTION ──────────
  'Welkom bij 9toFit': { en: 'Welcome to 9toFit' },
  'Wat brengt je hier vandaag?': { en: 'What brings you here today?' },
  'Fysio doorverwijzing': { en: 'Physio referral' },
  'Doorgestuurd door je fysiotherapeut — klachtenvrij en klaar om te trainen.': {
    en: 'Referred by your physiotherapist — symptom-free and ready to train.',
  },
  'Intake · Coach bouwt schema': { en: 'Intake · Coach builds program' },
  'Fitter & sterker worden': { en: 'Get fitter & stronger' },
  'Geen klachten — je wilt trainen met een persoonlijk schema op maat.': {
    en: 'No complaints — you want to train with a custom personal program.',
  },
  'Coach bouwt schema op maat': { en: 'Coach builds custom program' },

  // ────────── OPTIMALISATIE 2026: value-forward gate + landing ──────────
  'Je Performance Profiel is klaar.': { en: 'Your Performance Profile is ready.' },
  'Je herstelprofiel is klaar.': { en: 'Your recovery profile is ready.' },
  "Waar sturen we 'm heen?": { en: 'Where should we send it?' },
  'Vul je gegevens in en zie direct je bewegingsprofiel én je persoonlijke krachtplan — meteen te starten in de app.': { en: 'Enter your details and instantly see your movement profile and personal strength plan — ready to start in the app.' },
  'Vul je gegevens in en zie direct je herstelprofiel én je opbouwplan. Je coach plant daarna je intake in.': { en: 'Enter your details and see your recovery profile and rebuild plan right away. Your coach then schedules your intake.' },
  'Bewegingsprofiel: geanalyseerd': { en: 'Movement profile: analysed' },
  'Sterke punten + groeikans: in kaart': { en: 'Strengths + growth area: mapped' },
  'Krachtplan: gegenereerd': { en: 'Strength plan: generated' },
  'Opbouwplan: gegenereerd': { en: 'Rebuild plan: generated' },
  '2 weken app: klaar': { en: '2 weeks of app: ready' },
  'Sterker worden, klachten oplossen of terug na een blessure — in 3 minuten ken je je sterke punten, je grootste groeikans én heb je een plan om vandaag te starten.': { en: 'Get stronger, fix complaints or come back after an injury — in 3 minutes you know your strengths, your biggest growth area, and you have a plan to start today.' },
  'Persoonlijk profiel — je sterke punten én je grootste groeikans': { en: 'Personal profile — your strengths and your biggest growth area' },
  'Een concreet plan dat meteen klaarstaat': { en: "A concrete plan that's ready right away" },
  'Opbouwplan · Intake volgt': { en: 'Rebuild plan · Intake follows' },
  'Ontdek je grootste groeikans + een plan om nu te starten.': { en: 'Discover your biggest growth area + a plan to start now.' },
  'Profiel · Krachtplan klaar': { en: 'Profile · Strength plan ready' },
  'Bewegingsanalyse · 7-daags plan': { en: 'Movement analysis · 7-day plan' },
  'Gratis bewegingsonderzoek': { en: 'Free movement assessment' },
  'Van je blessure af —': { en: 'Rid of your injury —' },
  'zonder te stoppen met trainen.': { en: 'without stopping training.' },
  'Beantwoord de vragen die je normaal in de praktijk zou krijgen. Je krijgt direct een persoonlijk profiel en een gratis programma — of je nu een klacht hebt of gewoon sterker wilt worden.': { en: 'Answer the questions you would normally get at a practice intake. You instantly get a personal profile and a free program — whether you have a complaint or just want to get stronger.' },
  'Performance & herstelcoach · 9toFit': { en: 'Performance & recovery coach · 9toFit' },
  'Gratis bewegingsonderzoek · 7-daags plan': { en: 'Free movement assessment · 7-day plan' },

  // ────────── EN-dekking aanvullen (pre-existing gaten) + startschema→plan ──────────
  'Het Kantoorlijf-onderzoek': { en: 'The Office-Body study' },
  'Zittend werk sloopt je': { en: 'Desk work wears you down' },
  'rug en nek.': { en: 'back and neck.' },
  'Ontdek wat jouw lichaam nodig heeft.': { en: 'Discover what your body needs.' },
  'Doe de gratis 3-minuten scan. Je krijgt een persoonlijke bewegingsanalyse, een concreet plan op jouw klacht, én 2 weken de 9toFit-app om er meteen mee aan de slag te gaan.': { en: 'Take the free 3-minute scan. You get a personal movement analysis, a concrete plan for your complaint, and 2 weeks of the 9toFit app to start right away.' },
  '2 weken de 9toFit-app gratis — meteen beginnen': { en: '2 weeks of the 9toFit app free — start right away' },
  'Waar sta je nu?': { en: 'Where are you now?' },
  'Wat past het best bij jou?': { en: 'What fits you best?' },
  'Zo weet je coach precies hoe hij je het beste kan helpen.': { en: 'That way your coach knows exactly how to help you best.' },
  'Telefoonnummer (optioneel)': { en: 'Phone number (optional)' },
  'Bijv. 06 12 34 56 78': { en: 'E.g. 06 12 34 56 78' },
  'Check je telefoonnummer': { en: 'Check your phone number' },
  'Laat je (WhatsApp-)nummer achter zodat je coach je snel kan bereiken.': { en: 'Leave your (WhatsApp) number so your coach can reach you quickly.' },
  'Je persoonlijke rapport opbouwen — dit kan tot een minuut duren': { en: 'Building your personal report — this can take up to a minute' },
  'Geen haast — wanneer jij er klaar voor bent': { en: "No rush — whenever you're ready" },
  'Je coach neemt contact op': { en: 'Your coach will get in touch' },
  'Sparren kan — geheel vrijblijvend': { en: 'Happy to talk — no obligation' },
  'Je gaf aan er nu mee aan de slag te willen. Je coach Max neemt binnenkort via WhatsApp contact op om samen een plan te maken — of stuur zelf even een appje.': { en: 'You said you want to get started now. Your coach Max will reach out via WhatsApp soon to build a plan together — or just send a message yourself.' },
  'Je rapport staat hierboven, neem er rustig de tijd voor. Wil je later toch sparren, dan staat een gratis gesprek altijd open.': { en: "Your report is above — take your time. If you'd like to talk later, a free chat is always open." },
  'App je coach op WhatsApp →': { en: 'Message your coach on WhatsApp →' },
  'Plan vrijblijvend gesprek →': { en: 'Book a free chat →' },
  'Later een gesprek plannen': { en: 'Schedule a chat for later' },
  'Je persoonlijke plan staat klaar in de app. Omdat je er nu mee aan de slag wilt, neemt coach Max persoonlijk via WhatsApp contact op — of stuur zelf even een appje.': { en: 'Your personal plan is ready in the app. Since you want to get started now, coach Max will reach out personally via WhatsApp — or just send a message yourself.' },
  'Je persoonlijke plan staat klaar in de app — begin wanneer jij wilt. Geen druk; je coach denkt vrijblijvend mee als je daar behoefte aan hebt.': { en: 'Your personal plan is ready in the app — start whenever you like. No pressure; your coach is happy to help if you want.' },
  'Je persoonlijke plan staat klaar in de app. Je coach Max kijkt mee en verfijnt het op maat.': { en: 'Your personal plan is ready in the app. Your coach Max follows along and fine-tunes it for you.' },
  'Je persoonlijke plan staat al klaar in de app.': { en: 'Your personal plan is already waiting in the app.' },
  'Je coach Max kijkt mee en verfijnt je schema op maat terwijl je traint.': { en: 'Your coach Max follows along and fine-tunes your plan as you train.' },
  'Toon Mijn Profiel →': { en: 'Show My Profile →' },
  'Staat klaar': { en: 'Ready' },
  'Gratis · 3 minuten · direct je resultaat': { en: 'Free · 3 minutes · your result right away' },
  'Kies wat het best past — je bent in 3 minuten klaar.': { en: 'Pick what fits best — you’re done in 3 minutes.' },
  'Je profiel + plan staan meteen klaar · Geen spam, ooit': { en: 'Your profile + plan are ready right away · No spam, ever' },
  'Pijn of klachten': { en: 'Pain or complaints' },
  'Terugkerende blessures, stijfheid of pijn die je training belemmert.': {
    en: 'Recurring injuries, stiffness or pain that limits your training.',
  },
  'Persoonlijke bewegingsanalyse · Correctief plan': {
    en: 'Personal movement analysis · Corrective plan',
  },
  '← Terug': { en: '← Back' },

  // ────────── ASSESSMENT — progress & general ──────────
  'Stap': { en: 'Step' },
  'van': { en: 'of' },
  'Pijn & Prestatie Scan': { en: 'Pain & Performance Scan' },
  'Fysio Intake': { en: 'Physio Intake' },
  'Performance Scan': { en: 'Performance Scan' },
  'Doorgestuurd door je fysiotherapeut — je profiel is al voorbereid.': {
    en: 'Referred by your physiotherapist — your profile is already prepared.',
  },

  // ────────── ABOUT YOU ──────────
  'Over jou': { en: 'About you' },
  'Vertel ons over jezelf': { en: 'Tell us about yourself' },
  'Dit helpt je coach om het perfecte schema te bouwen.': {
    en: 'This helps your coach build the perfect program.',
  },
  'Leeftijd': { en: 'Age' },
  'Trainingservaring': { en: 'Training experience' },
  'Hoe lang train je al gestructureerd?': {
    en: 'How long have you been training structured?',
  },

  // AGE_RANGES labels
  '18-25 jaar': { en: '18-25 years' },
  '25-35 jaar': { en: '25-35 years' },
  '35-45 jaar': { en: '35-45 years' },
  '45-55 jaar': { en: '45-55 years' },
  '55+ jaar': { en: '55+ years' },

  // TRAINING_BACKGROUNDS labels
  'Nog niet begonnen': { en: 'Not started yet' },
  'Minder dan 6 maanden': { en: 'Less than 6 months' },
  '6 maanden – 2 jaar': { en: '6 months – 2 years' },
  '2 – 4 jaar': { en: '2 – 4 years' },
  '4+ jaar': { en: '4+ years' },

  // ────────── GOALS ──────────
  'Doelen': { en: 'Goals' },
  'Wat zijn je doelen?': { en: 'What are your goals?' },
  'Selecteer alles wat van toepassing is.': {
    en: 'Select everything that applies.',
  },
  'Beschrijf je 12-maanden doel (optioneel)': {
    en: 'Describe your 12-month goal (optional)',
  },
  "Bijv. 'Ik wil binnen een jaar een marathon kunnen lopen zonder pijn'": {
    en: "E.g. 'I want to run a marathon within a year, pain-free'",
  },
  // GOALS labels
  'Sterker worden': { en: 'Get stronger' },
  'Spiermassa opbouwen': { en: 'Build muscle' },
  'Afvallen / vet verliezen': { en: 'Lose weight / fat' },
  'Gezondheid verbeteren': { en: 'Improve health' },
  'Atletischer worden': { en: 'Become more athletic' },
  'Pijnvrij bewegen': { en: 'Move pain-free' },

  // ────────── SITUATION ──────────
  'Situatie': { en: 'Situation' },
  'Hoe ziet je leven eruit?': { en: 'What does your life look like?' },
  'Hoe meer context, hoe beter het schema.': {
    en: 'The more context, the better the program.',
  },
  'Werksituatie': { en: 'Work situation' },
  'Werkuren per week': { en: 'Work hours per week' },
  'Trainingsdagen per week beschikbaar': {
    en: 'Training days per week available',
  },
  'Wanneer wil je starten?': { en: 'When do you want to start?' },

  // WORK_SITUATIONS
  'Kantoor / bureau': { en: 'Office / desk' },
  'Vooral zittend, schermwerk': { en: 'Mostly sitting, screen work' },
  'Fysiek werk': { en: 'Physical work' },
  'Tillen, staan, repetitief': { en: 'Lifting, standing, repetitive' },
  'Staand werk': { en: 'Standing work' },
  'Retail, horeca, medisch': { en: 'Retail, hospitality, medical' },
  'Thuiswerk': { en: 'Working from home' },
  'Variabele houding': { en: 'Variable posture' },
  'Veel onderweg': { en: 'Often on the road' },
  'Lange ritten of vluchten': { en: 'Long drives or flights' },

  // WORK_HOURS
  '<16 uur': { en: '<16 hrs' },
  '24 uur': { en: '24 hrs' },
  '32 uur': { en: '32 hrs' },
  '40 uur': { en: '40 hrs' },
  '46+ uur': { en: '46+ hrs' },

  // START_URGENCIES
  'Direct': { en: 'Right away' },
  'Deze week': { en: 'This week' },
  'Binnenkort': { en: 'Soon' },

  // ────────── PAIN PATH ──────────
  'Waar zit de pijn?': { en: 'Where is the pain?' },
  'Selecteer alle gebieden waar je klachten ervaart.': {
    en: 'Select every area where you experience complaints.',
  },
  'Wanneer voel je het?': { en: 'When do you feel it?' },
  'Pijn details': { en: 'Pain details' },
  'Hoe intens en hoe lang?': { en: 'How intense and how long?' },
  'Pijnintensiteit (op je ergst)': { en: 'Pain intensity (at its worst)' },
  'Hoe lang heb je deze klachten al?': {
    en: 'How long have you had these complaints?',
  },
  'Bewegingstriggers': { en: 'Movement triggers' },
  'Welke bewegingen geven pijn?': { en: 'Which movements cause pain?' },
  'Selecteer alles wat pijn veroorzaakt of verergert.': {
    en: 'Select everything that causes or worsens pain.',
  },

  // PAIN_LOCATIONS
  'Onderrug': { en: 'Lower back' },
  'Lendenen regio': { en: 'Lumbar region' },
  'Knie': { en: 'Knee' },
  'Voor, achter of zijkant': { en: 'Front, back or side' },
  'Schouder': { en: 'Shoulder' },
  'Gewricht of omliggende gebied': { en: 'Joint or surrounding area' },
  'Heup': { en: 'Hip' },
  'Gewricht, billen of lies': { en: 'Joint, glutes or groin' },
  'Nek / Bovenste Trapezius': { en: 'Neck / Upper Trapezius' },
  'Halswervels': { en: 'Cervical vertebrae' },
  'Enkel / Voet': { en: 'Ankle / Foot' },
  'Inclusief Achillespees': { en: 'Including Achilles tendon' },
  'Pols / Elleboog': { en: 'Wrist / Elbow' },
  'Onderarmen': { en: 'Forearms' },
  'Bovenrug / Thoracaal': { en: 'Upper back / Thoracic' },
  'Middenwervels': { en: 'Mid vertebrae' },

  // PAIN_TIMINGS
  'Ochtendstijfheid': { en: 'Morning stiffness' },
  'Eerste 30–60 minuten': { en: 'First 30–60 minutes' },
  'Tijdens training': { en: 'During training' },
  'Pijn treedt op tijdens oefening': { en: 'Pain occurs during exercise' },
  'Na training': { en: 'After training' },
  'Vertraagde pijn': { en: 'Delayed pain' },
  'Na lang zitten': { en: 'After sitting long' },
  'Bureau, auto of bank': { en: 'Desk, car or couch' },
  'Bepaalde bewegingen': { en: 'Certain movements' },
  'Buigen, draaien, belasten': { en: 'Bending, twisting, loading' },
  'Constant / hele dag': { en: 'Constant / all day' },
  'Geen duidelijk patroon': { en: 'No clear pattern' },

  // PAIN_TRIGGERS
  'Voorover buigen': { en: 'Bending forward' },
  'Heupgewricht of flexie': { en: 'Hip joint or flexion' },
  'Draaien / torsie': { en: 'Twisting / torsion' },
  'Romp- of gewrichtrotatie': { en: 'Trunk or joint rotation' },
  'Omhoog reiken': { en: 'Reaching up' },
  'Naar boven drukken of trekken': { en: 'Pressing or pulling up' },
  'Van zitten naar staan': { en: 'Sit-to-stand' },
  'Overgangsbewegingen': { en: 'Transition movements' },
  'Hardlopen / impact': { en: 'Running / impact' },
  'Belasting bij voetcontact': { en: 'Load at foot contact' },
  'Squatten / longes': { en: 'Squatting / lunges' },
  'Kniedominante patronen': { en: 'Knee-dominant patterns' },

  // PAIN_DURATIONS
  'Minder dan 1 maand': { en: 'Less than 1 month' },
  'Recent ontstaan': { en: 'Recently started' },
  '1–3 maanden': { en: '1–3 months' },
  'Sub-acute fase': { en: 'Sub-acute phase' },
  '3–12 maanden': { en: '3–12 months' },
  'Chronisch patroon': { en: 'Chronic pattern' },
  'Meer dan een jaar': { en: 'More than a year' },
  'Langdurige klacht': { en: 'Long-standing complaint' },

  // ────────── ANALYZE STEPS ──────────
  'Pijnpatroon data verwerken…': { en: 'Processing pain pattern data…' },
  'Bewegingsbeperkingen in kaart brengen…': {
    en: 'Mapping movement limitations…',
  },
  'Risicofactoren berekenen…': { en: 'Calculating risk factors…' },
  '7-daags correctief plan genereren…': {
    en: 'Generating 7-day corrective plan…',
  },

  // ────────── GATE / EMAIL FORM ──────────
  'Bijna klaar': { en: 'Almost done' },
  'Waar mag je coach contact opnemen?': {
    en: 'Where should your coach reach out?',
  },
  'Je krijgt jouw persoonlijke analyse direct in je mail.': {
    en: "You'll receive your personal analysis straight to your inbox.",
  },
  'Naam': { en: 'Name' },
  'Voornaam': { en: 'First name' },
  'Email': { en: 'Email' },
  'Stuur mijn analyse': { en: 'Send my analysis' },
  'Versturen…': { en: 'Sending…' },
  'Door verder te gaan ga je akkoord dat we je gegevens gebruiken om je coach voor te bereiden. Geen spam.': {
    en: 'By continuing you agree that we use your data to prepare your coach. No spam.',
  },
  '← Vorige': { en: '← Previous' },
  'Volgende →': { en: 'Next →' },

  // ────────── ANALYZING ──────────
  'Analyse loopt…': { en: 'Analysis running…' },
  'Even geduld, je rapport wordt gegenereerd.': {
    en: 'Hang tight, your report is being generated.',
  },

  // ────────── RESULT ──────────
  'Jouw analyse is klaar': { en: 'Your analysis is ready' },
  'Risico-niveau': { en: 'Risk level' },
  'Laag': { en: 'Low' },
  'Matig': { en: 'Moderate' },
  'Hoog': { en: 'High' },
  'Wat we zien': { en: 'What we see' },
  'Wat we adviseren': { en: 'What we recommend' },
  'Jouw 7-daagse correctief plan': { en: 'Your 7-day corrective plan' },
  'Dag': { en: 'Day' },
  'Wat we afraden': { en: 'What to avoid' },
  'Volgende stap': { en: 'Next step' },
  'Je rapport is verstuurd naar je email. Je coach neemt binnen 24 uur contact op.': {
    en: 'Your report has been sent to your email. Your coach will contact you within 24 hours.',
  },

  // ────────── SUCCESS ──────────
  'Bedankt!': { en: 'Thank you!' },
  'Je gegevens zijn ontvangen.': { en: 'Your details have been received.' },
  'Je rapport is naar je email gestuurd.': {
    en: 'Your report has been sent to your email.',
  },
  'Je coach neemt binnen 24 uur contact met je op.': {
    en: 'Your coach will contact you within 24 hours.',
  },

  // ────────── ERRORS ──────────
  'Er ging iets mis. Probeer het opnieuw.': {
    en: 'Something went wrong. Please try again.',
  },
  'Email niet geldig': { en: 'Invalid email' },
  'Naam is verplicht': { en: 'Name is required' },

  // ────────── EXTENDED — assessment & nav ──────────
  'Trainingsachtergrond': { en: 'Training background' },
  'Doelen & Motivatie': { en: 'Goals & Motivation' },
  'Wat wil je bereiken?': { en: 'What do you want to achieve?' },
  'Wat wil je het komende jaar bereiken?': {
    en: 'What do you want to achieve in the coming year?',
  },
  "Bijv. 'Pijnvrij 3x per week trainen', 'Weer een marathon lopen', '10 kg afvallen en sterker worden'…": {
    en: "E.g. 'Train pain-free 3x per week', 'Run a marathon again', 'Lose 10 kg and get stronger'…",
  },
  'Optioneel — maar hoe specifieker, hoe beter je coach je kan helpen.': {
    en: 'Optional — but the more specific, the better your coach can help.',
  },
  'Volgende →': { en: 'Next →' },
  'Verder →': { en: 'Continue →' },
  'Jouw Situatie': { en: 'Your situation' },
  'Hoe ziet jouw dag en week eruit?': {
    en: 'What does your day and week look like?',
  },
  'Je werksituatie en beschikbaarheid bepalen de opbouw van je schema.': {
    en: 'Your work situation and availability determine your program structure.',
  },
  'Heb je kinderen?': { en: 'Do you have children?' },
  'Nee': { en: 'No' },
  'Ja': { en: 'Yes' },
  'Hoeveel kinderen?': { en: 'How many children?' },
  'Hoeveel dagen per week kun je trainen?': {
    en: 'How many days per week can you train?',
  },
  'dagen': { en: 'days' },

  // ────────── PAIN PATH (extended) ──────────
  'Pijnanalyse': { en: 'Pain analysis' },
  'Waar ervaar je pijn of ongemak?': {
    en: 'Where do you experience pain or discomfort?',
  },
  'Selecteer alle gebieden die van toepassing zijn.': {
    en: 'Select all areas that apply.',
  },
  'Wanneer heb je de meeste last?': { en: 'When do you feel it most?' },
  'Hoe erg en hoe lang heb je last?': {
    en: 'How severe and how long?',
  },
  'Dit bepaalt de aanpak en urgentie van je plan.': {
    en: 'This determines the approach and urgency of your plan.',
  },
  'Gemiddeld pijnniveau (1–10)': { en: 'Average pain level (1–10)' },
  'Licht ongemak': { en: 'Mild discomfort' },
  'Ondraaglijk': { en: 'Unbearable' },
  'Hoe lang heb je al last?': {
    en: 'How long have you had complaints?',
  },
  'Welke bewegingen verergeren de pijn?': {
    en: 'Which movements worsen the pain?',
  },

  // ── NIEUW: klinische verdieping ──
  'Hoe is de klacht ontstaan?': { en: 'How did the complaint start?' },
  'Het ontstaan zegt veel over de oorzaak en de juiste aanpak.': {
    en: 'How it started tells us a lot about the cause and the right approach.',
  },
  'Wat verlicht de klacht?': { en: 'What eases the complaint?' },
  'Herken je een van deze signalen?': {
    en: 'Do you recognise any of these signs?',
  },
  'Belangrijk om serieus te screenen voordat we een plan opstellen.': {
    en: 'Important to screen carefully before we build a plan.',
  },
  'Welke bewegingen lukken niet pijnvrij?': {
    en: 'Which movements are not pain-free?',
  },
  'Dit bepaalt hoe we je klacht inschatten en aanpakken.': {
    en: 'This determines how we assess and approach your complaint.',
  },
  'Dit helpt ons je profiel en aanpak op maat te maken.': {
    en: 'This helps us tailor your profile and approach.',
  },
  'Plotseling / na een moment': { en: 'Suddenly / after a moment' },
  'Verkeerde beweging, tillen of sport': { en: 'Wrong movement, lifting or sport' },
  'Geleidelijk opgebouwd': { en: 'Built up gradually' },
  'Sluipend erger geworden': { en: 'Gradually got worse' },
  'Na periode van inactiviteit': { en: 'After a period of inactivity' },
  'Na rust, ziekte of veel zitten': { en: 'After rest, illness or lots of sitting' },
  'Geen duidelijke aanleiding': { en: 'No clear cause' },
  'Zomaar ontstaan': { en: 'Came out of nowhere' },
  'Rust': { en: 'Rest' },
  'Even niets doen lucht op': { en: 'Doing nothing for a bit relieves it' },
  'Bewegen / warm worden': { en: 'Moving / warming up' },
  'Losser na opwarmen': { en: 'Looser after warming up' },
  'Rekken / mobiliseren': { en: 'Stretching / mobilising' },
  'Stretchen helpt': { en: 'Stretching helps' },
  'Warmte of kou': { en: 'Heat or cold' },
  'Warmtepakking of ijs': { en: 'Heat pack or ice' },
  'Niets helpt echt': { en: 'Nothing really helps' },
  'Blijft constant aanwezig': { en: 'Stays constantly present' },
  'Uitstraling of tintelingen': { en: 'Radiating pain or tingling' },
  'Naar arm, been, hand of voet': { en: 'Into arm, leg, hand or foot' },
  'Krachtverlies of gevoelloosheid': { en: 'Loss of strength or numbness' },
  'Spierzwakte of doof gevoel': { en: 'Muscle weakness or numb feeling' },
  "Pijn die je 's nachts wakker maakt": { en: 'Pain that wakes you at night' },
  'Wordt niet minder in rust': { en: "Doesn't ease with rest" },
  'Nee, niets hiervan': { en: 'No, none of these' },
  'Geen van deze signalen': { en: 'None of these signs' },
  'Door de knieën zakken': { en: 'Squatting down' },
  'Hurken doet pijn of lukt niet': { en: 'Squatting hurts or is impossible' },
  'Boven je hoofd reiken': { en: 'Reaching overhead' },
  'Arm heffen beperkt of pijnlijk': { en: 'Raising the arm is limited or painful' },
  'Op één been staan': { en: 'Standing on one leg' },
  'Balans of stabiliteit slecht': { en: 'Poor balance or stability' },
  'Bukken naar je tenen': { en: 'Bending to your toes' },
  'Voorover buigen beperkt': { en: 'Forward bending is limited' },
  'Deze gaan allemaal prima': { en: 'These are all fine' },
  'Geen beperking hierin': { en: 'No limitation here' },

  'Bekijk Mijn Analyse →': { en: 'See My Analysis →' },

  // ────────── GATE (extended) ──────────
  'Scan voltooid': { en: 'Scan complete' },
  'Pijn & Prestatie Analyse': { en: 'Pain & Performance Analysis' },
  'Performance Profiel': { en: 'Performance Profile' },
  'Je rapport is klaar.': { en: 'Your report is ready.' },
  'Waar moeten we het naartoe sturen?': {
    en: 'Where should we send it?',
  },
  'Nog één stap.': { en: 'One more step.' },
  'Hoe kunnen we je bereiken?': { en: 'How can we reach you?' },
  'Vul je gegevens in om je persoonlijke bewegingsanalyse en 7-daags correctief plan direct via e-mail te ontvangen.': {
    en: 'Enter your details to receive your personal movement analysis and 7-day corrective plan directly by email.',
  },
  'Je coach ontvangt je volledige profiel en neemt binnen 24 uur contact met je op om je schema te bespreken.': {
    en: 'Your coach receives your complete profile and will contact you within 24 hours to discuss your program.',
  },
  'probeer het opnieuw': { en: 'please try again' },
  'Bewegingsbeperkingen: geïdentificeerd': {
    en: 'Movement limitations: identified',
  },
  'Risico Niveau: geanalyseerd': { en: 'Risk Level: analyzed' },
  '7-Daags Plan: gegenereerd': { en: '7-Day Plan: generated' },
  'Expert Beoordeling: gereed': { en: 'Expert Assessment: ready' },
  'E-mailadres': { en: 'Email address' },
  'Jan': { en: 'John' },
  'jan@voorbeeld.nl': { en: 'john@example.com' },
  'Check je emailadres — dit lijkt niet geldig': {
    en: 'Check your email address — this does not look valid',
  },
  'Naam fysiotherapeut / praktijk (optioneel)': {
    en: 'Physiotherapist / practice name (optional)',
  },
  'Bijv. FysioFit Amsterdam': { en: 'E.g. FysioFit Amsterdam' },
  'Bezig met versturen…': { en: 'Sending…' },
  'Analyseer Mijn Beweging →': { en: 'Analyze My Movement →' },
  'Verstuur Naar Mijn Coach →': { en: 'Send To My Coach →' },
  'Je resultaten worden direct gemaild · Geen spam, ooit': {
    en: 'Your results will be emailed directly · No spam, ever',
  },
  'Je coach ontvangt je volledige profiel · Geen spam, ooit': {
    en: 'Your coach receives your complete profile · No spam, ever',
  },

  // ────────── ANALYZING (extended) ──────────
  'Je bewegingsprofiel analyseren…': { en: 'Analyzing your movement profile…' },
  'Je persoonlijke rapport opbouwen': {
    en: 'Building your personal report',
  },

  // ────────── RESULT ──────────
  'Pijn & Prestatie Rapport': { en: 'Pain & Performance Report' },
  'Bewegingsanalyse': { en: 'Movement analysis' },
  'voltooid voor': { en: 'completed for' },
  'Risico:': { en: 'Risk:' },
  'Primair:': { en: 'Primary:' },
  'Geïdentificeerde Bewegingsbeperkingen': {
    en: 'Identified Movement Limitations',
  },
  'Zie gedetailleerde analyse in je e-mail.': {
    en: 'See detailed analysis in your email.',
  },
  'Risicofactor Analyse': { en: 'Risk Factor Analysis' },
  'Expert Beoordeling': { en: 'Expert Assessment' },
  'Je 7-Daags Correctief Plan': { en: 'Your 7-Day Corrective Plan' },
  'Aanbevolen volgende stap': { en: 'Recommended next step' },
  'Boek een Gratis Strategiegesprek': { en: 'Book a Free Strategy Call' },
  'Op basis van jouw profiel zou een 30-minuten sessie met Max je een precieze diagnose geven en een versnellingsprotocol gericht op jouw lichaam en leefstijl.': {
    en: 'Based on your profile, a 30-minute session with Max would give you a precise diagnosis and an acceleration protocol tailored to your body and lifestyle.',
  },
  'Boek Gratis Gesprek →': { en: 'Book Free Call →' },
  'Volledig rapport verzonden naar': {
    en: 'Full report sent to',
  },
  'Je rapport via e-mail versturen…': {
    en: 'Sending your report by email…',
  },
  '← Nieuwe Scan Starten': { en: '← Start New Scan' },

  // ────────── SUCCESS (extended) ──────────
  'Je intake is ontvangen!': { en: 'Your intake has been received!' },
  'Je profiel is verzonden!': { en: 'Your profile has been sent!' },
  'Je coach Max ontvangt nu je volledige profiel en neemt zo snel mogelijk contact met je op om je programma te bespreken.': {
    en: 'Your coach Max now has your complete profile and will contact you as soon as possible to discuss your program.',
  },
  'Je coach Max heeft je profiel ontvangen en bouwt een schema op maat. Je ontvangt binnen 24 uur bericht.': {
    en: 'Your coach Max has received your profile and is building a custom program. You will hear back within 24 hours.',
  },
  'Check je inbox — je ontvangt een magic link om direct in te loggen in de 9toFit app.': {
    en: 'Check your inbox — you will receive a magic link to log in directly to the 9toFit app.',
  },
  'Kies je pakket in de app — je coach gaat dan direct aan de slag met jouw persoonlijke schema.': {
    en: 'Pick your plan in the app — your coach will then get straight to work on your personal program.',
  },
  'Je coach plant een persoonlijke intake met je in.': {
    en: 'Your coach will schedule a personal intake with you.',
  },
  'Je ontvangt binnen 24 uur je schema op maat.': {
    en: 'You will receive your custom program within 24 hours.',
  },
  'Plan een Kennismakingsgesprek →': { en: 'Schedule an Intro Call →' },

  // ────────── V2: LOSSE CONTACTSTAPPEN (naam → e-mail → telefoon) ──────────
  'Hoe mogen we je noemen?': { en: 'What should we call you?' },
  'Waar mag je rapport naartoe?': { en: 'Where should we send your report?' },
  'Waar mag je profiel naartoe?': { en: 'Where should we send your profile?' },
  'Laatste stap: sneller contact?': { en: 'Last step: faster contact?' },
  'Nog drie korte vragen, dan ontvang je direct je persoonlijke bewegingsanalyse.': {
    en: 'Three short questions to go, then you instantly receive your personal movement analysis.',
  },
  'Nog drie korte vragen, dan zie je direct je herstelprofiel én je opbouwplan.': {
    en: 'Three short questions to go, then you instantly see your recovery profile and rebuild plan.',
  },
  'Nog drie korte vragen, dan zie je direct je bewegingsprofiel én je persoonlijke krachtplan.': {
    en: 'Three short questions to go, then you instantly see your movement profile and personal strength plan.',
  },
  'Zo spreken we je aan in je rapport.': { en: 'This is how we address you in your report.' },
  'Hier ontvang je je rapport én je inloglink voor de 9toFit-app.': {
    en: 'This is where you receive your report and your login link for the 9toFit app.',
  },
  'Hier ontvang je je profiel én je inloglink voor de 9toFit-app.': {
    en: 'This is where you receive your profile and your login link for the 9toFit app.',
  },
  'Je resultaten worden direct gemaild': { en: 'Your results are emailed right away' },
  'Je profiel + plan staan meteen klaar': { en: 'Your profile + plan are ready right away' },

  // ────────── V2: ALARMSIGNALEN → EERST EEN GRATIS CHECK-GESPREK ──────────
  'Persoonlijk advies': { en: 'Personal advice' },
  'Eerst even goed kijken,': { en: 'Let’s take a proper look first,' },
  'Waarom je nu geen standaard oefenplan krijgt': { en: 'Why you’re not getting a standard exercise plan right now' },
  'Je gaf een of meer signalen aan die we serieus nemen:': {
    en: 'You indicated one or more signals we take seriously:',
  },
  'Geen reden voor paniek — dit soort signalen komt vaak voor en is meestal goed te verhelpen. Maar er online zomaar oefeningen op loslaten zou niet professioneel zijn. Daarom krijg je van ons iets beters dan een standaard plan: Max kijkt eerst persoonlijk met je mee, gratis en vrijblijvend. Daarna weet je zeker dat wat je doet ook veilig is.': {
    en: 'No reason to panic — these signals are common and usually very treatable. But throwing online exercises at them without a proper check wouldn’t be professional. So instead of a standard plan you get something better: Max first takes a personal look with you, free and without obligation. After that you know for sure that what you do is safe.',
  },
  'Plan je gratis check-gesprek': { en: 'Book your free check-up call' },
  'In een kort gesprek (telefonisch of in de studio) loopt Max je signalen met je door en hoor je direct wat wél veilig kan. Vaak kun je daarna gewoon aan de slag.': {
    en: 'In a short call (by phone or at the studio) Max goes through your signals with you and tells you right away what is safe to do. Often you can simply get started afterwards.',
  },
  'Plan Gratis Check-Gesprek →': { en: 'Book Free Check-Up Call →' },
  'Liever appen?': { en: 'Prefer WhatsApp?' },
  'Stuur Max een WhatsApp-bericht': { en: 'Send Max a WhatsApp message' },
  'Bij plotselinge hevige klachten, koorts of verlies van controle over blaas of darmen: neem vandaag nog contact op met je huisarts.': {
    en: 'With sudden severe symptoms, fever, or loss of bladder or bowel control: contact your GP today.',
  },
  // ────────── V3: ÉÉN VRAAG PER SCHERM ──────────
  'Leeftijd bepaalt hoe we belasting en herstel voor je inschatten.': { en: 'Your age tells us how to gauge load and recovery for you.' },
  'Wat is je trainingservaring?': { en: 'What is your training experience?' },
  'Zo stemmen we het startniveau precies op jou af.': { en: 'This lets us match the starting level exactly to you.' },
  'Hoe ziet je werkdag eruit?': { en: 'What does your workday look like?' },
  'Je werkhouding heeft directe invloed op je lichaam en je schema.': { en: 'Your work posture directly affects your body and your program.' },
  'Hoeveel uur werk je per week?': { en: 'How many hours do you work per week?' },
  'Zo schatten we je belasting en beschikbare energie in.': { en: 'This helps us gauge your load and available energy.' },
  'Zo houden we in je schema rekening met je agenda en je herstel.': { en: 'This lets your program account for your schedule and recovery.' },
  'Wees realistisch — consistentie wint van volume.': { en: 'Be realistic — consistency beats volume.' },
  'Geen verplichting — dit helpt je coach de juiste prioriteit te geven.': { en: 'No obligation — this helps your coach prioritise.' },
  'Kies het moment dat het meest opvalt.': { en: 'Pick the moment that stands out most.' },
  "Hoe erg is de pijn op z'n slechtste moment?": { en: 'How bad is the pain at its worst?' },
  'De duur zegt veel over de fase waarin je klacht zit.': { en: 'Duration says a lot about the phase your complaint is in.' },
  'Selecteer alles wat helpt — ook een beetje telt.': { en: 'Select everything that helps — even a little counts.' },
  'Een snelle functietest — kies wat niet soepel gaat.': { en: 'A quick function test — pick what does not move smoothly.' },

  'Dit advies is ook gemaild naar': { en: 'This advice was also emailed to' },
  'Je aanmelding is binnen — Max weet ervan en neemt contact met je op.': {
    en: 'Your submission is in — Max knows about it and will get in touch.',
  },
};

/**
 * Get translation for a string in the given locale.
 * Falls back to the input string if no translation exists.
 */
export function translate(text, locale = DEFAULT_LOCALE) {
  if (locale === DEFAULT_LOCALE) return text;
  const entry = dict[text];
  if (entry && entry[locale]) return entry[locale];
  return text; // Safe fallback — never returns undefined
}

/**
 * Read locale from URL `?lang=` param.
 * Returns 'nl' (default) or 'en'.
 * SSR-safe: returns DEFAULT_LOCALE on the server.
 */
export function getLocaleFromUrl() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const params = new URLSearchParams(window.location.search);
    const lang = (params.get('lang') || '').toLowerCase();
    if (SUPPORTED_LOCALES.includes(lang)) return lang;
  } catch (_) {
    // Silently fall back
  }
  return DEFAULT_LOCALE;
}

/**
 * React hook returning a translate function bound to the current locale.
 *
 * Usage:
 *   const t = useT();
 *   <h1>{t('Wat is je leeftijd?')}</h1>
 */
export function useT() {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    setLocale(getLocaleFromUrl());
  }, []);

  // Returning a stable function that just calls translate with current locale.
  return (text) => translate(text, locale);
}

/**
 * React hook returning the current locale string.
 */
export function useLocale() {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  useEffect(() => {
    setLocale(getLocaleFromUrl());
  }, []);
  return locale;
}
