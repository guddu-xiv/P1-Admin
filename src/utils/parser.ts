import { ParsedQuestion } from "../types";

export function parseTestText(text: string): ParsedQuestion[] {
  if (!text || !text.trim()) return [];

  // Normalize newlines
  const normalized = "\n" + text.replace(/\r\n/g, "\n");

  // Try standard split on digits first
  let parts = normalized.split(/\n\s*\d+[\s.)\-:]+/);

  // Fallback 1: split on Q1, Q2, Question 1, etc.
  if (parts.length <= 1) {
    parts = normalized.split(/\n\s*(?:Q|q|Question|q\.)\s*\d+[\s.)\-:]*/);
  }

  // Fallback 2: split on double newlines
  if (parts.length <= 1) {
    parts = normalized.split(/\n\s*\n+/);
  }

  const questions: ParsedQuestion[] = [];

  for (const part of parts) {
    if (!part || !part.trim()) continue;

    const lines = part.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) continue;

    // The first line (or join the first few until an option block matches) is the question text
    let questionText = lines[0];
    const options: string[] = [];
    const optionAnalyses: string[] = [];
    let correctOption = 1;
    let explanation = "";
    let sourceVal = "";
    let questionImg = "";

    const potentialOptionLines: { text: string; analysis: string; isCorrect: boolean }[] = [];
    
    // Scan other lines
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Check for explanation marker
      if (line.toLowerCase().startsWith("ex:") || line.toLowerCase().startsWith("explanation:")) {
        explanation = line.replace(/^(ex:|explanation:)\s*/i, "").trim();
        continue;
      }

      // Check for image marker
      if (line.toLowerCase().startsWith("image:") || line.toLowerCase().startsWith("img:")) {
        questionImg = line.replace(/^(image:|img:)\s*/i, "").trim();
        continue;
      }

      // Check for source marker
      if (line.toLowerCase().startsWith("source:")) {
        sourceVal = line.replace(/^(source:)\s*/i, "").trim();
        continue;
      }

      // Split option and analysis
      let optionPart = line;
      let analysisPart = "";
      if (line.includes("///")) {
        const splitIdx = line.indexOf("///");
        optionPart = line.substring(0, splitIdx).trim();
        analysisPart = line.substring(splitIdx + 3).trim();
      }

      // Detect and clean correctness checkmarks
      const hasCheckmark = line.includes("✅") || line.includes("✔️") || line.includes("✔") || line.includes("☑") || line.includes("✓") || /[\u2705\u2714\ufe0f✅✔️☑️☑✓]/.test(line);
      const cleanCheckRegex = /[\u2705\u2714\ufe0f✅✔️☑️☑✓]/g;
      optionPart = optionPart.replace(cleanCheckRegex, "").trim();
      analysisPart = analysisPart.replace(cleanCheckRegex, "").trim();

      // Match Option prefixes: A) option, (A) option, A. option, [A] option, etc.
      const optionMatch = optionPart.match(/^([A-Da-d1-4a)b)c)d)\(A\)\(B\)\(C\)\(D\)]|[\(\[]?[A-Da-d1-4][\)\]]?)\s*[\s.)\-:]*(.*)$/);
      if (optionMatch && optionPart.length > 1 && !optionPart.toLowerCase().startsWith("http")) {
        let optionContent = optionMatch[2] ? optionMatch[2].trim() : optionPart.trim();
        options.push(optionContent);
        optionAnalyses.push(analysisPart);

        if (hasCheckmark) {
          correctOption = options.length; // 1-indexed
        }
      } else {
        potentialOptionLines.push({ text: optionPart, analysis: analysisPart, isCorrect: hasCheckmark });
      }
    }

    // Fallback: if we didn't match any formatted options, use any extra lines as options
    if (options.length === 0 && potentialOptionLines.length > 0) {
      for (const item of potentialOptionLines) {
        options.push(item.text);
        optionAnalyses.push(item.analysis);
        if (item.isCorrect) {
          correctOption = options.length;
        }
      }
    }

    // Even if options list is empty, let's provide default placeholder options list so the question is never lost
    const finalOptions = options.length > 0 ? options : ["Option A", "Option B", "Option C", "Option D"];

    // Clean question prefix if any
    let cleanedQText = questionText;
    if (cleanedQText.match(/^(?:Q|q|Question|q\.)\s*\d+[\s.)\-:]*/gi)) {
      cleanedQText = cleanedQText.replace(/^(?:Q|q|Question|q\.)\s*\d+[\s.)\-:]*/gi, "").trim();
    }

    questions.push({
      q: cleanedQText,
      o: finalOptions,
      c: correctOption,
      s: explanation || "No explanation provided.",
      source: sourceVal || undefined,
      image: questionImg || undefined,
      oa: optionAnalyses.some(a => a.trim().length > 0) ? optionAnalyses : undefined
    });
  }

  return questions;
}
