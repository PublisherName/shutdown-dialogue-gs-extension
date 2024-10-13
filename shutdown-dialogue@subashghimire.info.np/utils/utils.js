import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export function setKeybinding(settings, key, value) {
    settings.set_strv(key, value);
}

export function removeKeybindingHandler(name) {
    Main.wm.removeKeybinding(name);
}