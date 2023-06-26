# EditorJS Symbols

A little plugin for easy insertion of greek letters, math symbols or similar.

To use it:

* Write the name of the letter and select the word - like *alpha*
* Click the psi icon in the inline toolbar.

The plugin supports the greek alphabet, but can be expanded in the config like shown below.

```javascript
window.editor = new EditorJS({
    tools: {
        greekLetters: {
            class: InlineGreekLetters,
            config: {
                symbols: {
                    isin: '\u2208',
                    notin: '\u2209',
                    right: '\u21D2',
                    left: '\u21D0',
                    times: '\u2022',
                }
            }
        },
    }
})
```
