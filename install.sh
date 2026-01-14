#!/bin/bash

glib-compile-schemas ./shutdown-dialogue@subashghimire.info.np/schemas

if (( $EUID == 0 )); then
	INSTALL_DIR="/usr/share/gnome-shell/extensions"
else
	INSTALL_DIR="$HOME/.local/share/gnome-shell/extensions"
fi
mkdir -p $INSTALL_DIR

echo "Installing extension files in $INSTALL_DIR/shutdown-dialogue@subashghimire.info.np"
cp -r shutdown-dialogue@subashghimire.info.np $INSTALL_DIR

# Compile translations
mkdir -p $INSTALL_DIR/shutdown-dialogue@subashghimire.info.np/locale/ar/LC_MESSAGES
msgfmt ./shutdown-dialogue@subashghimire.info.np/po/ar.po -o $INSTALL_DIR/shutdown-dialogue@subashghimire.info.np/locale/ar/LC_MESSAGES/shutdown-dialogue@subashghimire.info.np.mo

echo "Done."
exit 0

