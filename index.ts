/**
 * ChatGPT-generated (and subsequently modded) plugin to display mathematical symbols.
 *
 * To add symbols, add an identifier in the createGreekLetter method and find the hex
 * code here: https://www.htmlhelp.com/reference/html40/entities/symbols.html
 */
import katex from 'katex';

class InlineGreekLetters {
    api;
    config;
    button: HTMLButtonElement|null;
    state: boolean;
    icon: string;
    tag: string;
    iconClasses: { base: string, active: string };
    constructor({ config, api }: any) {
        this.config = config;
        this.api = api;
        this.state = false;
        this.button = null;
        this.icon = '&Phi;'; // '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"><path d="M17.143 12.5c0-3.498-2.845-6.333-6.357-6.333-3.513 0-6.358 2.835-6.358 6.333s2.845 6.333 6.358 6.333c3.512 0 6.357-2.835 6.357-6.333zm-4.035-3.083l-1.607 3.085-1.608-3.085h3.215zm3.143 5.583c0 1.63-1.326 2.958-2.964 2.958h-2.572v-1.5h2.572c.81 0 1.464-.654 1.464-1.458v-.084c0-.64-.418-1.18-.987-1.376l.662-1.538h-.935l-.618 1.437h-1.607v-1.437h1.607l-.618-1.437h.95l.662 1.538c-.568.196-.968.736-.968 1.376v.084c0 .804.654 1.458 1.464 1.458h2.572v1.5h-2.572c-1.638 0-2.964-1.328-2.964-2.958h-.015v-.084c0-.644.415-1.193.99-1.39l-.683-1.587h1.015l.638 1.475h1.571v-1.475h-1.572l.638-1.475h1.015l-.683 1.587c.576.196.99.746.99 1.39v.084h.016zm-6.358-7.333c2.078 0 3.767 1.682 3.767 3.75s-1.689 3.75-3.767 3.75c-2.078 0-3.767-1.682-3.767-3.75s1.689-3.75 3.767-3.75zm0 1.5c1.183 0 2.143.957 2.143 2.25s-.96 2.25-2.143 2.25c-1.183 0-2.143-.957-2.143-2.25s.96-2.25 2.143-2.25z"/></svg>';
        this.tag = 'SPAN';
        this.iconClasses = {
            base: this.api.styles.inlineToolButton,
            active: this.api.styles.inlineToolButtonActive
        };
    }


    static get CSS() {
        return 'cdx-latex-render';
    };

    static get toolbox() {
        return {
            title: 'Greek Letters',
            icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"><path d="M17.143 12.5c0-3.498-2.845-6.333-6.357-6.333-3.513 0-6.358 2.835-6.358 6.333s2.845 6.333 6.358 6.333c3.512 0 6.357-2.835 6.357-6.333zm-4.035-3.083l-1.607 3.085-1.608-3.085h3.215zm3.143 5.583c0 1.63-1.326 2.958-2.964 2.958h-2.572v-1.5h2.572c.81 0 1.464-.654 1.464-1.458v-.084c0-.64-.418-1.18-.987-1.376l.662-1.538h-.935l-.618 1.437h-1.607v-1.437h1.607l-.618-1.437h.95l.662 1.538c-.568.196-.968.736-.968 1.376v.084c0 .804.654 1.458 1.464 1.458h2.572v1.5h-2.572c-1.638 0-2.964-1.328-2.964-2.958h-.015v-.084c0-.644.415-1.193.99-1.39l-.683-1.587h1.015l.638 1.475h1.571v-1.475h-1.572l.638-1.475h1.015l-.683 1.587c.576.196.99.746.99 1.39v.084h.016zm-6.358-7.333c2.078 0 3.767 1.682 3.767 3.75s-1.689 3.75-3.767 3.75c-2.078 0-3.767-1.682-3.767-3.75s1.689-3.75 3.767-3.75zm0 1.5c1.183 0 2.143.957 2.143 2.25s-.96 2.25-2.143 2.25c-1.183 0-2.143-.957-2.143-2.25s.96-2.25 2.143-2.25z"/></svg>',
        };
    }

    checkState(selection: Selection) {
        const text = selection.anchorNode;

        if (!text) {
            return;
        }

        const termTag = this.api.selection.findParentTag(this.tag, InlineGreekLetters.CSS);
        if (termTag) {
            this.button?.classList.add(this.iconClasses.active);
        } else {
            this.button?.classList.remove(this.iconClasses.active);

        }
        const katexResult = document.getElementById("latex-render-actions");
        if (katexResult) {
            katexResult.style.display = 'block';
            this.showResultInActions(termTag.innerText);
        }
    }

    clear() {
        const katexResult = document.getElementById("latex-render-actions");
        if (katexResult) {
            katexResult.style.display = 'none';
        }
    }

    surround(range: any) {
        const selectedText = window.getSelection()?.toString() + "";

        let termWrapper = this.api.selection.findParentTag(this.tag, InlineGreekLetters.CSS);

        if (termWrapper) {
            this.unwrap(termWrapper);
        } else {
            this.wrap(range);
        }

        let result = this.createGreekLetter(selectedText);
        const toInsert = document.createElement('span');
        this.showResultInActions(selectedText);
        if (result === null) {

        } else {
            if (result.textContent) {
                toInsert.innerText = result.textContent;
            }

            const range = window.getSelection()?.getRangeAt(0);
            range?.deleteContents();
            range?.insertNode(toInsert);
        }
    }

    showResultInActions(selectedText: string) {
        let result = this.createGreekLetter(selectedText);

        const element = document.getElementById("latex-render-actions");
        if (!element) {
            return;
        }

        if (result && result.textContent) {
            element.innerHTML = result.textContent;
        } else {
            element.innerHTML = katex.renderToString(selectedText);
        }
        element.style.display = 'block';
    }

    /**
     * Wrap selection with term-tag
     *
     * @param {Range} range - selected fragment
     */
    wrap(range: Range) {
        /**
         * Create a wrapper for highlighting
         */
        let supElement = document.createElement(this.tag);

        supElement.classList.add(InlineGreekLetters.CSS);

        /**
         * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
         *
         * // range.surroundContents(sup);
         */
        supElement.appendChild(range.extractContents());
        range.insertNode(supElement);

        /**
         * Expand (add) selection to highlighted block
         */
        this.api.selection.expandToTag(supElement);
    }

    /**
     * Unwrap term-tag
     *
     * @param {HTMLElement} termWrapper - term wrapper tag
     */
    unwrap(termWrapper: HTMLElement) {
        /**
         * Expand selection to all term-tag
         */
        this.api.selection.expandToTag(termWrapper);

        let sel = window.getSelection();
        let range = sel?.getRangeAt(0);

        let unwrappedContent = range?.extractContents();
        /**
         * Remove empty term-tag
         */
        termWrapper.parentNode?.removeChild(termWrapper);
        if (range && unwrappedContent) {
            /**
             * Insert extracted content
             */
            range?.insertNode(unwrappedContent);

            /**
             * Restore selection
             */
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.classList.add(this.iconClasses.base);
        this.button.innerHTML = this.icon;

        return this.button;
    }

    renderActions() {
        const katexResult = document.createElement('span');
        katexResult.setAttribute("id", "latex-render-actions")
        katexResult.style.display = 'none';


        return katexResult;
    }

    createGreekLetter(letter: string) {
        const greekLetters: Record<string, string> = {
            Alpha: '\u0391',
            alpha: '\u03B1',
            Beta: '\u0392',
            beta: '\u03B2',
            Gamma: '\u0393',
            gamma: '\u03B3',
            Delta: '\u0394',
            delta: '\u03B4',
            Epsilon: '\u0395',
            epsilon: '\u03B5',
            Zeta: '\u0396',
            zeta: '\u03B6',
            Eta: '\u0397',
            eta: '\u03B7',
            Theta: '\u0398',
            theta: '\u03B8',
            Iota: '\u0399',
            iota: '\u03B9',
            Kappa: '\u039A',
            kappa: '\u03BA',
            Lambda: '\u039B',
            lambda: '\u03BB',
            Mu: '\u039C',
            mu: '\u03BC',
            Nu: '\u039D',
            nu: '\u03BD',
            Xi: '\u039E',
            xi: '\u03BE',
            Omicron: '\u039F',
            omicron: '\u03BF',
            Pi: '\u03A0',
            pi: '\u03C0',
            Rho: '\u03A1',
            rho: '\u03C1',
            Sigma: '\u03A3',
            sigma: '\u03C3',
            Tau: '\u03A4',
            tau: '\u03C4',
            Upsilon: '\u03A5',
            upsilon: '\u03C5',
            Phi: '\u03A6',
            phi: '\u03C6',
            Chi: '\u03A7',
            chi: '\u03C7',
            Psi: '\u03A8',
            psi: '\u03C8',
            Omega: '\u03A9',
            omega: '\u03C9',
        };

        const allSymbols = {
            ...greekLetters,
            ...this.config.symbols
        };


        // const greekLetterElement = document.createElement('span');
        // greekLetterElement.textContent = allSymbols[letter] || letter;
        if (letter in allSymbols) {
            return new Text(allSymbols[letter]);  // greekLetterElement;
        }
        return null;
    }

    save() {
        return {
            greekLetter: this.button?.textContent,
        };
    }

    static get isInline() {
        return true;
    }
}

export default InlineGreekLetters;
