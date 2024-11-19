// run with bun (Node)
type TsvRow = string[];
type Tsv = TsvRow[];
type TsvTransposed = TsvRow[];

const read = "Tag Cards - DWL.tsv";
const fileContent = Deno.readTextFileSync(read);

function readTsv(read: string): Tsv {
  return read.split("\n").map((row) => row.split("\t"));
}

const tsv = readTsv(fileContent);
const tsvTransposed = tsv[0].map((_, i) => tsv.map((row) => row[i]));

// For each column, index 2 onwards are tags separated by comma. Turn them into only one tag per cell, no comma.
const tsvTransposedFixed: TsvTransposed = [];
for (let i = 0; i < tsvTransposed.length; i++) {
  const column = tsvTransposed[i];
  const collectTags: string[] = [];
  for (let j = 2; j < column.length; j++) {
    const tags = column[j].split(", ");
    for (let tag of tags) {
      const trimmed = tag.trim();
      if (trimmed === "") {
        continue;
      }
      if (!collectTags.includes(tag)) {
        collectTags.push(trimmed);
      }
    }
  }
  tsvTransposedFixed.push([...collectTags]);
}

const csvText = tsvTransposedFixed.map((row) => row.join(",")).join("\n");
// write to file
const write = "Result.csv";
Deno.writeTextFileSync(write, csvText);
