const indentationHandler: { keyword: string; before: number; after: number }[] = [
  {
    keyword: "Then",
    before: 0,
    after: 2,
  },
  {
    keyword: "Else",
    before: -2,
    after: 2,
  },
  {
    keyword: "EndIf",
    before: -2,
    after: 0,
  },
];

export function indentCovScript(input: string, currentIndentation = 0): string {
  const { handlerStartPosition, handler } = findFirstHandler(input);

  if (handlerStartPosition === undefined || handler === undefined) {
    return input.trim();
  }

  const handlerEndPosition = handler.keyword.length + handlerStartPosition;

  const before = input.substring(0, handlerStartPosition);
  const keyword = input.substring(handlerStartPosition, handlerEndPosition);
  const after = input.substring(handlerEndPosition);

  const nextIndentation = currentIndentation + handler.before + handler.after;
  const beforeIndentation = handler.before !== 0 ? "\n" + printSpaces(currentIndentation + handler.before) : " ";
  const afterIndentation = handler.after !== 0 ? "\n" + printSpaces(nextIndentation) : " ";

  return (
    before.trim() + beforeIndentation + keyword + afterIndentation + indentCovScript(after.trim(), nextIndentation)
  );
}

function findFirstHandler(input: string) {
  const firstPositionsOfEachHandler = indentationHandler.map(({ keyword }) =>
    input.toLowerCase().indexOf(keyword.toLowerCase())
  );

  if (firstPositionsOfEachHandler.every((it) => it === -1)) {
    return {
      handlerStartPosition: undefined,
      handler: undefined,
    };
  }

  const firstHandlerStartPosition = Math.min(...firstPositionsOfEachHandler.filter((it) => it >= 0));
  const firstHandler = indentationHandler[firstPositionsOfEachHandler.indexOf(firstHandlerStartPosition)];

  return {
    handlerStartPosition: firstHandlerStartPosition,
    handler: firstHandler,
  };
}

function printSpaces(nextLineIndentation: number) {
  return Array(Math.max(nextLineIndentation, 0)).fill(" ").join("");
}
