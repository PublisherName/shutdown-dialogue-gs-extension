import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
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
		this._wmKeybindingsSettings = null;
		this._customKeybindingsSettings = null;
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
			this._showShutdownDialogue();
		}
	}

	_showShutdownDialogue() {
		const dialog = new ModalDialog.ModalDialog({
			destroyOnClose: false,
			styleClass: 'shutdown-dialogue',
		});

		const mainContentBox = new St.BoxLayout({ vertical: false, style_class: 'dialog-content' });
		dialog.contentLayout.add_child(mainContentBox);

		const message = new St.Label({ text: 'Do you want to shut down the system?' });
		mainContentBox.add_child(message);

		const buttonBox = new St.BoxLayout({ vertical: false });
		dialog.contentLayout.add_child(buttonBox);

		dialog.setButtons([
			{
				label: 'Yes',
				action: () => {
					dialog.close();
					this._shutdownSystem();
				},
				key: Clutter.KEY_Return,
				default: true
			},
			{
				label: 'No',
				action: () => {
					dialog.close();
				},
				key: Clutter.KEY_Escape
			}
		]);

		dialog.open();
	}

	_shutdownSystem() {
		const [success, pid] = GLib.spawn_async(
			null,
			['/usr/bin/systemctl', 'poweroff'],
			null,
			GLib.SpawnFlags.DO_NOT_REAP_CHILD,
			null
		);
		if (success) {
			const watchId = GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, () => {
				GLib.spawn_close_pid(pid);
				GLib.Source.remove(watchId);
			});
		}
	}

	_disableCloseBinding() {
		setKeybinding(this._wmKeybindingsSettings, 'close', []);
	}

	_enableCloseBinding() {
		setKeybinding(this._wmKeybindingsSettings, 'close', ['<Alt>F4']);
	}

	_disableCustomAltF4Binding() {
		setKeybinding(this._customKeybindingsSettings, 'custom-alt-f4', []);
		removeKeybinding('custom-alt-f4');
	}
}