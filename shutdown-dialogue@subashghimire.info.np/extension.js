const { Gio } = imports.gi;
import { setKeybinding } from './utils/utils.js';

export default class ShutdownDialogueExtension {

	enable() {
		this._wmKeybindingsSettings = new Gio.Settings({ schema_id: 'org.gnome.desktop.wm.keybindings' });
		this._disableCloseBinding();
	}

	disable() {
		this._enableCloseBinding();
	}

	_disableCloseBinding() {
		setKeybinding(this._wmKeybindingsSettings, 'close', []);
	}

	_enableCloseBinding() {
		setKeybinding(this._wmKeybindingsSettings, 'close', ['<Alt>F4']);
	}
}