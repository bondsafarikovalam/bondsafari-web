import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTs,
  // `const { body, ...card } = post` is how a field is dropped; the dropped name isn't an unused variable
  { rules: { '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }] } },
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'originals/**', 'next-env.d.ts'] },
]
export default config
