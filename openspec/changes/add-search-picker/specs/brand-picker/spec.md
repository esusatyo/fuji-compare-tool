## REMOVED Requirements

### Requirement: Root page redirect is conditional on a stored brand preference
**Reason**: The root page now hosts the comparison tool. Redirecting returning visitors to their stored brand would keep the tool from the visitors most likely to use it.
**Migration**: None for visitors — the root page always renders. Brand pages still persist `localStorage['brand']`, and header logos still link `/?brands` (the parameter is now inert), so the redirect can be reinstated by restoring the inline script in `index.html` and its tests.

## ADDED Requirements

### Requirement: Root page never redirects
The root `index.html` SHALL render for every visitor regardless of any stored brand preference, and SHALL neither read nor modify `localStorage['brand']`.

#### Scenario: Returning visitor
- **WHEN** a user whose `localStorage['brand']` equals `'fujifilm'` visits the root URL
- **THEN** the root page renders, no navigation occurs, and the stored value is unchanged
