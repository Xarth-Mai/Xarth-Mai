import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

// Handle App Shell Transition
const shell = document.getElementById('app-shell')
if (shell) {
  shell.classList.add('fade-out')
  setTimeout(() => {
    shell.remove()
  }, 200)
}

export default app
