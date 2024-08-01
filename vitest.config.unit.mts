import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['./application/**/*.test.ts'],
    globals: true,
    dir: 'src',
  },
})
