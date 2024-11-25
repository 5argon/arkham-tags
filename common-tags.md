# Common Tags

## `connecting_location_`

Effect let you do something up to the connecting location. Whether targeting the location, enemy, or investigator.

## `remote_`

Effect a further than connecting location range of effect. 

- `remote_commit`
- `remote_move`
- `remote_discover_clue`
- `remote_investigate`

## `aoe`

Effect occurs to multiple targets at the same time. Connecting location or remote doesn't mean AOE if it is on only 1 target at that location.

- `aoe_damage` : Multiple enemies takes damage.
- `aoe_engage` : Can engage multiple enemies.
- `aoe_evade` : Can evade multiple enemies.
- `aoe_support` : Can support many investigators, like Earthly Serenity, Stand Together, Emergency Cache 3.

## `timing_`

Indicates timing point where you can use the effect. It is always followed by 

- `_fast` : Refers to card with "Fast." and "Play when..." following it.
- `_free` : Free refers to Free Triggered Ability (thunderbolt). Some can't be used on any player window. It is not the same as Fast play card.
- `_reaction` : Optional trigger by the player once when that timing point occurs.
- `_skill` : Usually on skill card, they often indicates where in the skill test framework (ST.X) that the effect triggers.
- `_forced` : Often a rule governing an card that's going to self-discard somehow.

## `testless_`

Consists of `damage`, `clue`, and `evade`. Note that card that grants automatic evade as a bonus like Cheap Shot is not considered testless evade. Some cards that add additional clues from potentially testless stuff like Newspaper is not considered testless itself.

## `target_any_`

`_asset`, `_event`, or `_skill`. When a card can unconditionally target any card constrained by just the card type. This means A Chance Encounter doesn't count as it is locked to Ally trait.

## `tank_`

`damage`, `horror`, `treachery`, or `attack`. It is a form of redirection, indicates an ability when you instead take those instead of others. Contrasting to `redirect_treachery/damage` where you push those to somewhere else.

## `boost_`

Consist of 3 varieties :

- `boost_STAT_AMOUNT_passive` : Passive boost such as Beat Cop. Conditional boost like Dissection Tool or Dario also count as passive.
- `boost_STAT_AMOUNT_attack` : Provide the boost while attacking. Common style on weapons.
- `boost_STAT_AMOUNT_investigate` : Provide the boost while investigating. Both Magnifying Glass and Rite of Seeking count as this type. Wording may use "for this test" (Rite of Seeking) or "for this investigation" (Grim Memoir).
- `boost_STAT_AMOUNT_evade` : Provide the boost while evading.
- `boost_combat_1` : Use no suffix if nothing above works. Like Physical Training.

When card offer additional boost under condition, consider adding more tags to cover that possibility. For example, Lupara would have both `boost_combat_attack_1` and `boost_combat_attack_2`. (Same goes for `damage_plus_AMOUNT`.)

## `stat_`

- `stat_use_STAT` : This is for card that use STAT instead of something else.
- `stat_not_STAT` : Paired with `stat_use_STAT`. Indicates stat that is no longer in use.
- `stat_add_STAT_for_attack/investigate/evade` : Card that adds stat to your other stat. Compound tag automatically adds corresponding `stat_add_STAT` tag without the `_for` part. Use the version without `_for` if it just adds outside of any kind of action, like Mind Over Matter.
- `stat_base_STAT_AMOUNT` : Set base stat to a specific number. Compound tag `stat_base_set` is added for any card using this kind of tag.

## `to_`

These tags are in form of `to_WHAT_from_WHAT`. They indicate cards that can relocate other cards outside of usual game rule. `WHAT` could be `deck`, `discard`, `play`, `hand`, `commit` (limbo). For example: `to_deck_from_discard`, `to_deck_from_play`, `to_hand_from_commit`, `to_hand_from_deck`, `to_hand_from_discard`, `to_hand_from_play`, `to_play_from_deck`, `to_play_from_discard`, `to_play_from_hand`.

## `uses_`

This prefix consists of :

- `uses_type_TYPE` : Type of uses this card use.
- `uses_starting_AMOUNT` : Uses count you get after you play the card.
- `uses_add_TYPE` : This card can add a uses count of this type.
- `uses_manip_WHAT` : Card can creatively use the uses count of other cards. Such as transfer, conversion to other types, or exchange them for benefits.
- `uses_support_TYPE` : The card support other card with that use type in other ways not covered in above's tags.
- `uses_replenish` : Can recharge on its own upto a limit.

## `your_location_`

Tag this when card allows selectable targeting something in the same location.

- `your_location_investigator` : Any investigator including you.
- `your_location_another_investigator` : Someone not you.
- `your_location_enemy`
- `your_location_skill_test` : When skill test occurs at your location.

# `current_` 

Check investigator's current "values" like damage, horror, clues, resources. They are optionally followed by the direction/bias of the check.

Here are some examples: `current_clue_value`, `current_clue_zero`, `current_horror_more`, `current_resource_zero`, `current_sanity_less`, `current_sanity_more`.