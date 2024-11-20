# @5argon/arkham-tags

Tag each Arkham Horror : The Card Game's corresponding to what are contained in its game effect text box. This makes them searchable without having to perform unreliable text processing of what you are interested in.

This is similar to "heal damage" and "heal horror" already in use in arkhamdb card database, because they are needed for Carolyn and Vincent's deckbuilding. This time we are adding tags even through they are not needed for any investigators, but needed for the deckbuilders.

## Public Facing Contents

- `json/output/tagged-cards.json` is the mapping from card's code to its tags.
- `json/output/tags.json` is a list of all tags in use.
- `dist` folder has TypeScript type definitions to work with that JSON (`TaggedCards` type).

## Examples

- Tags for cards that heal multiple investigators, can heal Ally, can heal multiple Ally, or can heal health and horror at the same time.
- Tags for "spend resorce" inside action, reaction, and fast timing. Tags for gaining resources. Tags for "paying its cost". Tags for play cost discounts. Tags for bringing things "into play" from hand. This allow player to search for what they think are "economy" cards.
- Tags for uses count "support" cards, like refilling or moving secrets. With simple text processing, you would find a lot of simply secrets-using cards.
- Tags for testless damage, evade, and clue. (The so-called "Preston/Carson cards".) Sometimes "deal damage" text occurs inside a non-Fight test that the card could initiate, and text processing might have hard time getting that.
- Tags for enemy management cards such as Disc of Itzamna, Close Call, Waylay, Handcuffs, Fend Off.
- Tags for cards that makes you move, makes other investigator moves, or alter enemy's movement.

## Tagging Rules

Work on files in `input/pack/[pack-name].json`. They have game text available for you to read while tagging. Some untagged cards are already tagged partially, programmatically by Regex, which might be wrong.

Those JSON files are constrained by `input/schema.json` when you open this project with `.vscode/tagging.code-workspace`. It also warns if you add a completely new tags. If you intended to create a new tags never used before, ignore the warning. The post processing step will automatically register those tags and the warning will disappear.

For ease of hand-tagging literally to the text, tags defined are very fine-grained. For example if you see "[fast] Spend 1 resource :", it should use a more specific tag `cost_fast_spend_resource` even though the card is technically also `spend_resource`. However there is no `cost_fast_spend_resource_1` to use. Some tag offer numerical value, such as `gain_resource_1`.

### Postprocessing

Post process your work in `input/pack/[pack-name].json` with `sync` script in `package.json`. This uses Deno to run the script. It updates files in `json/output`, `json/statistics`, as well as some files in `src` folder. Some of those are what this package exports.

In the post processing step, the script adds **additional tags** based on existing tags, using rules defined in `json/input/compound-tags.json`. For example any card with tags starting (prefixed) with `additional_slot_` would automatically get `additional_slot` tag. One can then search for cards that provide any kind of additional slot with that one tag. Person tagging the card also won't have to tag all the more general variations and just use the most specific one.

The `statistics` folder let you analyze where those tags goes to, and further decide to reorganize or remove tags that aren't looking to be too useful.
