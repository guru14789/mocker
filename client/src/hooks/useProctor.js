import { useEffect, useRef } from 'react';

export const useProctor = ({ onViolation, maxViolations = 2 }) => {
  const violations = useRef({
    tab_switch: 0,
    window_blur: 0,
    head_turn: 0,
    keyboard_shortcut: 0
  });

  useEffect(() => {
    // Disable right-click
    const blockRightClick = (e) => e.preventDefault();
    document.addEventListener('contextmenu', blockRightClick);

    // Disable copy-paste
    const blockCopy = (e) => e.preventDefault();
    document.addEventListener('copy', blockCopy);
    document.addEventListener('cut', blockCopy);
    document.addEventListener('paste', blockCopy);

    // Tab / window switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        violations.current.tab_switch += 1;
        onViolation({ type: 'tab_switch', count: violations.current.tab_switch });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Window blur detection
    const handleBlur = () => {
      violations.current.window_blur += 1;
      onViolation({ type: 'window_blur', count: violations.current.window_blur });
    };
    window.addEventListener('blur', handleBlur);

    // Block keyboard shortcuts
    const blockKeys = (e) => {
      if (
        (e.ctrlKey && ['c', 'v', 'x', 'u', 's', 'a'].includes(e.key.toLowerCase())) ||
        (e.altKey && e.key === 'Tab') ||
        e.key === 'F12' ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        violations.current.keyboard_shortcut += 1;
        onViolation({ type: 'keyboard_shortcut', key: e.key, count: violations.current.keyboard_shortcut });
      }
    };
    document.addEventListener('keydown', blockKeys);

    return () => {
      document.removeEventListener('contextmenu', blockRightClick);
      document.removeEventListener('copy', blockCopy);
      document.removeEventListener('cut', blockCopy);
      document.removeEventListener('paste', blockCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('keydown', blockKeys);
    };
  }, [onViolation]);

  const triggerHeadTurn = () => {
    violations.current.head_turn += 1;
    onViolation({ type: 'head_turn', count: violations.current.head_turn });
  };

  return { triggerHeadTurn };
};
