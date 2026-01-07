export const preprocessLaTeX = (content: string): string => {
  if (!content) return "";

  // Replace block-level LaTeX delimiters \[ \] with $$ $$
  let processed = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation.trim()}$$`
  );

  // Replace inline LaTeX delimiters \( \) with $ $
  processed = processed.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation.trim()}$`
  );

  return processed;
};
