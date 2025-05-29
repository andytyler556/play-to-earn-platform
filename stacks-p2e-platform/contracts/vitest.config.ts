import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "clarinet",
    singleThread: true,
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "node_modules/**",
        "tests/**",
        "coverage/**"
      ]
    }
  }
});
