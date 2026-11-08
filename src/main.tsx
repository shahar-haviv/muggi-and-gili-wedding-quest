import { render } from 'preact';
import './styles/index.css';
import { App } from './App.tsx';

const appRoot = document.querySelector('#app');
if (appRoot) {
  render(<App />, appRoot);
}
