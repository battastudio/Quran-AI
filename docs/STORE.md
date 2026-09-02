# Publishing to the app stores

The app is a PWA; wrap it with **PWABuilder** to get store binaries. No code changes
needed — the manifest already has `id`, `categories`, `screenshots`, icons, `dir/lang`.

## Android (Google Play) — TWA
1. Go to **pwabuilder.com** → enter `https://battastudio.github.io/Quran-AI/` → **Start**.
2. **Package for stores → Android** → download the `.aab` (Trusted Web Activity).
3. PWABuilder shows your app's **signing SHA-256**. Put it into
   `public/.well-known/assetlinks.json` (replace `REPLACE_WITH_YOUR_APP_SIGNING_SHA256`),
   keep `package_name` = `com.battastudio.nouralquran`, then redeploy so the link is
   verified (removes the browser address bar in the TWA).
4. **Google Play Console** ($25 one-time) → create app → upload the `.aab` → fill the
   listing (title, description, icon, the 2 screenshots — replace with real device
   screenshots) → submit.

## iOS (App Store)
1. PWABuilder → **iOS** → download the Xcode project.
2. Open in Xcode on a Mac, set your bundle id + team, run on device to verify.
3. **Apple Developer** ($99/yr) → App Store Connect → create app → archive & upload
   from Xcode → fill listing → submit.
   Note: iOS wraps the PWA in a WKWebView; features work as they do in Safari
   (background notifications remain limited — see `docs/features/notifications.md`).

## Assets provided
- Icons: `public/icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`.
- Screenshots: `public/screenshot-1.png`, `screenshot-2.png` (branded placeholders —
  replace with real captures from a phone: reader, tasmi, prayer times).
- Listing copy: see `manifest` name/description; expand per store as needed.
