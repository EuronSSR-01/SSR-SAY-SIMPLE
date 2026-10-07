// SSR-SAY-SIMPLE, 2026-10-07. Advisory plain-language checks, not STE certification.
export function textSize(text) {
  const han = text.match(/\p{Script=Han}/gu) || [];
  const words = text.replace(/\p{Script=Han}/gu, ' ').match(/[\p{L}\p{N}_]+(?:[.'’-][\p{L}\p{N}_]+)*/gu) || [];
  return { chinese: han.length > 0, units: han.length + words.length };
}

export function readabilityWarnings(text, { heading = false } = {}) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const { chinese, units } = textSize(clean);
  const warnings = [];
  if (chinese) {
    // Each Han character counts once; each non-Han word/number counts once.
    // These are project heuristics, not an English word count or STE rule.
    if (units > (heading ? 50 : 150)) warnings.push(`[简明中文] ${heading ? '陈述' : '段落'}较长（${units} 字词单位）；拆开不同重点，保留条件和例外。`);
    const sentences = clean.split(/(?<=[。！？!?])|(?<=\.)\s+/u).filter(s => s.trim());
    if (!heading && sentences.some(s => textSize(s).units > 50)) warnings.push('[简明中文] 有句子超过 50 字词单位；检查能否拆成短句，不删减必要信息。');
    if (sentences.length > 6) warnings.push('[简明中文] 一段超过 6 句；按主题分段。');
    const vague = ['赋能', '抓手', '全方位', '无缝衔接'].filter(w => clean.includes(w));
    if (vague.length) warnings.push(`[简明中文] 检查「${vague.join('、')}」能否写成具体动作或结果；若是必要术语则保留。`);
  } else {
    if (units > (heading ? 16 : 40)) warnings.push(`[Plain language] ${heading ? 'Claim' : 'Paragraph'} has ${units} words; consider separating its ideas.`);
    const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (!heading && sentences.some(s => textSize(s).units > 25)) warnings.push('[Plain language] A sentence exceeds 25 words; keep conditions and exceptions when shortening it.');
    if (sentences.length > 6) warnings.push('[Plain language] More than 6 sentences in one paragraph; split by topic.');
    const alternatives = { utilize: 'use', 'in order to': 'to', 'due to the fact that': 'because', aforementioned: 'a specific name' };
    for (const [word, suggestion] of Object.entries(alternatives)) {
      if (new RegExp(`\\b${word}\\b`, 'i').test(clean)) warnings.push(`[Plain language] Consider "${suggestion}" instead of "${word}" only if the meaning stays the same.`);
    }
  }
  // Never rewrite modals, obligation, probability, source quotes, or identifiers.
  return warnings;
}
