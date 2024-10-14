import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import { setKeybinding, removeKeybinding } from './utils/utils.js';


export default class ShutdownDialogueExtension extends Extension {

	enable() {
		this._wmKeybindingsSettings = new Gio.Settings({ schema_id: 'org.gnome.desktop.wm.keybindings' });
		this._customKeybindingsSettings = this.getSettings('org.gnome.shell.extensions.shutdown-dialogue');
		this._disableCloseBinding();
		this._enableCustomAltF4Binding();
	}

	disable() {
		this._disableCustomAltF4Binding();
		this._enableCloseBinding();
	}

	_enableCustomAltF4Binding() {
		setKeybinding(this._customKeybindingsSettings, 'custom-alt-f4', ['<Alt>F4']);
		Main.wm.addKeybinding(
			'custom-alt-f4',
			this._customKeybindingsSettings,
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			this._onAltF4Pressed.bind(this)
		);
	}

	_onAltF4Pressed() {
		const activeWindow = global.display.get_focus_window();
		if (activeWindow) {
			activeWindow.delete(global.get_current_time());
		} else {
			Main.notify('All windows are closed', 'No windows to close');
		}
	}

	_disableCloseBinding() {
		setKeybinding(this._wmKeybindingsSettings, 'close', []);
	}

	_enableCloseBinding() {
		setKeybinding(this._wmKeybindingsSettings, 'close', ['<Alt>F4']);
	}

	_disableCustomAltF4Binding() {
		removeKeybinding('custom-alt-f4');
	}
}