# Web-Shoot-em-up

The goal of the game is to complete 100 waves as quickly as possible. To achieve this, the player must control a modular ship equipped with special abilities and survive against hordes of enemies. By eliminating enemies, the player will earn money, which can be used to upgrade its ship.

[Demo Of the Game](https://mouniraia.github.io/Web-Shoot-em-up/)

## Table of Content

-   [Installation](#installation)
-   [Technology](#technology)
-   [Architecture](#architecture)
-   [Testing](#testing)

## Installation

    git clone the repo
    npm install
    npm run dev

## Technology

-   npm
-   Typescript
-   HTML Canvas API
-   Vite
-   Google Sheet: To manage game stats.
-   Confluence and Trello: To document and manage the project
-   Figma
-   Pyxel Edit

## Architecture

I developed the entire game framework myself, including resource management, scene management, collision detection, UI, and more. Given the time I’m able to commit to this project and the fact that I’m working solo, I designed the game to allow for faster development while maintaining a bug-free application. For instance, I chose to write tests in a text-based table format and perform manual testing rather than implementing automated test cases, as adding automated tests would have significantly increased the development time.

### Service Locator

The main way for the entities of my game to communicate with each other is through the Service Locator, which enables sharing values between objects via services. The Service Locator is a static class that retrieves services, which are defined as interfaces and implemented by the classes providing the services.

#### Pros

1.  **Avoiding unnecessary parameters**: Instead of passing entire objects (e.g., passing a player object to an enemy just for the player’s position), you can create a service that exposes only the needed information, which the enemy can access via the Service Locator.
2.  **Simplifying updates**: As your code evolves, you can easily add or update shared values by modifying the service interfaces or their implementations in a single place.

#### Cons

1. **Hidden Dependencies**: In the Service Locator pattern, dependencies are not explicitly passed to a class or component; instead, they are retrieved from the Service Locator. This makes it harder to identify and manage dependencies, as they are not visible in the constructor or method signatures. This hidden nature can complicate unit testing because it's not immediately clear what needs to be mocked or substituted during testing.
2. **Complex Mocking**: Since the Service Locator can return any service, mocking these services for testing purposes requires careful setup. If multiple services are needed for a test, all of them must be correctly mocked and injected into the Service Locator, which adds complexity.
3. **Memory Management**: The service data must be cleared manually when resetting the game, such as when changing scenes. For example, the sprite list in the Wave Manager service needs to be manually cleared at the right time when exiting a game scene. Relying on the garbage collector isn't an option since the service is instantiated only once.

Most of the drawbacks of the Service Locator relate to automated testing. However, since I decided not to implement automated tests, the benefits of using this straightforward pattern outweigh its disadvantages.

#### Service Locator Class

<img src="https://github.com/user-attachments/assets/b137a04b-c58b-4318-aea2-64afc4e80b6d" alt="drawing" width="600" style="display: inline;"/>

#### Adding a Service

<img src="https://github.com/user-attachments/assets/03296699-5fb6-4891-bec0-8ce9fe8d09ab" alt="drawing" width="600" style="display: inline;"/>

#### Using a Service

<img src="https://github.com/user-attachments/assets/f9ff230a-82dc-45f2-a7ea-8bc203011327" alt="drawing" width="600" style="display: inline;"/>

#### Current Service List

| Service Name               | Role                                                                                                      | Dependency on other Services          |
| -------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **ImageLoader**            | Retrieve the image associated with a specific file path                                                   | None                                  |
| **SceneManager**           | Keep track of the current Scene of the Game. Manage the loading and the unloading of the different scenes | None                                  |
| **Player**                 | Keep track of the state of the Player                                                                     | GeneratedSpriteManager, SceneManager  |
| **EventManager**           | Manages events and notifications                                                                          | ImageLoader, UtilManager, WaveManager |
| **WaveManager**            | Manages the Enemy waves                                                                                   | None                                  |
| **GeneratedSpriteManager** | Manages the projectiles of the player and enemies                                                         | None                                  |
| **CollideManager**         | Manages collisions between sprites that can collide                                                       | WaveManager, GeneratedSpriteManager   |
| **EventManager**           | Sprites can register for specific events and get notified when triggered                                  | None                                  |
| **UtilManager**            | Provides a set of utility functions accessible throughout the code                                        | None                                  |

### Sprite

The Sprite system is simple and easy to use. At its core is an abstract class called Sprite, which stores an image (sprite sheet) and defines animations by specifying their names and corresponding frames. The system includes Update and Draw methods to manage and render these animations. Each sprite has its own manager, except for the Player, that is a service by itself: Enemies are managed by the `Wave Manager` service, while Projectiles and Skills are handled by the `Generated Sprite manager.`

<img src="https://github.com/user-attachments/assets/2e3c2226-995f-40c4-a4c9-be8f449a30b3" alt="drawing" width="600" style="display: inline;"/>

### UI

The user interface system is designed with flexibility and structure in mind, centered around a core interface called `IUIComponent`. This interface establishes the foundational contract that all UI components must follow, ensuring consistency across the system.

Building on this foundation is the `BaseField` class, which is a semi-specialized field representing a generic interactive element on the screen. `BaseField` manages important states such as hover and click, and it includes the ability to render an optional outline around the field for emphasis.

The system further extends `BaseField` into more specialized components: `ImageField`, which is specifically designed to display images, and `TextField`, which is optimized for rendering text. These specialized fields inherit the basic functionality of `BaseField` while introducing their own unique behaviors to suit their respective content types.

At the top level, the `UIManager` acts as the controller for all these components, similar to a div in HTML. It maintains a list of UI elements, all of which implement the `IUIComponent` interface. This structure allows `UIManager` to efficiently manage and render a diverse array of UI components, ensuring a cohesive and responsive user interface.

<img src="https://github.com/user-attachments/assets/02317f2a-b9f8-41cf-8e0f-217a996b074d" alt="drawing" width="600" style="display: inline;"/>

### Hitbox System

The hitbox system is designed to be straightforward and consistent. At its core is the `ISpriteWithHitbox` interface, which any sprite needing a hitbox must implement. Once this interface is in place, the sprite will have a hitbox composed of multiple rectangles that together cover the entire sprite, ensuring accurate collision detection and interaction.

<img src="https://github.com/user-attachments/assets/a22d8ff7-305e-4aa6-9b35-3e9ed5839a6f" alt="drawing" width="500" style="display: inline;"/>
<img src="https://github.com/user-attachments/assets/d3eb56cc-2181-4588-a4f3-2f28f5d9b492" alt="drawing" width="500" style="display: inline;"/>

## Testing

### Testing the Code

When it comes to testing the code, I take a structured, manual approach. For each significant feature I implement, especially those that are more complex, I create a detailed table of test scenarios. Each test scenario is documented with two key columns:

1.  **Test Case**: Describes the specific action or event to be tested. For example, when testing the user interface for the skill selection scene, a test case might involve clicking the "Play" button.
2.  **Expected Result**: Outlines what should happen when the test case is executed. Continuing with the previous example, the expected result would be that the player is redirected to the game scene, with the chosen skill correctly assigned to the player character.
    <img src="https://github.com/user-attachments/assets/7280ccc3-e46f-4e07-95bb-279ba75478db" alt="drawing" width="600" style="display: inline;"/>

I follow this process for every major feature, carefully stepping through each test case manually. While automated tests could be more efficient in the long run, I’ve opted for this manual approach to speed up development, as I'm working solo and focused on delivering the product quickly.

### Testing the Drawing

Testing the visual aspects of the game involves a more iterative, visual approach. When I create a new sprite, I start by pixelating it to ensure the art is crisp and visually appealing. Once the sprite is complete, I test how it fits within the game’s context. This involves placing the sprite in a game scene, either within Figma or directly in the game’s testing environment, to evaluate its appearance and coherence within the overall design.

If the sprite looks good, I proceed to define the animations and any associated data, such as hitboxes. This data, including animation speeds and hitbox details, is stored in a Typescript with a JSON style file. I used this approach because it is easier for Type Checking `see src/SpriteStaticInformation`. To ensure everything functions correctly, I use a separate testing version of the game where I can fine-tune and validate these elements before integrating them into the main game.

This dual approach—testing the code through structured scenarios and testing the visual elements through contextual visualization—allows me to maintain a high standard of quality as I develop the game.

![yep](https://github.com/user-attachments/assets/0999abcb-8900-4bf4-89ce-1b424f644f49)
