class ShowWhen extends HTMLElement {
  static register(tagName) {
    if ("customElements" in window) {
      customElements.define(tagName || "show-when", ShowWhen);
    }
  }

  static observedAttributes = [
    'has-param',
    'has-hash',
    'has-lang',
    'has-media',
    'has-support',
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

  #hashChanged(){
    if(this.hasAttribute('has-hash')) this.showHide();
  }

  #networkStateChanged() {
    if (this.hasAttribute('has-network')) this.showHide();
  }

  connectedCallback() {
    window.addEventListener('hashchange', this.#hashChanged.bind(this), false);
    window.addEventListener('offline', this.#networkStateChanged.bind(this), false);
    window.addEventListener('online', this.#networkStateChanged.bind(this), false);
    // watch resize changes for media/container conditions?
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.#hashChanged.bind(this));
    window.removeEventListener('offline', this.#networkStateChanged.bind(this));
    window.removeEventListener('online', this.#networkStateChanged.bind(this));
  }

  get hasParam() { return this.getAttribute('has-param'); };
  get hasHash() { return this.getAttribute('has-hash') };
  get hasLang() { return this.getAttribute('has-lang') };
  get hasMedia() { return this.getAttribute('has-media') };
  get hasSupport() { return this.getAttribute('has-support') };
  get hasNetwork() { return this.getAttribute('has-network') };
  // get whenContainer() { return this.getAttribute('has-container') };
  get matchAny() { return this.hasAttribute('match-any') };

  #checkParam = () => {
    if (!this.hasParam) return;
    const urlParams = new URLSearchParams(window.location.search);

    if (this.hasParam.includes('=')) {
      const paramParts = this.hasParam.split('=');
      return urlParams.has(paramParts[0], paramParts[1]);
    }

    return urlParams.has(this.hasParam);
  }

  #checkHash = () => {
    if (!this.hasHash) return;
    return location.hash === `#${this.hasHash}`;
  }

  #checkMedia = () => {
    if (!this.hasMedia) return;
    return !!window.matchMedia?.(this.hasMedia).matches;
  }

  #checkSupport = () => {
    if (!this.hasSupport) return;
    else return CSS.supports(this.hasSupport);
  }

  #checkLang = () => {
    if (!this.hasLang) return;
    return navigator.languages.includes(this.hasLang);
  }

  #checkNetwork = () => {
    if (!this.hasNetwork) return;
    switch (this.hasNetwork) {
      case 'online': return navigator.onLine;
      case 'offline': return !navigator.onLine;
      default: return false;
    }
  }

  #checkAll = () => [
    this.#checkParam(),
    this.#checkHash(),
    this.#checkMedia(),
    this.#checkSupport(),
    this.#checkLang(),
    this.#checkNetwork(),
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

ShowWhen.register();

class HideWhen extends ShowWhen {
  static register(tagName) {
    if ("customElements" in window) {
      customElements.define(tagName || "hide-when", HideWhen);
    }
  }
  showHide = () => {
    this.toggleAttribute('hidden', this.matchConditions);
  }
}

HideWhen.register();
