module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "prettier/@typescript-eslint",
    "react-app",
  ],
  plugins: ["prettier", "react", "@typescript-eslint"],
  globals: {
    document: true,
  },
  rules: {
    "no-use-before-define": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/prefer-interface": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "react/prop-types": [2, { ignore: ["children"] }],
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  reportUnusedDisableDirectives: true,
};
