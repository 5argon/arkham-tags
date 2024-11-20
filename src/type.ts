import { CompoundTag } from "./compound-tag.ts"
import { Tag } from "./tags.ts"

export interface TagDefinition {
  name: Tag
  description: string
}

export interface Prefix {
  prefix: string
  description: string
}

export interface CompoundTagDefinition {
  name: CompoundTag
  description: string
  tags: Tag[]
}

export interface TaggedCard {
  card: string
  tags: Tag[]
}
