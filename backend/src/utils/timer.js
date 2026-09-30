// src/utils/timer.js — High-resolution latency measurement
export class LatencyTimer {
  constructor() {
    this.totalStart = performance.now();
    this.latencies = {};
  }

  async measure(key, fn) {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      this.latencies[key] = Math.round(performance.now() - start);
    }
  }

  getResults() {
    return {
      db: this.latencies.db || 0,
      ml: this.latencies.ml || 0,
      llm: this.latencies.llm || 0,
      total: Math.round(performance.now() - this.totalStart),
    };
  }
}
