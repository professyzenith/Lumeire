Currently unused — Cormorant Garamond and Montserrat are loaded
live from Google Fonts via a CDN <link> in index.html <head>.

This keeps the project lightweight and ensures fonts are always
up to date. If you'd prefer fully self-hosted fonts (for offline
use, GDPR-strict environments, or slightly faster first paint),
download the .woff2 files from https://fonts.google.com and place
them here, then update the @font-face declarations at the top of
css/style.css and remove the Google Fonts <link> tag from index.html.
