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

  #events = new Map();

  constructor() {
    super();
    this.showHide();
  }

  attributeChangedCallback() {
    this.showHide();
    this.#checkEvents();
  }

  #checkEvents(){
    const existingEvents = new Set(this.#events.keys());

    const neededEvents = new Set();
    if (this.hasAttribute('has-hash')) neededEvents.add('hash');
    if (this.hasAttribute('has-network')) neededEvents.add('network');

    neededEvents.forEach(event => {
      if (!existingEvents.has(event)){
        this.#addEvent(event);
      } else existingEvents.delete(event);
    });
    // Remove remaining events that are no longer needed.
    existingEvents.forEach(event=>{
      this.#events.get(event).abort();
      this.#events.delete(event);
    });
  }

  #addEvent(type){
    const controller = new AbortController();
    const options = {signal: controller.signal};
    switch (type) {
      case 'hash':
        window.addEventListener('hashchange', this.showHide.bind(this), options);
        break;
      case 'network':
        window.addEventListener('offline', this.showHide.bind(this), options);
        window.addEventListener('online', this.showHide.bind(this), options);
    
      default:
        break;
    }
    this.#events.set(type, controller);
    return controller;
  }

  connectedCallback() {
    this.#checkEvents();
    // watch resize changes for media/container conditions?
  }

  disconnectedCallback() {
    this.#events.forEach((controller)=>{
      controller.abort();
    });
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
