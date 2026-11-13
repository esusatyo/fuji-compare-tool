// ─────────────────────────────────────────────
// DOM driving helpers for engine (Tier 2) tests.
// These mimic real user interactions so we test behaviour, not internals.
// ─────────────────────────────────────────────

/** The button that shows a slot's item and opens the picker for it. */
function slotPicker(window, slotIndex) {
  return window.document.querySelector(`.slot-picker[data-slot="${slotIndex}"]`);
}

/** The item id a slot holds ('' for an empty homepage slot). */
function slotValue(window, slotIndex) {
  const btn = slotPicker(window, slotIndex);
  if (!btn) throw new Error(`slot-picker for slot ${slotIndex} not found`);
  return btn.dataset.value;
}

function click(window, el) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

/** Open a slot's picker the way a user does — by pressing its button. */
function openPicker(window, slotIndex) {
  const pop = window.document.getElementById('picker-pop');
  if (pop && !pop.hidden) closePicker(window);
  click(window, slotPicker(window, slotIndex));
  return window.document.getElementById('picker-pop');
}

function closePicker(window) {
  const input = window.document.getElementById('picker-input');
  if (!input) return;
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
}

/** Type into the open picker's search field. */
function typeInPicker(window, text) {
  const input = window.document.getElementById('picker-input');
  input.value = text;
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
}

/** Press a key in the open picker's search field. */
function pressInPicker(window, key) {
  window.document.getElementById('picker-input')
    .dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

/** What the open picker lists right now. */
function listedOptions(window) {
  return [...window.document.querySelectorAll('#picker-list .picker-option')].map(o => ({
    value: o.dataset.value,
    text: o.querySelector('.picker-option-name').textContent,
    disabled: o.getAttribute('aria-disabled') === 'true',
    selected: o.getAttribute('aria-selected') === 'true',
    active: o.classList.contains('active'),
    el: o,
  }));
}

function listedGroups(window) {
  return [...window.document.querySelectorAll('#picker-list .picker-group')].map(g => g.textContent);
}

/**
 * Everything a slot's picker offers with nothing typed: opens it, reads the
 * list, closes it again.
 * @returns {{ options: {value, text, disabled, selected}[], groups: string[] }}
 */
function pickerOptions(window, slotIndex) {
  openPicker(window, slotIndex);
  const out = { options: listedOptions(window), groups: listedGroups(window) };
  closePicker(window);
  return out;
}

/**
 * Put an item in a slot. Goes through the picker (open, click the option)
 * whenever the picker offers it; an item another slot holds is not offered,
 * so that case is forced through the engine's own selectItem — which is what
 * assigning a disabled <option>'s value used to do in these tests.
 */
function setSlot(window, slotIndex, id) {
  openPicker(window, slotIndex);
  const opt = listedOptions(window).find(o => o.value === id);
  if (opt && !opt.disabled && !opt.selected) { click(window, opt.el); return; }
  closePicker(window);
  if (opt && opt.selected) return;
  window.selectItem(slotIndex, id, 'browse');
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

/** Select a brand from the header brand-switcher dropdown by slug. */
function selectBrand(window, slug) {
  const sel = window.document.getElementById('brand-switcher');
  if (!sel) throw new Error('brand-switcher dropdown not found');
  sel.value = slug;
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
}

module.exports = {
  setSlot, setCurrency, clickMode, selectBrand,
  slotPicker, slotValue, pickerOptions, openPicker, closePicker,
  typeInPicker, pressInPicker, listedOptions, listedGroups, click,
};
