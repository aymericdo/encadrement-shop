import pluginVue from 'eslint-plugin-vue'

export default [
  ...pluginVue.configs['flat/strongly-recommended'],
  { ignores: ['.gitignore', 'src/shadcn/ui/**', '**/dist'] },
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "vue/multi-word-component-names": "off",
      "vue/no-reserved-component-names": "off",
    },
  }
]
