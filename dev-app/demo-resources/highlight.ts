const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const tsKeywords = 'abstract as async await boolean break case catch class const constructor continue default delete do else enum export extends false finally for from function get if implements import in instanceof interface let new null number of private protected public readonly return set static string super switch this throw true try type typeof undefined var void while'.split(' ');

// one alternation per language, scanned left to right so a comment or string is never re-highlighted inside
const tsPattern = new RegExp(
  `(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)|('(?:\\\\.|[^'\\\\\\n])*'|"(?:\\\\.|[^"\\\\\\n])*"|\`(?:\\\\.|[^\`\\\\])*\`)|(\\b\\d[\\d._]*\\b)|\\b(${tsKeywords.join('|')})\\b|(@\\w+)`, 'g');
const htmlPattern = /(<!--[\s\S]*?-->)|(<\/?[\w-]+)|([\w.:@-]+)(?==)|("[^"]*"|'[^']*')|(\/?>)/g;

function wrap(text: string, pattern: RegExp, classes: (string | undefined)[]) {
  let out = '';
  let last = 0;
  text.replace(pattern, (match: string, ...groups: any[]) => {
    const offset = groups[groups.length - 2] as number;
    out += escapeHtml(text.slice(last, offset));
    const i = groups.slice(0, classes.length).findIndex(g => g !== undefined);
    out += i >= 0 && classes[i] ? `<span class="tok-${classes[i]}">${escapeHtml(match)}</span>` : escapeHtml(match);
    last = offset + match.length;
    return match;
  });
  return out + escapeHtml(text.slice(last));
}

/** Tiny syntax highlighter for the demo source pane: returns escaped HTML with `tok-*` spans. */
export function highlight(text: string, file: string): string {
  if (file.endsWith('.html')) {
    return wrap(text, htmlPattern, ['comment', 'tag', 'attr', 'string', 'tag']);
  }
  return wrap(text, tsPattern, ['comment', 'string', 'number', 'keyword', 'decorator']);
}
