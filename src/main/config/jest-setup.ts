import '@testing-library/jest-dom';
import React from 'react';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

global.React = React; // this also works for other globally available libraries
