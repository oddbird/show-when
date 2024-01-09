class OnlyShow extends HTMLElement {
  static register(tagName) {
    if ("customElements" in window) {
      customElements.define(tagName || "only-show", OnlyShow);
    }
  }

  static observedAttributes = [
    'when-param',
    'when-hash',
    'when-lang',
    'when-media',
    'when-support',
    // 'when-container',
    // by default, require all conditions to match
    'match-any',
  ];

  constructor() {
    super();
    this.showHide();
  }

  attributeChangedCallback() {
    this.showHide();
  }

  connectedCallback() {
    // we could listen to window hash changes?
    // or resize changes for media/container conditions?
  }

  disconnectedCallback() {
    // remove any external listeners here…
  }

  get whenParam() { return this.getAttribute('when-param'); };
  get whenHash() { return this.getAttribute('when-hash') };
  get whenLang() { return this.getAttribute('when-lang') };
  get whenMedia() { return this.getAttribute('when-media') };
  get whenSupport() { return this.getAttribute('when-support') };
  // get whenContainer() { return this.getAttribute('when-container') };
  get matchAny() { return this.hasAttribute('match-any') };

  #checkParam = () => {
    if (!this.whenParam) return;
    const urlParams = new URLSearchParams(window.location.search);

    if (this.whenParam.includes('=')) {
      const paramParts = this.whenParam.split('=');
      return urlParams.has(paramParts[0], paramParts[1]);
    }

    return urlParams.has(this.whenParam);
  }

  #checkHash = () => {
    if (!this.whenHash) return;
    return location.hash === `#${this.whenHash}`;
  }

  #checkMedia = () => {
    if (!this.whenMedia) return;
    return !!window.matchMedia?.(this.whenMedia).matches;
  }

  #checkSupport = () => {
    if (!this.whenSupport) return;
    else return CSS.supports(this.whenSupport);
  }

  #checkLang = () => {
    if (!this.whenLang) return;
    return navigator.languages.includes(this.whenLang);
  }

  #checkAll = () => [
    this.#checkParam(),
    this.#checkHash(),
    this.#checkMedia(),
    this.#checkSupport(),
    this.#checkLang(),
  ];

  get matchConditions() {
    const results = this.#checkAll();

    return this.matchAny
      ? results.some(r => r)
      : results.every(r => r || r == undefined);
  }

  showHide = () => {
    this.toggleAttribute('hidden', !this.matchConditions);
  }
}

OnlyShow.register();
