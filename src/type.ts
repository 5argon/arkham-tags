import { Tag } from "./tags.js";

export interface TaggedCard {
  card: string;
  tags: Tag[];
}

export type TaggedCards = TaggedCard[];
