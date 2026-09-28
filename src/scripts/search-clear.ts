document
  .querySelectorAll<HTMLButtonElement>('[data-search-clear]')
  .forEach((button) => {
    const input = button.parentElement?.querySelector<HTMLInputElement>(
      'input[type="search"]',
    );
    if (!input) return;

    button.addEventListener('click', (event) => {
      event.preventDefault();
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
  });
