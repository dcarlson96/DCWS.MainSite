# Reusable ViewModels

This folder holds reusable, entity-level Knockout view models that are shared
across multiple pages (for example, a customer, address, or document concept
used by more than one page). It is currently empty because no page in this
project yet needs a shared entity view model.

## Convention

- One file per concept, e.g. `Scripts/ViewModels/Customer.ts`.
- Represent reusable domain state, not an entire page. Page-specific state
  and behavior belongs in the page's own view model
  (`Scripts/<Area>/<Feature>.<Page>.ts`), which composes these reusable
  view models instead of duplicating their observables.
- Use the `DCWS.ViewModels` namespace, consistent with `Layout.ts`.
- When a reusable view model exchanges data with the backend API, follow a
  consistent DTO mapping pattern:
  - `load(...)` — retrieves data from the API and calls `loadFromDto`.
  - `loadFromDto(dto)` — maps API data onto Knockout observables.
  - `saveToDto()` — maps the current observable state back into a plain
	DTO suitable for submission.
- Page `.Main.ts` bootstrap files construct and wire these view models; the
  view models themselves should not call `ko.applyBindings(...)`.
