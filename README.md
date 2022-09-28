# Nikis-Quest
An ambitious 2d rogue-like game (and game engine) with Niki (My wife) as the protagonist. Most image assets were made from other creators, but every bit of JS and the game engine itself is made by me. Feel free to add suggestions in the issues tab.
<br>
Check out the game <a href="https://keymaster777.github.io/Nikis-Quest" target="_blank" >here</a>.

## TO-DO
- Add linter and make sure everything is es6 compliant
- Clean up movement module varying layer drawing code
- Add knockback logic to movement module
- Go crazy trying to convert this whole project to WebGL one day...
## Credits
- Most of the tiles and monsters are from [this pack](https://0x72.itch.io/dungeontileset-ii)
- Torch sprites and chest assets are from [this pack](https://pixel-poem.itch.io/dungeon-assetpuck)
- Sprites for the main character are from [this pack](https://ansimuz.itch.io/legend-of-faune)
- Keyboard buttons in UI are from [this pack](https://beamedeighth.itch.io/simplekeys-animated-pixel-keyboard-keys)

## Patch Notes
### [d26949a - 9/28/22](https://github.com/keymaster777/Nikis-Quest/commit/d26949a417c836442dd3a4c25ca87e01e9473265)
- Empowered mobs will drop a potion on death
- Mobs will break chests if they are in the way of the player
- Chest has a rare chance to spawn an empowered goblin
- Potions and chests are spawned with some variation in their x and y location relative to the tile they are on so the item population on the floor feels more natural
- Slightly reduced mob spawn rate per room
- Slightly increased potion spawn rate
- Optimizes and cleans up various sections of code

### [4ea4e58 - 9/27/22](https://github.com/keymaster777/Nikis-Quest/commit/4ea4e58ff9e5c40bc87f05dd562df9d9107fb462#diff-e8fc127025153b9e1444ea5a8d51a47ab7ccc59e9863760916d88c4110288b5d)
- Adds "Super Mobs", mobs can drink a potion after being hurt and if they do they become empowered, grow twice as large, and fly over pits.
- Adds a boss bar overlay component, currently only used for super mobs but eventually will be used for real bosses
- Various optimizations and clean up of code

### [711ccd2 - 9/26/22](https://github.com/keymaster777/Nikis-Quest/commit/711ccd2b1a7042ba114c30ce6aa0a1b54696beea)
- Adds two fonts to game and replaces Arial text
- Adds game start overlay with the games title, overlay fades out.
