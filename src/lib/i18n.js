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
