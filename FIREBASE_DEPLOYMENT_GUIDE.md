# Firebase Service Worker Deployment Guide

## Issue Resolution

The Firebase service worker error occurs because Firebase is looking for the service worker at the root domain (`https://reswap.tmithun.com/firebase-messaging-sw.js`) but your app is deployed at a subdirectory (`/web/admin/`).

## Changes Made

### 1. Updated Firebase Configuration (`src/utils/firebaseConfig.js`)
- Removed duplicate service worker registration
- Simplified the configuration to focus on messaging setup

### 2. Enhanced Firebase Notification Service (`src/utils/firebaseNotificationService.js`)
- Added dynamic service worker path detection based on environment
- Added service worker accessibility checking
- Added fallback mechanisms for service worker registration failures
- Enhanced error logging and debugging information

### 3. Service Worker Path Configuration
The service now automatically detects the environment and uses the correct path:
- **Production** (`reswap.tmithun.com`): `/web/admin/firebase-messaging-sw.js`
- **Development** (`localhost`): `/firebase-messaging-sw.js`
- **Other environments**: Auto-detects base path

## Deployment Checklist

### 1. Verify Service Worker File Location
Ensure the service worker file is accessible at:
```
https://reswap.tmithun.com/web/admin/firebase-messaging-sw.js
```

### 2. Check File Permissions
Make sure the service worker file has proper HTTP headers:
```
Content-Type: application/javascript
Service-Worker-Allowed: /
```

### 3. Test Service Worker Registration
Use the test page to verify service worker registration:
```
https://reswap.tmithun.com/web/admin/test-service-worker.html
```

### 4. Verify Firebase Configuration
Ensure your Firebase project settings include the correct domain:
- Go to Firebase Console > Project Settings > General
- Add `reswap.tmithun.com` to authorized domains
- Verify the web app configuration matches your production setup

## Troubleshooting

### If Service Worker Still Fails

1. **Check Network Tab**: Look for 404 errors when fetching the service worker
2. **Verify File Path**: Ensure the service worker file exists at the correct path
3. **Check CORS**: Ensure the service worker file is served with proper CORS headers
4. **Clear Browser Cache**: Service workers are cached aggressively

### Alternative Solutions

If the issue persists, consider these alternatives:

1. **Move Service Worker to Root**: Place `firebase-messaging-sw.js` at the root domain
2. **Use Custom Domain**: Deploy the app at a custom subdomain instead of a subdirectory
3. **Disable Service Worker**: Use Firebase messaging without service worker (limited functionality)

## Testing

### Local Testing
```bash
# Start development server
yarn start

# Test service worker at
http://localhost:3000/test-service-worker.html
```

### Production Testing
```bash
# Build and deploy
yarn build

# Test service worker at
https://reswap.tmithun.com/web/admin/test-service-worker.html
```

## Expected Behavior

After deployment, you should see:
1. Service worker registered successfully
2. FCM token retrieved without errors
3. Firebase messaging working in both foreground and background

## Monitoring

Check the browser console for these log messages:
- `🔥 Service worker registered successfully at: /web/admin/firebase-messaging-sw.js`
- `🔥 FCM Token retrieved successfully: [token]`
- `🔥 Firebase service initialized with real FCM token`

If you see any errors, the enhanced logging will provide detailed information about what went wrong. 