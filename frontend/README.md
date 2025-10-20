# Top-Up Card Scanner

A minimal React + Tailwind application that uses the device camera to scan printed mobile top-up card numbers and formats them for USSD dialing.

## Features

- **Camera Scanning**: Uses device camera with BarcodeDetector API (native) or ZXing library (fallback)
- **Number Validation**: Accepts numeric sequences of 12-20 digits only
- **USSD Formatting**: Automatically formats scanned codes as `*805*{code}#`
- **Mobile-First**: Responsive design optimized for mobile devices
- **Call Initiation**: Opens `tel:` links for direct dialing on mobile devices
- **Privacy-Focused**: No data storage or external transmission

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the app in your browser (preferably on a mobile device or using mobile emulation)

## How Scanning Works

1. Grant camera permission when prompted
2. Position the top-up card within the green overlay rectangle
3. Tap "Scan" to start detection
4. The app will automatically detect and validate numeric codes
5. Once scanned, review the formatted USSD string
6. Tap "Insert Card" to initiate the call

## Browser Support

- **BarcodeDetector API**: Chrome 83+, Edge 83+ (preferred for better performance)
- **ZXing Fallback**: All modern browsers with camera support
- **Camera Access**: Requires HTTPS in production (works on localhost in development)

## Limitations

- Desktop browsers will show the USSD string and copy button instead of direct dialing
- Requires camera permission and hardware support
- Only works with numeric barcode formats (QR codes, Code 128, etc.)
- No offline functionality beyond basic scanning

## Testing

Run unit tests for the formatting function:
```bash
npm test
```

## Tech Stack

- React 19 (functional components + hooks)
- Tailwind CSS for styling
- Vite for build tooling
- @zxing/browser for barcode scanning fallback
- Vitest for testing

## Privacy & Security

- Scanned codes are not stored or transmitted
- No analytics or external logging
- Camera access is requested only when needed
- All processing happens client-side
