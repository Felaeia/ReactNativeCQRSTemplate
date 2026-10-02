# React Native CQRS Template

A starter for React Native apps built with Expo SDK 54, Expo Router, TypeScript, Zod, and TanStack Query. The included todo feature demonstrates a small CQRS-style split between commands that change state and queries that read it.

## Getting started

Use Node.js 22 or newer and npm:

```sh
npm install
npm start
```

Then use the Expo CLI prompts to open the app on a device, simulator, or web. The example stores todos in memory, so they reset when the app process restarts. Replace its repository with your API or persistent storage adapter for a production feature.

Useful checks:

```sh
npm test
npx tsc --noEmit
npm run lint
```

## Project layout

```text
src/
  app/                     Expo Router routes and root layout
  features/
    todos/
      handlers.ts          Validated command and query handlers
      hooks.ts             TanStack Query hooks and invalidation
      todo-repository.ts   In-memory example data adapter
      todo-schema.ts       Zod contracts and inferred types
      __tests__/           Plain-function handler tests
  screens/                 Screen UI used by routes
.github/workflows/         CI checks
.husky/                    Git hooks
```

Keep feature behavior, contracts, and data access together under `src/features/<feature>`. Put route registration in `src/app`, reusable screen-level UI in `src/screens`, and genuinely shared components in a `src/components` directory when one is needed.

## How a command and query flow through the app

### Query (read side)

1. `src/app/index.tsx` renders the todos screen.
2. The screen calls `useTodos()` from `src/features/todos/hooks.ts`.
3. TanStack Query invokes `getTodosHandler()` in `handlers.ts`.
4. The handler reads from `todoRepository` and validates the complete result with `TodosSchema`.
5. The screen renders the validated list, or shows loading/error state.

### Command (write side)

1. The screen calls a mutation hook such as `useCreateTodo()` or `useToggleTodo()`.
2. Its mutation function calls a command handler in `handlers.ts`.
3. The handler validates untrusted command input with its Zod command schema before calling the repository.
4. The handler validates the returned todo before handing it back to the UI.
5. On success, the mutation invalidates the todos query key so the read side fetches fresh state.

Handlers are ordinary async functions with an injected repository. This keeps business behavior testable without rendering React components, starting Expo, or depending on a network service.

## Create a feature

Use the todo feature as the reference:

1. Create `src/features/<name>/` and define input and output schemas in a `<name>-schema.ts` file. Infer TypeScript types from the schemas rather than duplicating their shapes.
2. Define a repository interface and an adapter in `<name>-repository.ts`. Keep persistence/network details behind that interface.
3. Add command and query handler functions in `handlers.ts`. Parse command inputs before side effects and parse query results before returning them.
4. Add query keys and TanStack Query hooks in `hooks.ts`. For commands, invalidate the affected query keys in `onSuccess`; do not invalidate on failure.
5. Write plain Jest tests for handlers, including valid inputs, invalid inputs, repository calls, and invalid repository results.
6. Build a screen in `src/screens/` that uses the hooks, then expose it through a route in `src/app/`.

For a remote API, keep HTTP calls in the repository adapter and continue returning data through the same validated handlers. Keep screen components free of direct storage or network calls.

## Rename this project

When creating a project from this template, update all project-specific names:

1. Set the npm package name in `package.json` to a lowercase, hyphenated name. Regenerate the lockfile with `npm install`.
2. In `app.json`, update `expo.name` (the displayed app name), `expo.slug` (the Expo project identifier), and `expo.scheme` (deep-link scheme).
3. Set `expo.ios.bundleIdentifier` and `expo.android.package` to identifiers owned by your app, such as `com.example.myapp`.
4. Update this README's title and description, then search the repository for `ReactNativeCQRSTemplate` and `react-native-cqrs-template` to replace any remaining references.
5. If you publish the fork as its own repository, change its GitHub description and topics on the repository's **Settings → General** page.

Do not reuse the template's bundle identifier or URL scheme for a published app.

## Repository metadata

Suggested GitHub description:

> Expo React Native starter demonstrating CQRS with TypeScript, Zod, and TanStack Query.

Suggested topics: `expo`, `react-native`, `typescript`, `cqrs`, `tanstack-query`, `zod`, `starter-template`.

To enable **Use this template**, open the repository's **Settings → General** page and check **Template repository**.
