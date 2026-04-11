# Angular 21 Base Template

A modern Angular 21 application template with full development setup, including code quality tools, environment configurations, and best practices.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Code Quality](#code-quality)
- [Environment Configurations](#environment-configurations)
- [Building](#building)
- [Testing](#testing)
- [Path Aliases](#path-aliases)
- [Additional Resources](#additional-resources)

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher) or **yarn**
- **Angular CLI** (v21.x or higher)

### Installing Angular CLI

If you don't have Angular CLI installed globally:

```bash
npm install -g @angular/cli
```

Or use `npx` to run Angular CLI commands without global installation.

## 📦 Installation

1. **Clone the repository** (or navigate to the project directory):

```bash
cd client
```

1. **Install dependencies**:

```bash
npm install
```

1. **Set up Git hooks** (Husky):

```bash
npm run prepare
```

This will set up Husky pre-commit and pre-push hooks for code quality checks.

## 🛠️ Development

### Start Development Server

Run the development server:

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`. The app will automatically reload when you change any source files.

### Development Server Options

```bash
# Serve with specific configuration
ng serve --configuration=development
ng serve --configuration=testing
ng serve --configuration=staging
ng serve --configuration=production

# Serve on a different port
ng serve --port 4300

# Open browser automatically
ng serve --open
```

## 📁 Project Structure

```
client/
├── .husky/              # Git hooks (pre-commit, pre-push)
├── .vscode/             # VS Code settings and extensions
├── public/              # Static assets (favicon, etc.)
├── src/
│   ├── app/             # Application source code
│   │   ├── app.config.ts    # Application configuration
│   │   ├── app.routes.ts    # Route definitions
│   │   ├── app.ts           # Root component
│   │   └── app.html         # Root component template
│   ├── environments/    # Environment configuration files
│   │   ├── environment.ts
│   │   ├── environment.production.ts
│   │   ├── environment.staging.ts
│   │   └── environment.testing.ts
│   ├── index.html       # Main HTML file
│   ├── main.ts          # Application entry point
│   └── styles.scss      # Global styles
├── angular.json         # Angular workspace configuration
├── eslint.config.js     # ESLint configuration
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── .prettierrc          # Prettier configuration
```

## 📜 Available Scripts

### Development

- `npm start` or `ng serve` - Start development server
- `npm run watch` - Build and watch for changes
- `ng generate component <name>` - Generate a new component
- `ng generate service <name>` - Generate a new service
- `ng generate module <name>` - Generate a new module

### Building

- `npm run build` - Build for production (default)
- `ng build --configuration=development` - Build for development
- `ng build --configuration=testing` - Build for testing environment
- `ng build --configuration=staging` - Build for staging environment
- `ng build --configuration=production` - Build for production environment

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and auto-fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without making changes

### Testing

- `ng test` - Run unit tests with Karma
- `ng test --watch=false` - Run tests once and exit
- `ng test --code-coverage` - Run tests with code coverage

## ✨ Code Quality

This project includes several code quality tools configured and ready to use:

### ESLint

ESLint is configured with:

- Angular-specific rules
- TypeScript strict rules
- Import sorting and organization
- Prettier integration
- Custom rules for component/directive selectors

**Configuration**: `eslint.config.js`

### Prettier

Prettier is configured for consistent code formatting:

- Tab indentation
- 120 character line width
- Angular HTML template support

**Configuration**: `.prettierrc`

### Husky Git Hooks

Git hooks are set up to ensure code quality:

- **pre-commit**: Runs ESLint and Prettier on staged files
- **pre-push**: (Configure as needed)

**Configuration**: `.husky/` directory

### Lint-Staged

Automatically runs linters and formatters on staged files before commit.

## 🌍 Environment Configurations

The project includes multiple environment configurations:

### Development (`environment.ts`)

Default development environment.

### Testing (`environment.testing.ts`)

Used for testing builds.

### Staging (`environment.staging.ts`)

Used for staging deployments.

### Production (`environment.production.ts`)

Used for production builds.

### Using Environments

```bash
# Build with specific environment
ng build --configuration=production
ng build --configuration=staging
ng build --configuration=testing

# Serve with specific environment
ng serve --configuration=production
```

## 🏗️ Building

### Production Build

```bash
npm run build
# or
ng build
```

The build artifacts will be stored in the `dist/` directory. The production build:

- Optimizes the application for performance
- Minifies code
- Enables output hashing for cache busting
- Removes source maps (unless configured otherwise)

### Development Build

```bash
ng build --configuration=development
```

Development builds:

- Include source maps
- Disable optimization
- Faster build times

## 🧪 Testing

### Unit Tests

Run unit tests using Karma:

```bash
ng test
```

This will:

- Launch Karma test runner
- Watch for file changes and re-run tests
- Open Chrome browser for test execution

### Code Coverage

Generate code coverage reports:

```bash
ng test --code-coverage
```

Coverage reports will be generated in the `coverage/` directory.

## 🔗 Path Aliases

The project includes TypeScript path aliases for cleaner imports:

```typescript
// Instead of relative imports
import { Component } from "../../../core/component";

// Use path aliases
import { Component } from "@core/component";
import { Service } from "@app/services/service";

// or
import { Component } from "src/app/core/component";
import { Service } from "src/app/services/service";
```

Available aliases:

- `@app/*` → `src/app/*`
- `@core/*` → `src/app/core/*`
- `src/*` → `src/*`

**Note**: ESLint is configured to prevent relative imports (`../`) in favor of path aliases.

## 📚 Code Generation

Angular CLI provides powerful code generation tools:

```bash
# Generate a component
ng generate component components/my-component
# or
ng g c components/my-component

# Generate a service
ng generate service services/my-service
# or
ng g s services/my-service

# Generate a module
ng generate module modules/my-module
# or
ng g m modules/my-module

# Generate a directive
ng generate directive directives/my-directive
# or
ng g d directives/my-directive

# Generate a pipe
ng generate pipe pipes/my-pipe
# or
ng g p pipes/my-pipe

# See all available schematics
ng generate --help
```

## 🎨 Styling

This project uses **SCSS** for styling:

- Global styles: `src/styles.scss`
- Component styles: Inline SCSS in component files
- Component style files are automatically configured for SCSS

## 🔧 TypeScript Configuration

The project uses strict TypeScript configuration:

- **Strict mode**: Enabled
- **Target**: ES2022
- **Module**: preserve
- **Angular strict templates**: Enabled
- **Strict injection parameters**: Enabled

**Configuration**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`

## 📖 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Overview](https://angular.dev/tools/cli)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev)
- [Angular Style Guide](https://angular.dev/style-guide)

## 🤝 Contributing

1. Make your changes
2. Ensure all tests pass: `ng test`
3. Run linting: `npm run lint`
4. Format code: `npm run format`
5. Commit your changes (Husky will run pre-commit hooks automatically)

**Built with Angular 21.1.0** 🚀
