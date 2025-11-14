import eslint from "@eslint/js";
import * as tseslint from "typescript-eslint";
import * as angular from "angular-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";

export default tseslint.config(
	{
		files: ["**/*.ts"],
		plugins: {
			"simple-import-sort": simpleImportSort,
			import: eslintPluginImport,
			prettier: pluginPrettier,
		},
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylistic,
			...angular.configs.tsRecommended,
		],
		processor: angular.processInlineTemplates,
		rules: {
			"prettier/prettier": "error",
			"simple-import-sort/imports": [
				"error",
				{
					groups: [["^node:"], ["^@?\\w"], ["^src/", "^@app", "^@core", "^@shared"], ["^\\."], ["^\\u0000"]],
				},
			],
			"simple-import-sort/exports": "error",
			"import/first": "error",
			"import/newline-after-import": "error",
			"import/no-duplicates": "error",
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
			"import/no-relative-parent-imports": "error",
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
		extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
		rules: {},
	},
);
