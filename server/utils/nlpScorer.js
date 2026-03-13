const natural = require("natural");
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// ── Stop words ───────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","is","are","was","were","be","been","being","have","has",
  "had","do","does","did","will","would","could","should","may","might",
  "i","me","my","we","our","you","your","he","she","it","they","their",
  "this","that","these","those","not","no","so","as","if","then","than",
  "also","just","more","very","about","up","out","into","through","during",
]);

// ── Token cleaning ───────────────────────────────────────────────────────────
function cleanTokens(text) {
  return tokenizer
    .tokenize(text.toLowerCase())
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
    .map((t) => stemmer.stem(t));
}

// ── Cosine similarity ────────────────────────────────────────────────────────
function cosineSimilarity(vecA, vecB) {
  const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dot = 0, magA = 0, magB = 0;
  allTerms.forEach((t) => {
    const a = vecA[t] || 0;
    const b = vecB[t] || 0;
    dot  += a * b;
    magA += a * a;
    magB += b * b;
  });
  if (!magA || !magB) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// ── Build TF-IDF vector ──────────────────────────────────────────────────────
function buildVector(text, corpus) {
  const tfidf = new TfIdf();
  corpus.forEach((doc) => tfidf.addDocument(doc));
  tfidf.addDocument(text);
  const idx = corpus.length;
  const vec = {};
  tfidf.listTerms(idx).forEach(({ term, tfidf: score }) => {
    vec[term] = score;
  });
  return vec;
}

// ── Suggestion categories ────────────────────────────────────────────────────
const SUGGESTIONS_POOL = [
  "Add measurable achievements instead of general statements.",
  "Include a short professional summary at the top.",
  "Use strong action verbs like 'Led', 'Built', or 'Implemented'.",
  "Tailor your resume keywords to match this job description.",
  "Highlight your most relevant technical skills prominently.",
  "Add your latest certifications or side projects.",
  "Keep your resume clean, concise, and under 2 pages.",
  "Include LinkedIn or GitHub portfolio links clearly.",
  "Use bullet points for better readability throughout.",
  "Add metrics wherever possible (e.g., 'Improved speed by 30%').",
  "Remove outdated or irrelevant work experiences.",
  "Use keywords from the specific job description you are targeting.",
  "Ensure consistent font size and formatting throughout.",
  "Proofread carefully to eliminate typos and grammar errors.",
  "Highlight leadership, teamwork, and communication experiences.",
  "List tools, technologies, and frameworks you are proficient with.",
  "Show continuous learning with recent courses or certifications.",
  "Customize your resume for ATS systems with proper section headings.",
];

function getRandomSuggestions(score) {
  const count = score < 50 ? 6 : score < 70 ? 5 : 4;
  return [...SUGGESTIONS_POOL].sort(() => 0.5 - Math.random()).slice(0, count);
}

// ── Main scorer ──────────────────────────────────────────────────────────────
/**
 * scoreResume(resumeText, jobText)
 * Returns { score: 0-100, suggestions: string[] }
 */
function scoreResume(resumeText, jobText) {
  if (!resumeText || !jobText) return { score: 0, suggestions: SUGGESTIONS_POOL.slice(0, 5) };

  const resumeTokens = cleanTokens(resumeText).join(" ");
  const jobTokens    = cleanTokens(jobText).join(" ");

  // Build vectors with each other as corpus context
  const resumeVec = buildVector(resumeTokens, [jobTokens]);
  const jobVec    = buildVector(jobTokens,    [resumeTokens]);

  const similarity = cosineSimilarity(resumeVec, jobVec);
  const score = Math.min(100, Math.round(similarity * 120)); // scale to 0-100

  return {
    score,
    suggestions: getRandomSuggestions(score),
  };
}

module.exports = { scoreResume };
