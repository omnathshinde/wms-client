# WMS Client 🚀

> **Note:** Install Angular CLI globally first:
> 2
>
> ```bash
> npm install -g @angular/cli
> ```

A clean, production-ready Angular 20 starter configured with modern dev tools:

- ✅ Angular 20 + Node.js 22 support
- ✅ TypeScript 5
- ✅ ESLint (`@angular-eslint`)
- ✅ Prettier for formatting
- ✅ Husky + lint-staged for pre-commit checks
- ✅ Environment configuration
- ✅ Recommended VS Code setup

---

## ⚙️ Prerequisites

- **Node.js**: v22.x (LTS)
- **npm**: v10.x
- **Angular CLI**: latest (20.x)

Check versions:

```bash
node -v
npm -v
ng version
```

> **ESM note:** this project uses ESM for tooling. In `package.json`,
> set:

```json
{ "type": "module" }
```

---

## 📂 Node Version Setup

To ensure consistency across environments, specify the Node.js version your Angular project uses.

### 1) In `package.json`

Add an `engines` field:

```json
{
	"engines": {
		"node": ">=22.0.0",
		"npm": ">=10.0.0"
	}
}
```

This helps tools like npm and hosting providers (e.g., Vercel, Netlify, Heroku) pick the correct runtime.

### 2) `.nvmrc` or `.node-version` file (optional)

If you use **nvm** or similar Node version managers, create a `.nvmrc` or `.node-version` file in the project root:

```
22
```

Developers can then run `nvm use` or `fnm use` to switch automatically.

---

## 🎨 Prettier Setup

### 1) Install Prettier

```bash
npm install -D prettier
```

### 2) Add Configuration

Create a **`.prettierrc`** file in the project root:

```json
{
	"printWidth": 120,
	"useTabs": true,
	"singleQuote": false,
	"overrides": [
		{
			"files": "*.html",
			"options": {
				"parser": "angular"
			}
		}
	]
}
```

Create a **`.prettierignore`** file:

```
# Node modules
node_modules/

# Build output
dist/
build/

# Environment variables
.env

# Logs
*.log

# Static assets
public/
assets/


node_modules
dist
coverage
*.svg
*.png
```

### 3) Add NPM Scripts

In **package.json** → `"scripts"` section, add:

```json
{
	"scripts": {
		"format": "prettier --write .",
		"format:check": "prettier --check ."
	}
}
```

### 4) Usage

Format all code:

```bash
npm run format
```

Check formatting (CI-friendly, no changes applied):

```bash
npm run format:check
```

---

## 🧹 ESLint Setup (Angular 20, Flat Config)

### 1) Add Angular ESLint schematics

```bash
ng add @angular-eslint/schematics
```

### 2) Install additional ESLint deps

```bash
npm install -D eslint-plugin-simple-import-sort eslint-plugin-import eslint-config-prettier
```

**What they do (one-liners):**

- `eslint-plugin-simple-import-sort` – stable, opinionated import sorting
- `eslint-plugin-import` – import order/quality checks (duplicates, first, newline)
- `eslint-config-prettier` – disables rules that conflict with Prettier formatting

### 3) `eslint.config.js` (flat config)

Create **`eslint.config.js`** in the project root:

```json
import eslint from "@eslint/js";
import * as tseslint from "typescript-eslint";
import * as angular from "angular-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginImport from "eslint-plugin-import";

export default tseslint.config(
	{
		files: ["**/*.ts"],
		plugins: {
			"simple-import-sort": simpleImportSort,
			import: eslintPluginImport,
		},
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylistic,
			...angular.configs.tsRecommended,
		],
		processor: angular.processInlineTemplates,
		rules: {
			"simple-import-sort/imports": [
				"error",
				{
					groups: [
						["^node:"],
						["^@?\\w"],
						["^src/", "^@app", "^@core", "^@shared"],
						["^\\."],
						["^\\u0000"],
					],
				},
			],
			"simple-import-sort/exports": "error",
			"import/first": "error",
			"import/newline-after-import": "error",
			"import/no-duplicates": "error",
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
		extends: [
			...angular.configs.templateRecommended,
			...angular.configs.templateAccessibility,
		],
		rules: {},
	},
);
```

### 4) Usage

Now you can lint your project with Angular CLI:

```bash
ng lint
```

This will run ESLint using the configuration above.If fixes are available, ESLint will suggest running with --fix:

```bash
ng lint --fix
```

---

## 🔒 Husky + lint-staged (pre-commit)

Ensure you have a Git repo initialized first:

```bash
git init
```

### 1) Install

```bash
npm i -D husky lint-staged
```

### 2) Initialize Husky

```bash
npx husky init
```

> Creates the `.husky/` folder and a default `pre-commit` hook.

### 3) Configure the pre-commit hook

Replace the contents of **`.husky/pre-commit`** with:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### 4) Add `lint-staged` config

Add this to **`package.json`** (top-level):

```json
"lint-staged": {
	"**/*.{ts,js}": [
		"ng lint --fix"
	],
	"**/*.{ts,js,json,md,scss,html,css}": [
		"prettier --write"
	]
},
```

> This runs ESLint + Prettier **only on staged files**. We rely on `ng lint` for full runs; no extra `lint` script is required.

### 5) Verify the hook

```bash
git add .
git commit -m "chore: test hooks"
```

You should see `lint-staged` formatting and fixing changes before the commit is created.

**Notes**

- To bypass hooks (rare): `git commit --no-verify`.
- If hooks don’t run, ensure you ran `git init` and that `.husky/pre-commit` is executable.
- ESLint will lint both `.ts` and Angular templates (`.html`) based on your `eslint.config.js`.

---

## 🌍 Environment Variables

Angular supports multiple environment files for different build configurations. Common setup includes:

- `src/environments/environment.ts` → development (default)
- `src/environments/environment.production.ts` → production
- `src/environments/environment.testing.ts` → testing

### Example files

**`src/environments/environment.ts`**

```ts
export const environment = {
	production: false,
	apiUrl: "http://localhost:3000",
};
```

**`src/environments/environment.testing.ts`**

```ts
export const environment = {
	production: false,
	apiUrl: "https://testing-api.example.com",
};
```

**`src/environments/environment.production.ts`**

```ts
export const environment = {
	production: true,
	apiUrl: "https://api.example.com",
};
```

### angular.json configuration

Update your `angular.json` build/serve targets:

For build

```json
"configurations": {
	"production": {
		"budgets": [
			{
				"type": "initial",
				"maximumWarning": "500kB",
				"maximumError": "1MB"
			},
			{
				"type": "anyComponentStyle",
				"maximumWarning": "4kB",
				"maximumError": "8kB"
			}
		],
		"fileReplacements": [
			{
				"replace": "src/environments/environment.ts",
				"with": "src/environments/environment.production.ts"
			}
		],
		"outputHashing": "all"
	},
	"testing": {
		"budgets": [
			{
				"type": "initial",
				"maximumWarning": "500kB",
				"maximumError": "1MB"
			},
			{
				"type": "anyComponentStyle",
				"maximumWarning": "4kB",
				"maximumError": "8kB"
			}
		],
		"fileReplacements": [
			{
				"replace": "src/environments/environment.ts",
				"with": "src/environments/environment.testing.ts"
			}
		],
		"optimization": true,
		"sourceMap": true,
		"namedChunks": true,
		"extractLicenses": false
	},
	"development": {
		"optimization": false,
		"extractLicenses": false,
		"sourceMap": true
	}
},
"defaultConfiguration": "production"
```

And for serving:

```json
"configurations": {
	"production": {
		"buildTarget": "client:build:production"
	},
	"testing": {
		"buildTarget": "client:build:testing"
	},
	"development": {
		"buildTarget": "client:build:development"
	}
},
"defaultConfiguration": "development"
```

### Usage

```bash
# development
ng build --configuration development

# testing
ng build --configuration testing

# production
ng build --configuration production
```

```bash
# development
ng serve --configuration development

# testing
ng serve --configuration testing

# production
ng serve --configuration production
```
