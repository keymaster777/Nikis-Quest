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
[d26949a - 9/28/22](https://github.com/keymaster777/Nikis-Quest/commit/d26949a417c836442dd3a4c25ca87e01e9473265)
- Empowered mobs will drop a potion on death
- Mobs will break chests if they are in the way of the player
- Chest has a rare chance to spawn an empowered goblin
- Potions and chests are spawned with some variation in their x and y location relative to the tile they are on so the item population on the floor feels more natural
- Slightly reduced mob spawn rate per room
- Slightly increased potion spawn rate
- Optimizes and cleans up various sections of code
