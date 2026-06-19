// ─────────────────────────────────────────────
// DOM driving helpers for engine (Tier 2) tests.
// These mimic real user interactions so we test behaviour, not internals.
// ─────────────────────────────────────────────

/** Set a comparison slot to a given item id and trigger a re-render. */
function setSlot(window, slotIndex, id) {
  const sel = window.document.querySelector(`.slot-select[data-slot="${slotIndex}"]`);
  if (!sel) throw new Error(`slot-select for slot ${slotIndex} not found`);
  sel.value = id;
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
}

/** Change the active currency and re-render. */
function setCurrency(window, code) {
  const sel = window.document.getElementById('currency-select');
  sel.value = code;
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
}

/** Click a mode button ('cameras' | 'lenses'). */
function clickMode(window, mode) {
  const btn = window.document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  btn.dispatchEvent(new window.Event('click', { bubbles: true }));
}

/** Click a brand switcher button by slug. */
function clickBrand(window, slug) {
  const btn = window.document.querySelector(`.brand-sw-btn[data-brand="${slug}"]`);
  btn.dispatchEvent(new window.Event('click', { bubbles: true }));
}

/** The <select> for a slot, with its <option> elements. */
function slotSelect(window, slotIndex) {
  return window.document.querySelector(`.slot-select[data-slot="${slotIndex}"]`);
}

module.exports = { setSlot, setCurrency, clickMode, clickBrand, slotSelect };
