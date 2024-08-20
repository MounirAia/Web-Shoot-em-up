import { ServiceLocator } from './ServiceLocator';

enum KeyCode {
    Backspace = 'Backspace',
    Tab = 'Tab',
    Enter = 'Enter',
    ShiftLeft = 'ShiftLeft',
    ShiftRight = 'ShiftRight',
    CtrlLeft = 'ControlLeft',
    CtrlRight = 'ControlRight',
    AltLeft = 'AltLeft',
    AltRight = 'AltRight',
    PauseBreak = 'Pause',
    CapsLock = 'CapsLock',
    Escape = 'Escape',
    Space = 'Space',
    PageUp = 'PageUp',
    PageDown = 'PageDown',
    End = 'End',
    Home = 'Home',
    ArrowLeft = 'ArrowLeft',
    ArrowUp = 'ArrowUp',
    ArrowRight = 'ArrowRight',
    ArrowDown = 'ArrowDown',
    Insert = 'Insert',
    Delete = 'Delete',
    Digit0 = 'Digit0',
    Digit1 = 'Digit1',
    Digit2 = 'Digit2',
    Digit3 = 'Digit3',
    Digit4 = 'Digit4',
    Digit5 = 'Digit5',
    Digit6 = 'Digit6',
    Digit7 = 'Digit7',
    Digit8 = 'Digit8',
    Digit9 = 'Digit9',
    KeyA = 'KeyA',
    KeyB = 'KeyB',
    KeyC = 'KeyC',
    KeyD = 'KeyD',
    KeyE = 'KeyE',
    KeyF = 'KeyF',
    KeyG = 'KeyG',
    KeyH = 'KeyH',
    KeyI = 'KeyI',
    KeyJ = 'KeyJ',
    KeyK = 'KeyK',
    KeyL = 'KeyL',
    KeyM = 'KeyM',
    KeyN = 'KeyN',
    KeyO = 'KeyO',
    KeyP = 'KeyP',
    KeyQ = 'KeyQ',
    KeyR = 'KeyR',
    KeyS = 'KeyS',
    KeyT = 'KeyT',
    KeyU = 'KeyU',
    KeyV = 'KeyV',
    KeyW = 'KeyW',
    KeyX = 'KeyX',
    KeyY = 'KeyY',
    KeyZ = 'KeyZ',
    LeftWindowKey = 'MetaLeft',
    RightWindowKey = 'MetaRight',
    SelectKey = 'ContextMenu',
    Numpad0 = 'Numpad0',
    Numpad1 = 'Numpad1',
    Numpad2 = 'Numpad2',
    Numpad3 = 'Numpad3',
    Numpad4 = 'Numpad4',
    Numpad5 = 'Numpad5',
    Numpad6 = 'Numpad6',
    Numpad7 = 'Numpad7',
    Numpad8 = 'Numpad8',
    Numpad9 = 'Numpad9',
    NumpadMultiply = 'NumpadMultiply',
    NumpadAdd = 'NumpadAdd',
    NumpadSubtract = 'NumpadSubtract',
    NumpadDecimal = 'NumpadDecimal',
    NumpadDivide = 'NumpadDivide',
    F1 = 'F1',
    F2 = 'F2',
    F3 = 'F3',
    F4 = 'F4',
    F5 = 'F5',
    F6 = 'F6',
    F7 = 'F7',
    F8 = 'F8',
    F9 = 'F9',
    F10 = 'F10',
    F11 = 'F11',
    F12 = 'F12',
    NumLock = 'NumLock',
    ScrollLock = 'ScrollLock',
    Semicolon = 'Semicolon',
    Equal = 'Equal',
    Comma = 'Comma',
    Minus = 'Minus',
    Period = 'Period',
    Slash = 'Slash',
    Backquote = 'Backquote',
    BracketLeft = 'BracketLeft',
    BracketRight = 'BracketRight',
    Quote = 'Quote',
}

class Key {
    private isDown: boolean = false;
    private isPressed: {
        state: boolean;
        wasAlreadyPressed: boolean;
    } = { state: false, wasAlreadyPressed: false };

    public get IsDown(): boolean {
        return this.isDown;
    }

    public set IsDown(value: boolean) {
        this.isDown = value;
    }

    public get IsPressed(): boolean {
        if (this.isPressed.wasAlreadyPressed && this.isPressed.state) {
            return false;
        } else {
            this.isPressed.wasAlreadyPressed = this.isPressed.state;
            return this.isPressed.state;
        }
    }

    public set IsPressed(value: boolean) {
        this.isPressed.state = value;
    }
}

const Keyboard: { [key: string]: Key } = {};

for (const key in KeyCode) {
    const stringKey = KeyCode[key];
    Keyboard[stringKey] = new Key();
}

window.addEventListener('keydown', (e) => {
    e.preventDefault();
    const { code } = e;
    console.log(code);
    if (Keyboard[code]) {
        Keyboard[code].IsDown = true;
        Keyboard[code].IsPressed = true;
    }
});

window.addEventListener('keyup', (e) => {
    e.preventDefault();
    const { code } = e;
    if (Keyboard[code]) {
        Keyboard[code].IsDown = false;
        Keyboard[code].IsPressed = false;
    }
});

type PossibleCommands =
    | 'MoveUp'
    | 'MoveDown'
    | 'MoveLeft'
    | 'MoveRight'
    | 'PlayerShoot'
    | 'OpenInGameMenu'
    | 'CloseInGameMenu'
    | 'OpenShopMenu'
    | 'CloseShopMenu'
    | 'CloseOptionMenu'
    | 'ToggleInGameTimer';
export interface IServiceKeyboardManager {
    GetCommandState(parameters: { command: PossibleCommands }): Key;
}

export class ServiceKeyboardManager implements IServiceKeyboardManager {
    private commandsStates: Map<PossibleCommands, Key>;
    constructor() {
        this.commandsStates = new Map();
        this.commandsStates.set('MoveUp', Keyboard['KeyW']);
        this.commandsStates.set('MoveLeft', Keyboard['KeyA']);
        this.commandsStates.set('MoveDown', Keyboard['KeyS']);
        this.commandsStates.set('MoveRight', Keyboard['KeyD']);
        this.commandsStates.set('PlayerShoot', Keyboard['Space']);
        this.commandsStates.set('OpenInGameMenu', Keyboard['Escape']);
        this.commandsStates.set('CloseInGameMenu', Keyboard['Escape']);
        this.commandsStates.set('OpenShopMenu', Keyboard['KeyH']);
        this.commandsStates.set('CloseShopMenu', Keyboard['KeyH']);
        this.commandsStates.set('CloseOptionMenu', Keyboard['Escape']);
        this.commandsStates.set('ToggleInGameTimer', Keyboard['KeyT']);

        ServiceLocator.AddService('KeyboardManager', this);
    }

    public GetCommandState(parameters: { command: PossibleCommands }): Key {
        const { command } = parameters;
        return this.commandsStates.get(command) as Key;
    }
}

let keyboardManager: ServiceKeyboardManager;
export function LoadKeyboardManager() {
    keyboardManager = new ServiceKeyboardManager();
}
