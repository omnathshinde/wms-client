// @ts-check
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
	prettierConfig,
	{
		files: ["**/*.ts"],
		plugins: {
			"simple-import-sort": simpleImportSort,
			import: eslintPluginImport,
			prettier: pluginPrettier,
		},
		extends: [
			eslint.configs.recommended,
			tseslint.configs.recommended,
			tseslint.configs.stylistic,
			angular.configs.tsRecommended,
		],
		processor: angular.processInlineTemplates,
		rules: {
			"prettier/prettier": "error",
			"simple-import-sort/imports": [
				"error",
				{
					groups: [["^node:"], ["^@?\\w"], ["^src/", "^@app", "^@core"], ["^\\."], ["^\\u0000"]],
				},
			],
			"simple-import-sort/exports": "error",

			"import/first": "error",
			"import/no-duplicates": "error",
			"import/newline-after-import": "error",
			"import/no-relative-parent-imports": "error",

			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: ["../*"],
							message: "❌ Avoid relative imports — use @models, @common, or @services aliases instead.",
						},
					],
				},
			],

			"@typescript-eslint/no-unused-vars": "error",
			"@typescript-eslint/no-explicit-any": "error",
			"@angular-eslint/directive-selector": [
				"error",
				{
					type: "attribute",
					prefix: "app",
					style: "camelCase",
				},
			],
			"@angular-eslint/component-selector": [
				"error",
				{
					type: "element",
					prefix: "app",
					style: "kebab-case",
				},
			],
		},
	},
	{
		files: ["**/*.html"],
		extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
		rules: {},
	},
]);
