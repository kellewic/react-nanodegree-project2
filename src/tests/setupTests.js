import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder.
// Required by react-router-dom, but not included in jsdom
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;