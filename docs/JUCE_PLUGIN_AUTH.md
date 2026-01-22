# Listen Buddy JUCE Plugin/Standalone Authentication Guide

This guide explains how to integrate your JUCE standalone app or plugin with the Zenphony website authentication system.

---

## Table of Contents

1. [Overview](#overview)
2. [What is a Deep Link?](#what-is-a-deep-link)
3. [Platform Setup](#platform-setup)
4. [First Time Login Flow](#first-time-login-flow)
5. [Persistent Login (Stay Logged In)](#persistent-login-stay-logged-in)
6. [API Reference](#api-reference)
7. [JUCE Code Examples](#juce-code-examples)

---

## Overview

The authentication flow uses **deep links** to pass login credentials from the website to your native JUCE app. Once authenticated, credentials are saved locally so users stay logged in.

```
Website Login → Deep Link → JUCE App → Save Credentials → Stay Logged In
```

---

## What is a Deep Link?

A **deep link** is a custom URL scheme that opens a native app instead of a website.

| URL | What Opens |
|-----|------------|
| `http://google.com` | Browser |
| `listenbuddy://auth` | Listen Buddy App |
| `spotify://playlist/123` | Spotify App |
| `slack://channel/general` | Slack App |

When the browser encounters `listenbuddy://`, the operating system says "I know an app that handles this!" and launches your JUCE app with the URL data.

**Deep Link Format:**
```
listenbuddy://auth?auth_token=plt_xxx&user_id=abc123&api_origin=http://localhost:3005
```

| Parameter | Description |
|-----------|-------------|
| `auth_token` | Secure token for API calls (valid 30 days) |
| `user_id` | User's unique ID |
| `api_origin` | Base URL for API calls |

---

## Platform Setup

### macOS

Add to your `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>listenbuddy</string>
    </array>
    <key>CFBundleURLName</key>
    <string>com.zenphony.listenbuddy</string>
  </dict>
</array>
```

In JUCE Projucer:
1. Go to your macOS target
2. Find "Custom PList" field
3. Add the URL scheme configuration

### Windows

**Option 1: Registry (Manual or via Installer)**

Create these registry entries:

```
HKEY_CLASSES_ROOT\listenbuddy
    (Default) = "URL:Listen Buddy Protocol"
    URL Protocol = ""

HKEY_CLASSES_ROOT\listenbuddy\shell\open\command
    (Default) = "C:\Program Files\Zenphony\ListenBuddy.exe" "%1"
```

**Option 2: Via NSIS Installer**

```nsis
; Register URL Protocol
WriteRegStr HKCR "listenbuddy" "" "URL:Listen Buddy Protocol"
WriteRegStr HKCR "listenbuddy" "URL Protocol" ""
WriteRegStr HKCR "listenbuddy\shell\open\command" "" '"$INSTDIR\ListenBuddy.exe" "%1"'
```

### Linux

Create a `.desktop` file at `~/.local/share/applications/listenbuddy.desktop`:

```ini
[Desktop Entry]
Name=Listen Buddy
Exec=/opt/listenbuddy/ListenBuddy %u
Type=Application
MimeType=x-scheme-handler/listenbuddy;
```

Then register it:
```bash
xdg-mime default listenbuddy.desktop x-scheme-handler/listenbuddy
```

---

## First Time Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         WEBSITE                                  │
├─────────────────────────────────────────────────────────────────┤
│  1. User logs in on website                                     │
│  2. User clicks "Open in App" on /plugin page                   │
│  3. Website generates auth token via API                        │
│  4. Website triggers deep link:                                 │
│     listenbuddy://auth?auth_token=xxx&user_id=yyy&api_origin=zzz│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       OPERATING SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│  5. OS recognizes listenbuddy:// scheme                         │
│  6. OS launches Listen Buddy app with URL as argument           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         JUCE APP                                │
├─────────────────────────────────────────────────────────────────┤
│  7. App receives URL via command line args or OS callback       │
│  8. App parses auth_token, user_id, api_origin                  │
│  9. App saves credentials to local storage                      │
│  10. App validates token with API (optional but recommended)    │
│  11. User is now logged in!                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Persistent Login (Stay Logged In)

To keep users logged in after closing and reopening the app:

```
┌─────────────────────────────────────────────────────────────────┐
│                      APP STARTUP                                │
├─────────────────────────────────────────────────────────────────┤
│  1. App launches                                                │
│  2. Check local storage for saved credentials                   │
│     - auth_token                                                │
│     - user_id                                                   │
│     - api_origin                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────┐         ┌──────────────────────┐
│   NO CREDENTIALS     │         │  CREDENTIALS FOUND   │
├──────────────────────┤         ├──────────────────────┤
│ Show login prompt    │         │ Validate with API    │
│ "Open website to     │         │                      │
│  login"              │         │ POST /api/plugin/    │
└──────────────────────┘         │ auth/validate-session│
                                 └──────────────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
              ┌──────────────────────┐         ┌──────────────────────┐
              │    VALID TOKEN       │         │   INVALID TOKEN      │
              ├──────────────────────┤         ├──────────────────────┤
              │ Auto-login user      │         │ Clear saved data     │
              │ Show main app        │         │ Show login prompt    │
              └──────────────────────┘         └──────────────────────┘
```

---

## API Reference

### 1. Validate Session (Check if saved token is still valid)

**Endpoint:** `POST {api_origin}/api/plugin/auth/validate-session`

**Headers:**
```
Authorization: Bearer {auth_token}
Content-Type: application/json
```

**Body:**
```json
{
  "user_id": "abc123-def456-..."
}
```

**Success Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "abc123-def456-...",
    "email": "user@example.com",
    "full_name": "Timothy",
    "avatar_url": "https://...",
    "subscription_tier": "pro",
    "minutes_remaining": 120
  }
}
```

**Error Response (401):**
```json
{
  "valid": false,
  "error": "Invalid or expired token"
}
```

### 2. Validate Token (One-time token exchange - used by WebUI)

**Endpoint:** `POST {api_origin}/api/plugin/auth/validate-token`

**Body:**
```json
{
  "token": "plt_xxx..."
}
```

---

## JUCE Code Examples

### 1. Parsing Deep Link URL

```cpp
// Parse the deep link URL to extract auth parameters
struct AuthParams
{
    String authToken;
    String userId;
    String apiOrigin;
    bool isValid = false;
};

AuthParams parseDeepLinkURL(const String& url)
{
    AuthParams params;

    // Check if it's our URL scheme
    if (!url.startsWith("listenbuddy://"))
        return params;

    // Parse URL parameters
    URL parsedUrl(url);

    params.authToken = parsedUrl.getParameterValues("auth_token")[0];
    params.userId = parsedUrl.getParameterValues("user_id")[0];
    params.apiOrigin = URL::removeEscapeChars(parsedUrl.getParameterValues("api_origin")[0]);

    params.isValid = params.authToken.isNotEmpty() &&
                     params.userId.isNotEmpty() &&
                     params.apiOrigin.isNotEmpty();

    return params;
}
```

### 2. Saving Credentials Locally

```cpp
class AuthStorage
{
public:
    static void saveCredentials(const String& authToken,
                                const String& userId,
                                const String& apiOrigin)
    {
        PropertiesFile::Options options;
        options.applicationName = "ListenBuddy";
        options.folderName = "Zenphony";
        options.filenameSuffix = ".auth";
        options.osxLibrarySubFolder = "Application Support";

        PropertiesFile props(options);
        props.setValue("auth_token", authToken);
        props.setValue("user_id", userId);
        props.setValue("api_origin", apiOrigin);
        props.setValue("saved_at", Time::getCurrentTime().toISO8601(true));
        props.save();
    }

    static AuthParams loadCredentials()
    {
        PropertiesFile::Options options;
        options.applicationName = "ListenBuddy";
        options.folderName = "Zenphony";
        options.filenameSuffix = ".auth";
        options.osxLibrarySubFolder = "Application Support";

        PropertiesFile props(options);

        AuthParams params;
        params.authToken = props.getValue("auth_token", "");
        params.userId = props.getValue("user_id", "");
        params.apiOrigin = props.getValue("api_origin", "");
        params.isValid = params.authToken.isNotEmpty();

        return params;
    }

    static void clearCredentials()
    {
        PropertiesFile::Options options;
        options.applicationName = "ListenBuddy";
        options.folderName = "Zenphony";
        options.filenameSuffix = ".auth";
        options.osxLibrarySubFolder = "Application Support";

        PropertiesFile props(options);
        props.clear();
        props.save();
    }
};
```

### 3. Validating Session with API

```cpp
class SessionValidator : private Thread
{
public:
    struct UserInfo
    {
        String id;
        String email;
        String fullName;
        String avatarUrl;
        String subscriptionTier;
        int minutesRemaining;
    };

    std::function<void(bool valid, UserInfo user)> onValidationComplete;

    void validateSession(const String& authToken,
                         const String& userId,
                         const String& apiOrigin)
    {
        this->authToken = authToken;
        this->userId = userId;
        this->apiOrigin = apiOrigin;
        startThread();
    }

private:
    String authToken, userId, apiOrigin;

    void run() override
    {
        URL url(apiOrigin + "/api/plugin/auth/validate-session");

        // Create JSON body
        DynamicObject::Ptr json = new DynamicObject();
        json->setProperty("user_id", userId);
        String jsonBody = JSON::toString(json.get());

        // Make POST request
        URL::InputStreamOptions options(URL::ParameterHandling::inAddress);
        options.withExtraHeaders("Authorization: Bearer " + authToken + "\r\n" +
                                 "Content-Type: application/json");
        options.withHttpRequestCmd("POST");
        options.withPostData(jsonBody);

        auto stream = url.createInputStream(options);

        if (stream == nullptr)
        {
            MessageManager::callAsync([this]() {
                if (onValidationComplete)
                    onValidationComplete(false, {});
            });
            return;
        }

        String response = stream->readEntireStreamAsString();
        var jsonResponse = JSON::parse(response);

        bool valid = jsonResponse.getProperty("valid", false);

        UserInfo user;
        if (valid)
        {
            var userData = jsonResponse.getProperty("user", var());
            user.id = userData.getProperty("id", "").toString();
            user.email = userData.getProperty("email", "").toString();
            user.fullName = userData.getProperty("full_name", "").toString();
            user.avatarUrl = userData.getProperty("avatar_url", "").toString();
            user.subscriptionTier = userData.getProperty("subscription_tier", "free").toString();
            user.minutesRemaining = (int)userData.getProperty("minutes_remaining", 0);
        }

        MessageManager::callAsync([this, valid, user]() {
            if (onValidationComplete)
                onValidationComplete(valid, user);
        });
    }
};
```

### 4. Handling Deep Link on App Launch

```cpp
class ListenBuddyApplication : public JUCEApplication
{
public:
    void initialise(const String& commandLine) override
    {
        // Check if launched with a deep link URL
        if (commandLine.startsWith("listenbuddy://"))
        {
            handleDeepLink(commandLine);
        }
        else
        {
            // Normal startup - try auto-login
            tryAutoLogin();
        }
    }

    void handleDeepLink(const String& url)
    {
        auto params = parseDeepLinkURL(url);

        if (params.isValid)
        {
            // Save credentials for persistent login
            AuthStorage::saveCredentials(
                params.authToken,
                params.userId,
                params.apiOrigin
            );

            // Validate and get user info
            validator.onValidationComplete = [this](bool valid, auto user) {
                if (valid)
                {
                    // Show main app with user logged in
                    showMainWindow(user);
                }
                else
                {
                    // Token was invalid, clear and show error
                    AuthStorage::clearCredentials();
                    showError("Login failed. Please try again.");
                }
            };

            validator.validateSession(
                params.authToken,
                params.userId,
                params.apiOrigin
            );
        }
    }

    void tryAutoLogin()
    {
        auto savedParams = AuthStorage::loadCredentials();

        if (!savedParams.isValid)
        {
            // No saved credentials, show login prompt
            showLoginPrompt();
            return;
        }

        // Validate saved session
        validator.onValidationComplete = [this](bool valid, auto user) {
            if (valid)
            {
                showMainWindow(user);
            }
            else
            {
                // Saved token expired, clear and show login
                AuthStorage::clearCredentials();
                showLoginPrompt();
            }
        };

        validator.validateSession(
            savedParams.authToken,
            savedParams.userId,
            savedParams.apiOrigin
        );
    }

private:
    SessionValidator validator;
};
```

### 5. macOS-Specific: Handle URL Events

On macOS, the system may send URL events after the app is running:

```cpp
// In your JUCEApplication class
class ListenBuddyApplication : public JUCEApplication
{
    void anotherInstanceStarted(const String& commandLine) override
    {
        // Called when app is already running and receives a deep link
        if (commandLine.startsWith("listenbuddy://"))
        {
            handleDeepLink(commandLine);
        }
    }
};
```

---

## Security Notes

1. **Token Expiry**: Tokens are valid for 30 days. After expiry, users need to re-authenticate via the website.

2. **Secure Storage**: The `PropertiesFile` stores data in:
   - macOS: `~/Library/Application Support/Zenphony/ListenBuddy.auth`
   - Windows: `%APPDATA%\Zenphony\ListenBuddy.auth`
   - Linux: `~/.config/Zenphony/ListenBuddy.auth`

3. **Token Revocation**: If a user changes their password or logs out from all devices on the website, saved tokens will become invalid.

4. **HTTPS**: Always use HTTPS for `api_origin` in production.

---

## Troubleshooting

### Deep Link Not Opening App

1. **macOS**: Check `Info.plist` has correct URL scheme
2. **Windows**: Verify registry entries exist
3. **All Platforms**: Make sure app was installed/run at least once after adding URL scheme

### Token Validation Failing

1. Check `api_origin` is correct and accessible
2. Verify token hasn't expired (30 day limit)
3. Check network connectivity

### Credentials Not Persisting

1. Check app has write permissions to config directory
2. Verify `PropertiesFile` path is correct for your platform

---

## Summary

| Step | Action |
|------|--------|
| 1 | Register `listenbuddy://` URL scheme for your platform |
| 2 | Handle deep link URL on app launch |
| 3 | Parse `auth_token`, `user_id`, `api_origin` from URL |
| 4 | Save credentials using `PropertiesFile` |
| 5 | On next launch, load saved credentials |
| 6 | Validate with `/api/plugin/auth/validate-session` |
| 7 | If valid, auto-login; if invalid, show login prompt |
