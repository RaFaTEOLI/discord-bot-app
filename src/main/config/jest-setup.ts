import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

global.React = React; // this also works for other globally available libraries
