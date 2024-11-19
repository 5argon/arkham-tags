/**
 * Read all tags used, and see if any are missing from the schema and tag JSON.
 * Append missing ones.
 */
const packFolder = "./json/pack";
const schema = "./json/schema.tags.json";
const tags = "./json/tags.json";

// Read all files in pack folder.
interface Card {
  code: string;
  name: string;
  text: string;
  tags: string[];
}

interface Schema {
  enum: string[];
}

interface Tag {
  name: string;
  description: string;
}

const uniqueTags = new Set<string>();
for await (const entry of Deno.readDir(packFolder)) {
  if (entry.isFile) {
    const content = await Deno.readTextFile(`${packFolder}/${entry.name}`);
    const card: Card[] = JSON.parse(content);
    card.forEach((c) => {
      c.tags.forEach((t) => {
        uniqueTags.add(t);
      });
    });
  }
}

// Read schema tags.
const schemaContent = await Deno.readTextFile(schema);
const schemaTags: Schema = JSON.parse(schemaContent);
const schemaTagSet = new Set(schemaTags.enum);
uniqueTags.forEach((t) => {
  schemaTagSet.add(t);
});
// Write schema tags.
schemaTags.enum = Array.from(schemaTagSet);
await Deno.writeTextFile(schema, JSON.stringify(schemaTags, null, 2));

