# Native iPhone app

Open `Babar.xcodeproj` in Xcode and select the shared **Babar** scheme. The native
app version is 1.0 (build 2), bundling game 0.74.0. Minimum iOS is 17.0. This is a
UIKit application with the local Canvas game hosted in WKWebView, not a Safari
Home Screen link. No npm packages, network server, remote code, tracking SDK or
runtime key are required. The build copies authored `../dist/` into `Client/`
inside the binary; keep changes to game logic in `dist/`.

Native features: safe-area layout in portrait/both landscapes, persistent WebKit
storage, scene background save/pause, an in-app character archive/privacy sheet,
external links opened in the system browser, and recovery after WebKit process
termination. Normal pause/resume remains explicit after returning to the app.
The complete artwork is bundled for first-launch offline use. The web service
worker is inapplicable to local file URLs; app updates arrive through Apple.

## Build and validate

```sh
xcodebuild -project ios/Babar.xcodeproj -scheme Babar -configuration Debug \
  -sdk iphonesimulator -derivedDataPath /tmp/babar-native-build \
  CODE_SIGNING_ALLOWED=NO build
python3 scripts/check-ios-bundle.py /tmp/babar-native-build/Build/Products/Debug-iphonesimulator/Babar.app
xcodebuild -project ios/Babar.xcodeproj -scheme Babar -configuration Release \
  -destination 'generic/platform=iOS' -archivePath /tmp/Babar-1.0.xcarchive \
  CODE_SIGNING_ALLOWED=NO archive
```

These unsigned outputs prove compilation/packaging only. They cannot be uploaded
as an App Store release. Run the normal engine checks as well. Simulator/device
play must verify first launch, sounds, gathering, production, touch selection,
portrait/landscape, archive dismissal, save/background/relaunch and process
recovery before submission. Test on a physical iPhone too.

## Signing and submission

1. Confirm the rights to distribute all characters, imagery and third-party
   material. The fan-game label is not evidence of a license.
2. Sign into your Apple Developer account in **Xcode → Settings → Accounts**.
   Select its paid-program team in **Babar → Signing & Capabilities**. No team ID
   or credentials are committed. The registered bundle ID is
   `com.therealjameswilson.babar`.
3. Choose a real iPhone for signed device testing. After acceptance, select
   **Any iOS Device → Product → Archive** with automatic signing enabled.
4. In Organizer, validate and distribute to App Store Connect. Create the app
   record with the same bundle ID, then complete TestFlight testing.
5. Finish metadata in `docs/app-store/SUBMISSION.md`, upload actual screenshots,
   complete Apple's age-rating/privacy/export questions, and submit for review.
   Review approval is Apple's decision; no approval is implied by a successful build.

Do not commit signing certificates, profiles, private keys, archives, account
metadata, or App Store Connect API credentials. The original crown icon derives
from `python3 scripts/app-icons.py --ios` (Pillow) at 1024px; it contains no external art. The bundled
privacy policy is `Babar/native-privacy.html`; host that policy at a public HTTPS
URL before submitting the store record.

## Verified distribution setup — 2026-10-04

Paid membership and App Store Connect access were verified in the owner account.
An Apple Distribution signed IPA passed signature and bundle checks. App record:
https://appstoreconnect.apple.com/apps/6819053311/distribution
Build 1 uploaded and processed (Ready to Submit). Build 2 fixes saving while
rhinos capture the depot; see docs/QA.md for runtime evidence. No public Apple
review submission or release has been made. Team identity and signing material
remain outside the repository.

Build 2 upload completed successfully on 2026-10-04; Apple processing was pending
at upload completion. Further native UI work stopped when the Mac locked.
