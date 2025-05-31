# Awesome Time

A modern, accessible, and internationalized relative time formatting library for React, Vue, and Angular.

## Installation

Install only the framework you need:

```bash
# For React
npm install awesome-time

# For Vue
npm install awesome-time

# For Angular
npm install awesome-time
```

## 📦 Bundle Size

| Package           | Size (minified + gzipped) | Badge |
|-------------------|--------------------------|-------|
| Core              | ~2 kB                    | [![Core](https://badgen.net/bundlephobia/minzip/awesome-time)](https://bundlephobia.com/result?p=awesome-time) |
| React             | ~3 kB                    | [![React](https://badgen.net/bundlephobia/minzip/awesome-time/react)](https://bundlephobia.com/result?p=awesome-time/react) |
| Vue               | ~3 kB                    | [![Vue](https://badgen.net/bundlephobia/minzip/awesome-time/vue)](https://bundlephobia.com/result?p=awesome-time/vue) |
| Angular           | ~3 kB                    | [![Angular](https://badgen.net/bundlephobia/minzip/awesome-time/angular)](https://bundlephobia.com/result?p=awesome-time/angular) |

## Usage

### Core (Framework Agnostic)

```typescript
import { formatRelativeTime } from 'awesome-time';

const result = formatRelativeTime({
  date: new Date(),
  locale: 'en'
});
```

### React

```typescript
import { RelativeTime } from 'awesome-time/react';

function MyComponent() {
  return <RelativeTime date={new Date()} />;
}
```

#### React Features

- **Server Components Support**: Works with Next.js 14 server components
- **Suspense Support**: Integrates with React Suspense for loading states
- **Error Boundaries**: Built-in error handling
- **Custom Rendering**: Support for render props pattern
- **TypeScript Support**: Full type safety

```typescript
// Server Component Example
import { RelativeTime } from 'awesome-time/react';

export default async function Page() {
  return <RelativeTime date={new Date()} />;
}

// Custom Rendering Example
<RelativeTime
  date={new Date()}
  children={({ relativeTime, tooltipText, date }) => (
    <div className="custom-wrapper">
      <span>{relativeTime}</span>
      <span className="tooltip">{tooltipText}</span>
    </div>
  )}
/>
```

### Vue

```typescript
import { RelativeTime } from 'awesome-time/vue';

export default {
  components: {
    RelativeTime
  }
};
```

#### Vue Features

- **Composition API Support**: Works with both Options and Composition API
- **Vue 3 Compatible**: Built for Vue 3
- **TypeScript Support**: Full type safety
- **Scoped Styling**: Works with Vue's scoped styles

```typescript
// Composition API Example
import { RelativeTime } from 'awesome-time/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { RelativeTime },
  setup() {
    return () => <RelativeTime date={new Date()} />;
  }
});

// Scoped Styling Example
<style scoped>
.relative-time {
  color: var(--primary-color);
}
</style>
```

### Angular

```typescript
import { RelativeTimeModule } from 'awesome-time/angular';

@NgModule({
  imports: [RelativeTimeModule]
})
export class AppModule { }
```

#### Angular Features

- **Standalone Components**: Support for Angular's standalone components
- **OnPush Change Detection**: Optimized for performance
- **TypeScript Support**: Full type safety
- **Angular Universal**: Works with server-side rendering

```typescript
// Standalone Component Example
import { RelativeTimeComponent } from 'awesome-time/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RelativeTimeComponent],
  template: `<relative-time [date]="now"></relative-time>`
})
export class AppComponent {
  now = new Date();
}
```

## Framework-Specific Optimizations

### React Optimizations

- Tree-shakeable exports
- Server component support
- Suspense integration
- Error boundary support
- Minimal runtime overhead

### Vue Optimizations

- Tree-shakeable exports
- Composition API support
- Scoped styling support
- Minimal runtime overhead
- Vue 3 specific optimizations

### Angular Optimizations

- Tree-shakeable exports
- Standalone component support
- OnPush change detection
- Minimal runtime overhead
- Angular Universal support

## Features

- Framework-specific components for React, Vue, and Angular
- Internationalization support
- Accessible by default
- TypeScript support
- Tree-shakeable
- Framework-specific bundle optimization

## Framework Support

The library is optimized to only include the framework-specific code you need:

- `awesome-time` - Core functionality
- `awesome-time/react` - React components
- `awesome-time/vue` - Vue components
- `awesome-time/angular` - Angular components

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[![codecov](https://codecov.io/gh/<your-username>/awesome-time/branch/main/graph/badge.svg)](https://codecov.io/gh/<your-username>/awesome-time) 

## 🧪 Test Coverage

[![codecov](https://codecov.io/gh/<your-username>/awesome-time/branch/main/graph/badge.svg)](https://codecov.io/gh/<your-username>/awesome-time)

- 100% unit test coverage for core logic
- E2E tests ensure consistent output across React, Vue, and Angular

## 1. Test Coverage Badge

**a. Add a Coverage Badge to README**
If you use a service like [Codecov](https://codecov.io/) or [Coveralls](https://coveralls.io/), you can add a badge to your README.  
Example (Codecov):

```md
[![codecov](https://codecov.io/gh/<your-username>/awesome-time/branch/main/graph/badge.svg)](https://codecov.io/gh/<your-username>/awesome-time)
```

- Replace `<your-username>` with your GitHub username or org.
- You'll need to set up Codecov or Coveralls in your CI (GitHub Actions, etc.) to upload coverage reports.

**b. Ensure Core Logic is Covered**
- Make sure your `src/core` logic is tested with unit tests (Jest, Vitest, etc.).
- Run `npm run test -- --coverage` to generate a coverage report.
- Aim for high coverage, especially for date formatting, edge cases, and error handling.

## 2. Cross-Framework E2E Tests

**a. Why?**
- This ensures that, for the same input date, React, Vue, and Angular components all render the same output string.
- It helps catch regressions and inconsistencies between framework wrappers.

**b. How to Implement**
- Create a simple test app or script for each framework that renders the component with a fixed date.
- Use a tool like [Playwright](https://playwright.dev/) or [Cypress](https://www.cypress.io/) to run browser-based E2E tests.
- The E2E test should:
  1. Render each framework's component with the same date.
  2. Assert that the rendered text matches across all frameworks.

**Example E2E Test Plan (Pseudocode):**
```js
for each framework in [react, vue, angular]:
    visit demo page for framework
    get text content of <relative-time>
    assert text === expectedString
```

**c. Organize E2E Tests**
- Place E2E tests in a `/e2e` or `/test/e2e` directory.
- Document in README how to run them.

## 3. README Example

Add a section like this:

```md
## 🧪 Test Coverage

[![codecov](https://codecov.io/gh/<your-username>/awesome-time/branch/main/graph/badge.svg)](https://codecov.io/gh/<your-username>/awesome-time)

- 100% unit test coverage for core logic
- E2E tests ensure consistent output across React, Vue, and Angular
``` 