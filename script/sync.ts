import * as mod from "https://deno.land/std@0.224.0/fs/empty_dir.ts";

/**
 * Read all tags used, and see if any are missing from the schema and tag JSON.
 * Append missing ones.
 */
const packFolder = "./json/input/pack";
const compoundTagsFile = "./json/input/compound-tags.json";
const schemaTagsJsonFile = "./json/output/schema.tags.json";
const tagsJsonFile = "./json/input/tags.json";
const cardsTaggedFile = "./json/output/tagged-cards.json";
const tagsTs = "./src/tags.ts";

const statsUsageRanking = "./json/statistics/usage-ranking.csv";
const statsUpToFive = "./json/statistics/up-to-five.json";
const statsUpToTen = "./json/statistics/up-to-ten.json";
const statsOneUsed = "./json/statistics/one-used.json";
const statsTwoUsed = "./json/statistics/two-used.json";
const statsThreeUsed = "./json/statistics/three-used.json";
const statsMoreThanTen = "./json/statistics/more-than-ten.json";
const statsFolder = "./json/statistics";

interface CompoundTagItem {
  name: string;
  rules: {
    type: "all" | "any" | "prefix" | "suffix" | "contains";
    param: string | string[];
  }[];
}

interface Stats {
  tag: string;
  count: number;
  usages: {
    code: string;
    pack: string;
    name: string;
  }[];
}

// Read all files in pack folder.
interface Card {
  code: string;
  name: string;
  text: string;
  tags: string[];
}

interface Schema {
  anyOf:{
    const: string;
    description: string;
  }[]
}

interface OldSchema {
  enum: string[];
}

interface Tag {
  name: string;
  description: string;
}

interface CardTagged {
  card: string;
  tags: string[];
}

async function addCompoundTags(currentTags: string[]): Promise<string[]> {
  const compoundTagsContent = await Deno.readTextFile(compoundTagsFile);
  const compoundTags: CompoundTagItem[] = JSON.parse(compoundTagsContent);

  const newTags = new Set(currentTags);

  compoundTags.forEach((compoundTag) => {
    let match = false;
    compoundTag.rules.forEach((rule) => {
      const param = rule.param;
      if (rule.type === "all" && Array.isArray(param)) {
        match = param.every((p) => newTags.has(p));
      } else if (rule.type === "any" && Array.isArray(param)) {
        match = param.some((p) => newTags.has(p));
      } else if (rule.type === "prefix" && typeof param === "string") {
        match = currentTags.some((tag) => tag.startsWith(param));
      } else if (rule.type === "suffix" && typeof param === "string") {
        match = currentTags.some((tag) => tag.endsWith(param));
      } else if (rule.type === "contains" && typeof param === "string") {
        match = currentTags.some((tag) => tag.includes(param));
      }
      if (match) {
        newTags.add(compoundTag.name);
      }
    });
  });

  return Array.from(newTags);
}

const uniqueTags = new Set<string>();
for await (const entry of Deno.readDir(packFolder)) {
  if (entry.isFile) {
    const content = await Deno.readTextFile(`${packFolder}/${entry.name}`);
    const card: Card[] = JSON.parse(content);
    card.forEach(async (c) => {
      c.tags = await addCompoundTags(c.tags); // Add compound tags
      c.tags.forEach((t) => {
        uniqueTags.add(t);
      });
    });
  }
}

{
  const schemaContent = await Deno.readTextFile(schemaTagsJsonFile);
  const schemaTags: Schema = JSON.parse(schemaContent);
  const tagsJsonRead = await Deno.readTextFile(tagsJsonFile);
  const tagsJson: Tag[] = JSON.parse(tagsJsonRead);
  const tagsMap = new Map(tagsJson.map(tag => [tag.name, tag.description]));

  const schemaTagSet = new Set(schemaTags.anyOf.map(tag => tag.const));

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

  schemaTags.anyOf = Array.from(schemaTagSet).map(tag => ({
    const: tag,
    description: tagsMap.get(tag) || ""
  }));
  schemaTags.anyOf.sort((a, b) => a.const.localeCompare(b.const));
  await Deno.writeTextFile(
    schemaTagsJsonFile,
    JSON.stringify(schemaTags, null, 2)
  );

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
  const tagsJsonSet = new Set<string>(tagsJson.map((t) => t.name));

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
  tagsJson.sort((a, b) => a.name.localeCompare(b.name));

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

{
  const cardsTagged: CardTagged[] = [];

  for await (const entry of Deno.readDir(packFolder)) {
    if (entry.isFile) {
      const content = await Deno.readTextFile(`${packFolder}/${entry.name}`);
      const cards: Card[] = JSON.parse(content);
      cards.forEach(async (card) => {
        card.tags = await addCompoundTags(card.tags); // Add compound tags
        card.tags.sort();
        cardsTagged.push({ card: card.code, tags: card.tags });
      });
    }
  }

  await Deno.writeTextFile(cardsTaggedFile, JSON.stringify(cardsTagged));
  console.log(`Updated ${cardsTaggedFile} with tags for each card.`);
}

{
  const sortedTags = Array.from(uniqueTags).sort();
  const tagsTsContent = `// This file is generated by sync.ts script. Do not edit manually.\nexport type Tag =\n${sortedTags
    .map((tag) => `  | "${tag}"`)
    .join("\n")};`;
  await Deno.writeTextFile(tagsTs, tagsTsContent);
  console.log(`Updated ${tagsTs} with the union of all tag strings.`);
}

// Clear the statistics folder before writing new statistics files
await mod.emptyDir(statsFolder);

{
  const tagUsageCount: Record<string, Stats> = {};
  uniqueTags.forEach((tag) => {
    tagUsageCount[tag] = { tag, count: 0, usages: [] };
  });

  for await (const entry of Deno.readDir(packFolder)) {
    if (entry.isFile) {
      const content = await Deno.readTextFile(`${packFolder}/${entry.name}`);
      const cards: Card[] = JSON.parse(content);
      const packName = entry.name.replace(".json", "");
      cards.forEach(async (card) => {
        card.tags = await addCompoundTags(card.tags); // Add compound tags
        card.tags.forEach((tag) => {
          tagUsageCount[tag].count += 1;
          tagUsageCount[tag].usages.push({
            code: card.code,
            name: card.name,
            pack: packName,
          });
        });
      });
    }
  }

  const usageRanking = Object.values(tagUsageCount).sort(
    (a, b) => b.count - a.count
  );

  // Write usage-ranking.json as CSV
  const csvContent = usageRanking
    .map((stat) => `${stat.tag}, ${stat.count}`)
    .join("\n");
  await Deno.writeTextFile(statsUsageRanking, csvContent);

  const oneUsed = usageRanking.filter((stat) => stat.count === 1);
  const twoUsed = usageRanking.filter((stat) => stat.count === 2);
  const threeUsed = usageRanking.filter((stat) => stat.count === 3);
  const upToFive = usageRanking.filter(
    (stat) => stat.count > 3 && stat.count <= 5
  );
  const upToTen = usageRanking.filter(
    (stat) => stat.count > 5 && stat.count <= 10
  );
  const moreThanTen = usageRanking.filter((stat) => stat.count > 10);

  await Deno.writeTextFile(statsOneUsed, JSON.stringify(oneUsed, null, 2));
  await Deno.writeTextFile(statsTwoUsed, JSON.stringify(twoUsed, null, 2));
  await Deno.writeTextFile(statsThreeUsed, JSON.stringify(threeUsed, null, 2));
  await Deno.writeTextFile(statsUpToFive, JSON.stringify(upToFive, null, 2));
  await Deno.writeTextFile(statsUpToTen, JSON.stringify(upToTen, null, 2));
  await Deno.writeTextFile(
    statsMoreThanTen,
    JSON.stringify(moreThanTen, null, 2)
  );

  console.log(`Updated statistics files with tag usage counts.`);
}
