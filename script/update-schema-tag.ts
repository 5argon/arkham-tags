/**
 * Read all tags used, and see if any are missing from the schema and tag JSON.
 * Append missing ones.
 */
const packFolder = "./json/pack";
const schemaTagsJsonFile = "./json/schema.tags.json";
const tagsJsonFile = "./json/tags.json";

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

{
  const schemaContent = await Deno.readTextFile(schemaTagsJsonFile);
  const schemaTags: Schema = JSON.parse(schemaContent);
  const schemaTagSet = new Set(schemaTags.enum);

  const newTags = new Set<string>();
  uniqueTags.forEach((t) => {
    if (!schemaTagSet.has(t)) {
      newTags.add(t);
      schemaTagSet.add(t);
    }
  });

  const removedTags = new Set<string>();
  schemaTagSet.forEach((t) => {
    if (!uniqueTags.has(t)) {
      removedTags.add(t);
      schemaTagSet.delete(t);
    }
  });

  schemaTags.enum = Array.from(schemaTagSet);
  schemaTags.enum.sort();
  await Deno.writeTextFile(schemaTagsJsonFile, JSON.stringify(schemaTags, null, 2));

  if (newTags.size === 0) {
    console.log("No new tags to add to schema.tags.json.");
  } else {
    console.log(`Added ${newTags.size} new tags to schema : `);
    console.log(newTags);
  }

  if (removedTags.size === 0) {
    console.log("No unused tags to remove from schema.tags.json.");
  } else {
    console.log(`Removed ${removedTags.size} tags from schema : `);
    console.log(removedTags);
  }
}

{
  const tagsJsonRead = await Deno.readTextFile(tagsJsonFile);
  let tagsJson: Tag[] = JSON.parse(tagsJsonRead);
  // Do the same but for name-description pairs.
  const tagsJsonSet = new Set(tagsJson.map((t) => t.name));

  const newTags = new Set<string>();
  uniqueTags.forEach((t) => {
    if (!tagsJsonSet.has(t)) {
      newTags.add(t);
      tagsJson.push({ name: t, description: "" });
      tagsJsonSet.add(t);
    }
  });

  const removedTags = new Set<string>();
  tagsJsonSet.forEach((t) => {
    if (!uniqueTags.has(t)) {
      removedTags.add(t);
      tagsJson = tagsJson.filter((tag) => tag.name !== t);
      tagsJsonSet.delete(t);
    }
  });

  await Deno.writeTextFile(tagsJsonFile, JSON.stringify(tagsJson, null, 2));

  if (newTags.size === 0) {
    console.log("No new tags to add to tags.json.");
  } else {
    console.log(`Added ${newTags.size} new tags to tags.json : `);
    console.log(newTags);
  }

  if (removedTags.size === 0) {
    console.log("No unused tags to remove from tags.json.");
  } else {
    console.log(`Removed ${removedTags.size} tags from tags.json : `);
    console.log(removedTags);
  }
}
