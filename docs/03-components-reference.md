# Components Reference

The beauty of this boilerplate is that you **own the code**. The components are not locked away in a black-box `node_modules` folder. 

All UI components live in `src/components/ui/`.

## Base Primitives (Radix + Tailwind)
These are your building blocks. They are highly accessible and fully customizable.

- `Button` (`button.tsx`): Standard trigger with variants (default, outline, ghost, destructive).
- `Input` (`input.tsx`): Native text input with standardized focus rings.
- `Badge` (`badge.tsx`): Status indicators (success, warning, destructive).
- `Card` (`card.tsx`): Container for grouped information.
- `Sheet` (`sheet.tsx`): Slide-in side panels for detail views without losing context.
- `Table` (`table.tsx`): Native HTML table structure wrapped in Tailwind constraints.

## Business Components
These are complex, compound components located in `src/components/compliance/`. They combine multiple primitives to solve specific business problems.

- `EntityDataTable`: A dense, interactive data grid powered by `@tanstack/react-table` for sorting, filtering, and mass selection.
- `KycProfileCard`: A high-level overview of an entity's risk score and status.
- `KycOnboardingForm`: A production-ready form utilizing `react-hook-form` and `zod` to ensure strict data entry rules (like enforcing 14-digit CNPJs).
- `AuditTimeline`: A vertical stepper to display compliance logs chronologically.

## Modifying a Component
Want your buttons to be entirely rounded (pill-shaped)?
Just go to `src/components/ui/button.tsx` and change `rounded-md` to `rounded-full` in the `cva` definition. Every button in your app will instantly update.
