# Code Personality Themes

A VS Code extension that automatically switches your editor theme based on your coding activity and stress level. Experience a dynamic workspace that adapts to your flow!

## Features

Code Personality Themes intelligently switches between three distinct themes based on your coding behavior:

- ** Calm Mode**: Activated when you're idle for 20+ seconds - a soothing theme for when you're thinking or taking a break
- ** Focus Mode**: Activated during active coding sessions - optimized for concentration and productivity
- ** Panic Mode**: Activated when you have 5+ errors in your code - helps you identify that you need to slow down and fix issues

### How It Works

The extension monitors:
- **Your typing activity**: Detects typing bursts (12+ edits in 10 seconds) to trigger Focus mode
- **Your idle time**: Switches to Calm mode after 20 seconds of inactivity
- **Your diagnostics**: Counts errors and warnings across all files to trigger Panic mode
- **Error resolution**: Immediately switches back to Focus or Calm mode when errors are fixed

### Intelligent Switching

- Switches happen **immediately** when errors are detected or fixed
- Smart cooldown (15 seconds) prevents excessive theme switching during normal transitions
- Panic recovery bypasses cooldown for instant feedback when you fix your errors

## Requirements

- VS Code 1.108.1 or higher

## Extension Settings

This extension contributes the following settings:

* `codePersonalityThemes.enabled`: Enable/disable automatic theme switching (default: `true`)
* `codePersonalityThemes.calmTheme`: Theme name for Calm mode (default: `"Personality: Calm"`)
* `codePersonalityThemes.focusTheme`: Theme name for Focus mode (default: `"Personality: Focus"`)
* `codePersonalityThemes.panicTheme`: Theme name for Panic mode (default: `"Personality: Panic"`)
* `codePersonalityThemes.panicErrorThreshold`: Number of diagnostics to trigger Panic mode (default: `5`)
* `codePersonalityThemes.focusTypingBurstThreshold`: Number of edits in 10 seconds to trigger Focus mode (default: `12`)
* `codePersonalityThemes.idleSecondsForCalm`: Seconds of idle time to trigger Calm mode (default: `20`)
* `codePersonalityThemes.cooldownSeconds`: Minimum seconds between theme switches (default: `15`)

## Customization

You can use your own favorite themes by changing the theme settings. Simply update the settings to use any installed theme:

```json
{
  "codePersonalityThemes.calmTheme": "GitHub Dark",
  "codePersonalityThemes.focusTheme": "Monokai",
  "codePersonalityThemes.panicTheme": "Red"
}
```

## Commands

* `Code Personality Themes: Ping` - Test command to verify the extension is working

## Known Issues

None at this time. Please report any issues on the GitHub repository.

## Release Notes

### 0.0.1

Initial release of Code Personality Themes:
- Automatic theme switching based on coding activity
- Three modes: Calm, Focus, and Panic
- Immediate panic recovery when errors are fixed
- Configurable thresholds and themes

---

## Contributing

Found a bug or have a feature request? Please open an issue on the GitHub repository.

**Enjoy your adaptive coding experience!** 🎨

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
