import { 
  generateAriaId, 
  handleKeyboardNavigation, 
  isElementFocusable, 
  getFocusableElements 
} from '../a11y';

describe('Accessibility Utilities', () => {
  describe('generateAriaId', () => {
    test('generates unique IDs with prefix', () => {
      const id1 = generateAriaId('test');
      const id2 = generateAriaId('test');
      
      // IDs should start with the prefix
      expect(id1).toMatch(/^test-/);
      expect(id2).toMatch(/^test-/);
      
      // IDs should be unique
      expect(id1).not.toBe(id2);
    });

    test('generates unique IDs without prefix', () => {
      const id1 = generateAriaId();
      const id2 = generateAriaId();
      
      // IDs should start with 'aria-'
      expect(id1).toMatch(/^aria-/);
      expect(id2).toMatch(/^aria-/);
      
      // IDs should be unique
      expect(id1).not.toBe(id2);
    });
  });

  describe('handleKeyboardNavigation', () => {
    test('calls callback when Enter key is pressed', () => {
      const mockCallback = jest.fn();
      const mockEvent = { key: 'Enter', preventDefault: jest.fn() };
      
      handleKeyboardNavigation(mockEvent, mockCallback);
      
      expect(mockCallback).toHaveBeenCalled();
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    test('calls callback when Space key is pressed', () => {
      const mockCallback = jest.fn();
      const mockEvent = { key: ' ', preventDefault: jest.fn() };
      
      handleKeyboardNavigation(mockEvent, mockCallback);
      
      expect(mockCallback).toHaveBeenCalled();
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    test('does not call callback for other keys', () => {
      const mockCallback = jest.fn();
      const mockEvent = { key: 'Tab', preventDefault: jest.fn() };
      
      handleKeyboardNavigation(mockEvent, mockCallback);
      
      expect(mockCallback).not.toHaveBeenCalled();
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('isElementFocusable', () => {
    beforeEach(() => {
      // Set up document body for tests
      document.body.innerHTML = `
        <button id="button">Button</button>
        <a id="link" href="#">Link</a>
        <input id="input" type="text" />
        <div id="div">Div</div>
        <button id="disabled-button" disabled>Disabled Button</button>
        <div id="tabindex-div" tabindex="0">Div with tabindex</div>
        <div id="hidden-div" style="display: none;">Hidden Div</div>
      `;
    });

    test('identifies focusable elements correctly', () => {
      const button = document.getElementById('button');
      const link = document.getElementById('link');
      const input = document.getElementById('input');
      const div = document.getElementById('div');
      const disabledButton = document.getElementById('disabled-button');
      const tabindexDiv = document.getElementById('tabindex-div');
      const hiddenDiv = document.getElementById('hidden-div');
      
      expect(isElementFocusable(button)).toBe(true);
      expect(isElementFocusable(link)).toBe(true);
      expect(isElementFocusable(input)).toBe(true);
      expect(isElementFocusable(div)).toBe(false);
      expect(isElementFocusable(disabledButton)).toBe(false);
      expect(isElementFocusable(tabindexDiv)).toBe(true);
      expect(isElementFocusable(hiddenDiv)).toBe(false);
    });
  });

  describe('getFocusableElements', () => {
    beforeEach(() => {
      // Set up document body for tests
      document.body.innerHTML = `
        <div id="container">
          <button>Button 1</button>
          <a href="#">Link</a>
          <input type="text" />
          <div>Non-focusable Div</div>
          <button disabled>Disabled Button</button>
          <div tabindex="0">Div with tabindex</div>
          <div style="display: none;">Hidden Div</div>
          <button>Button 2</button>
        </div>
        <div id="outside-container">
          <button>Outside Button</button>
        </div>
      `;
    });

    test('returns all focusable elements within container', () => {
      const container = document.getElementById('container');
      const focusableElements = getFocusableElements(container);
      
      // Should find 4 focusable elements: 2 buttons, 1 link, 1 input, and 1 div with tabindex
      expect(focusableElements.length).toBe(5);
      
      // Check types of elements
      const elementTypes = focusableElements.map(el => el.tagName.toLowerCase());
      expect(elementTypes).toContain('button');
      expect(elementTypes).toContain('a');
      expect(elementTypes).toContain('input');
      expect(elementTypes).toContain('div'); // The div with tabindex
    });

    test('does not include elements outside the container', () => {
      const container = document.getElementById('container');
      const focusableElements = getFocusableElements(container);
      
      // Check that none of the elements are the outside button
      const outsideButton = document.querySelector('#outside-container button');
      expect(focusableElements).not.toContain(outsideButton);
    });

    test('does not include disabled or hidden elements', () => {
      const container = document.getElementById('container');
      const focusableElements = getFocusableElements(container);
      
      // Get disabled and hidden elements
      const disabledButton = document.querySelector('button[disabled]');
      const hiddenDiv = document.querySelector('div[style="display: none;"]');
      
      // Check that they are not included
      expect(focusableElements).not.toContain(disabledButton);
      expect(focusableElements).not.toContain(hiddenDiv);
    });

    test('returns empty array if container is null', () => {
      const focusableElements = getFocusableElements(null);
      expect(focusableElements).toEqual([]);
    });
  });
}); 