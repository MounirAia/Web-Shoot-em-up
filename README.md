
# Web-Shoot-em-up
This project is coded using Typescript in combination with the Canvas interface of HTML and a personal framework. Here is a short description of the game and how it will be constructed!
## Summary
The player will be controlling a modular ship with unique abilities and will have only one mission: to survive against hordes of enemies. The player would have to upgrade his ship with the money gained from the enemies to make this mission possible.

### Unique Features
 - Playable on web browser
 - The learning curve of the game is really low
 - Quick game, cool to play a bit and move on

### MVP (Minimum Viable Product)
The game will be playable on a  web browser (Chrome, Firefox, and Edge), only at 1280*720 px resolution. Only one mode will be available, the survival mode. The player will be facing infinite enemy waves until the player loses.

## Gameplay
The information related to how the game will be playable and the art. 
### Design Pillars
The game will entirely be made on digital pixel art. Here is a mock-up:

<img src="https://user-images.githubusercontent.com/86434940/196003158-ff113843-1c55-444e-8afb-b54bf7917152.png" alt="drawing" width="300" style="display: inline;"/>
<img src="https://user-images.githubusercontent.com/86434940/196003255-72e2b365-aa35-40f7-9868-c97c546a1bbc.png" alt="drawing" width="300" style="display: inline;"/>
<img src="https://user-images.githubusercontent.com/86434940/196003631-d9d8c70d-ef00-4fe0-83df-473d9e708018.png" alt="drawing" width="300"/>

I try to be more minimalistic with my drawing because
 - I don’t know how to draw
 - I decided that the gameplay is more important than the drawing. The
   reason is that I work alone, and I must first have a
   playable game before thinking of polishing the game. Even though I
   would like to have a wonderful game

### Core Loop
Big picture game flow

<img src="https://user-images.githubusercontent.com/86434940/196003695-d6e7c7ce-8984-4a6b-a0c5-8efc3f7ab0a2.png" alt="drawing" width="600"/>

### Mechanics
- The player can choose three skills that he can, later on, evolve with money (in-game money) because
	- It makes the game more interesting 
	- It gives this feeling of upgrading the ship, which is a pleasant emotion
- The Player can only shoot with the space bar and move with WASD. The game does not involve any thinking, just pure fun.

## Levels
How the levels will be constructed.
### Level Progression
The player will have to choose three types of skills (special, support, and effect skills). These skills will affect the gameplay of the ship, and he will play the game. Through the game, the player will gain money by destroying the enemies. This money will be used to upgrade the three skills he chose and the ship's stat (by buying a ship upgrade). This cycle will continue until the player loses. (there is a max level for the skills and a max number of runes you can buy).

<img src="https://user-images.githubusercontent.com/86434940/196003868-8ac1f30a-e196-474d-8969-405e87cf45bb.png" alt="drawing" width="600"/>

### Environments
There will be only one map, and it will be infinitely scrolling horizontally.

## Around the Game

### Target Audience
This game target all the people who want to play a quick game. I would say the people in the queue in another game (like League Of Legends or Valorant). During this waiting time, they can play my game

### Target Device
Computer (any decent computer that can run chrome without issue)
