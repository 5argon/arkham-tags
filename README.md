# @5argon/arkham-tags

Tag each Arkham Horror : The Card Game's corresponding to what are contained in its game effect text box. This makes them searchable without having to perform unreliable text processing of what you are interested in.

This is similar to "heal damage" and "heal horror" already in use in arkhamdb card database, because they are needed for Carolyn and Vincent's deckbuilding. This time we are adding tags even through they are not needed for any investigators, but needed for the deckbuilders.

## Status

**This project is still incomplete.** I'm not sure how useful these might become in the end, but we'll see when all cards are tagged.

These are hand-tagged already, while the rest are only filled with tags from text processing. Likely there are errors that needs fixing.

- `rcore.json`
- `dwl.json`
- `ptc.json`

Guidelines for helping out with tagging cards are [here](./tagging.md). Open a Pull Request if you worked on something. Thanks!

## Public Facing Contents

- `json/output/tagged-cards.json` is the mapping from card's code to its tags.
- `dist` folder has TypeScript type definitions to work with that JSON (`TaggedCards` type, and `Tags` for union of `string` of all tags available.).

## Examples

- Tags for cards that heal multiple investigators, can heal Ally, can heal multiple Ally, or can heal health and horror at the same time.
- Tags for "spend resorce" inside action, reaction, and fast timing. Tags for gaining resources. Tags for "paying its cost". Tags for play cost discounts. Tags for bringing things "into play" from hand. This allow player to search for what they think are "economy" cards.
- Tags for uses count "support" cards, like refilling or moving secrets. With simple text processing, you would find a lot of simply secrets-using cards.
- Tags for testless damage, evade, and clue. (The so-called "Preston/Carson cards".) Sometimes "deal damage" text occurs inside a non-Fight test that the card could initiate, and text processing might have hard time getting that.
- Tags for enemy management cards such as Disc of Itzamna, Close Call, Waylay, Handcuffs, Fend Off.
- Tags for cards that makes you move, makes other investigator moves, or alter enemy's movement.

## Commands

Please install [Deno](https://deno.com) to use the tag transforming script.

- `sync` : Run every time you are done with working on manually tagging cards in `json/input/pack` to update many files in the project. This includes what goes into the `build` command.
- `build` : Build the `dist` which package consumer access.
