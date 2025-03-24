/**
 * Accessibility utility functions
 * 
 * This module provides helper functions to improve accessibility
 * throughout the application.
 */

/**
 * Creates props for accessible elements that serve as interactive triggers
 * 
 * @param {string} id - The ID of the element being controlled
 * @param {boolean} expanded - Whether the controlled element is expanded
 * @returns {Object} - Props to spread on the trigger element
 */
export const getAccordionTriggerProps = (id, expanded) => ({
  'aria-expanded': expanded,
  'aria-controls': id,
  id: `${id}-trigger`,
  role: 'button',
  tabIndex: 0,
});

/**
 * Creates props for accessible elements that are controlled by triggers
 * 
 * @param {string} id - The ID of the element
 * @returns {Object} - Props to spread on the controlled element
 */
export const getAccordionPanelProps = (id) => ({
  id,
  role: 'region',
  'aria-labelledby': `${id}-trigger`,
});

/**
 * Creates props for accessible tab elements
 * 
 * @param {string} id - Base ID for the tabs
 * @param {number} index - Index of the tab
 * @param {number} selectedIndex - Currently selected tab index
 * @returns {Object} - Props to spread on the tab element
 */
export const getTabProps = (id, index, selectedIndex) => ({
  id: `${id}-tab-${index}`,
  'aria-controls': `${id}-tabpanel-${index}`,
  'aria-selected': index === selectedIndex,
  role: 'tab',
  tabIndex: index === selectedIndex ? 0 : -1,
});

/**
 * Creates props for accessible tab panel elements
 * 
 * @param {string} id - Base ID for the tabs
 * @param {number} index - Index of the tab panel
 * @returns {Object} - Props to spread on the tab panel element
 */
export const getTabPanelProps = (id, index) => ({
  id: `${id}-tabpanel-${index}`,
  'aria-labelledby': `${id}-tab-${index}`,
  role: 'tabpanel',
  tabIndex: 0,
});

/**
 * Creates props for accessible dialog trigger elements
 * 
 * @param {string} id - The ID of the dialog
 * @param {Function} openDialog - Function to open the dialog
 * @returns {Object} - Props to spread on the trigger element
 */
export const getDialogTriggerProps = (id, openDialog) => ({
  'aria-haspopup': 'dialog',
  'aria-expanded': false,
  'aria-controls': id,
  onClick: openDialog,
});

/**
 * Creates props for accessible dialog elements
 * 
 * @param {string} id - The ID of the dialog
 * @param {string} titleId - The ID of the dialog title element
 * @returns {Object} - Props to spread on the dialog element
 */
export const getDialogProps = (id, titleId) => ({
  id,
  'aria-labelledby': titleId,
  role: 'dialog',
  'aria-modal': true,
});

/**
 * Creates an ID with a namespace to avoid collisions
 * 
 * @param {string} namespace - Namespace for the ID
 * @param {string} id - Base ID
 * @returns {string} - Namespaced ID
 */
export const createNamespacedId = (namespace, id) => `${namespace}-${id}`;

/**
 * Creates props for skip link elements
 * 
 * @param {string} targetId - The ID of the target element to skip to
 * @returns {Object} - Props to spread on the skip link element
 */
export const getSkipLinkProps = (targetId) => ({
  href: `#${targetId}`,
  className: 'skip-link',
  'aria-label': `Skip to ${targetId.replace(/-/g, ' ')}`,
});

/**
 * Creates props for elements that should be announced by screen readers
 * 
 * @param {boolean} assertive - Whether the announcement should be assertive
 * @returns {Object} - Props to spread on the element
 */
export const getAnnouncementProps = (assertive = false) => ({
  'aria-live': assertive ? 'assertive' : 'polite',
  'aria-atomic': true,
});

/**
 * Creates props for visually hidden elements that should still be accessible to screen readers
 * 
 * @returns {Object} - Props to spread on the element
 */
export const getVisuallyHiddenProps = () => ({
  className: 'visually-hidden',
  style: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: '1px',
    whiteSpace: 'nowrap',
  },
});

/**
 * Creates props for elements that should be hidden from screen readers
 * 
 * @returns {Object} - Props to spread on the element
 */
export const getAriaHiddenProps = () => ({
  'aria-hidden': true,
  tabIndex: -1,
});

/**
 * Creates props for elements that have keyboard shortcuts
 * 
 * @param {string} key - The keyboard shortcut
 * @returns {Object} - Props to spread on the element
 */
export const getKeyboardShortcutProps = (key) => ({
  'aria-keyshortcuts': key,
}); 