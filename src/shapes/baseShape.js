export class BaseShape {
    constructor(options = {}) {
      this.id = options.id || `shape-${Math.random().toString(36).slice(2)}`;
      this.classes = options.classes || [];
      this.style = options.style || {};
    }
  
    toSVG() {
      throw new Error("Not implemented");
    }
  }