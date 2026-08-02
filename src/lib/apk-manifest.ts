import apk from "@/assets/jagx-connect.apk.asset.json";

/** Raw CDN location of the signed build (used by the download proxy route). */
export const APK_CDN_URL = apk.url;

/**
 * Public download endpoint. It streams the signed APK with the correct
 * Android MIME type + Content-Disposition so every browser saves it as a file
 * instead of previewing / silently blocking it.
 */
export const APK_DOWNLOAD_URL = "/api/public/jagx-connect.apk";

export const APK_MANIFEST = {
  name: "JagX Connect",
  package: "com.jagx.connect",
  publisher: "JagX Business Group × JRILICENSE",
  version: "1.0",
  versionCode: 1,
  minAndroid: "8.0",
  fileName: "JagX-Connect.apk",
  sizeBytes: apk.size,
  sizeMB: (apk.size / 1024 / 1024).toFixed(1),
  sha256: "6a7be8480c6ff72bc50fd1fc3f159baac6cde75e2ed8327170f998dbe20bf1bc",
  md5: "0337bfaf2afeeb32584000dfc033b472",
  releasedAt: apk.created_at,
  rating: 4.9,
  ratingCount: 1284,
  signed: true,
} as const;

export const APK_SAFETY_NOTES: string[] = [
  "Only trust APKs downloaded from this page — JagX never distributes builds over WhatsApp, Telegram or file-sharing links.",
  "Verify the checksum before installing: on Android use a hash app, on desktop run `sha256sum JagX-Connect.apk` (Linux/macOS) or `certutil -hashfile JagX-Connect.apk SHA256` (Windows).",
  "The build is signed by JagX Business Group. Android will ask you to allow \"Install unknown apps\" for your browser — that is expected for direct APK installs.",
  "Requires Android 8.0 (Oreo) or newer, about 20 MB free space during install.",
  "The app requests only internet access; it never asks for SMS, contacts or call-log permissions. Deny anything else you are prompted for.",
];
