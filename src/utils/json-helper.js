export function parseFromMkb(content) {
  if (!content) {
    throw Error("no mkb content provided");
  }
  content = content.replace(/\r\n/, '\n');
  const lines = content.split('\n');
  let lineNumber = findEmptyLine(lines);
  const description = lines.splice(0, lineNumber);
  if (!description.length) {
    throw Error("no description provided");
  }
  lines.shift();  // remove empty line
  lines.shift();  // remove questions header
  lineNumber = findEmptyLine(lines);
  const questions = lines.splice(0, lineNumber).map((l, idx) => ({
    idx: idx + 1,
    question: l,
  }));
  if (!questions.length) {
    throw Error("no questions provided");
  }
  lines.shift();  // remove empty line
  if (!lines.length) {
    throw Error("no hypothesises provided");
  }
  const hypothesises = lines.map(h => {
    const parts = h.split(',').map(p => p.trim());
    const hypothesis = parts.shift();     // take hypothesis as first item
    const p = parseFloat(parts.shift());  // take apriory p as second item
    const possibilities = [];             // the rest are possibilities
    if (parts.length % 3 !== 0) {
      throw Error("unbalanced parts count");
    }
    for (let i = 0; i < parts.length / 3; i += 1) {
      possibilities.push({
        question: parseInt(parts[i * 3]),
        pPlus: parseFloat(parts[i * 3 + 1]),
        pMinus: parseFloat(parts[i * 3 + 2]),
      });
    }
    return {
      hypothesis,
      p,
      possibilities,
    };
  });
  return {
    description,
    questions,
    hypothesises,
  };
}
export function parseFromJson(jsonString) {
  if (!jsonString) {
    throw Error("no json content provided");
  }
  const obj = JSON.parse(jsonString);
  console.log(obj);
  if (
    !obj ||
    !obj.description ||
    !obj.questions ||
    !obj.hypothesises ||
    !obj.description.length ||
    !obj.questions.length ||
    !obj.hypothesises.length ||
    obj.hypothesises.some(h => h.possibilities.some(p => Object.keys(p).length !== 3))
  ) {
    throw Error("invalid json content");
  }
  return obj;
}
function findEmptyLine(array) {
  return array.findIndex(el => !el);
}