import type { IconLibrary } from './library';

//
// System icons are a separate library to ensure they're always available, regardless of how the default icon library is
// configured or if its icons resolve properly.
//
// All Solid components must use the system library instead of the default library.
// For visual consistency, they are a subset of Union Investment's official icons.
//
export const icons = {
  calendar: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M21 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1ZM6 4v1.667a1 1 0 0 0 2 0V4h8v1.667a1 1 0 0 0 2 0V4h2v4H4V4h2ZM4 20V10h16v10H4Z"/>
      <path d="m7.603 13.263.597.81.31-.25c.31-.25.593-.49.733-.63h.017c-.017.333-.033 1.14-.033 1.647V18h1.223v-6.03H9.353l-1.75 1.293ZM14.667 11.867c-1.543 0-2.26 1-2.26 3.163 0 1.9.667 3.063 2.217 3.063s2.193-1.18 2.193-3.13c-.017-2.063-.743-3.097-2.15-3.097v.001Zm-.044 5.333c-.647 0-1-.76-1-2.28 0-1.44.353-2.173 1-2.173s1 .743 1 2.233c0 1.49-.387 2.227-1.017 2.227l.017-.007Z"/>
    </svg>
  `,
  'chevron-down': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M20.257 6.333l-8.257 9.173-8.257-9.173c-0.181-0.181-0.431-0.292-0.707-0.292-0.552 0-1 0.448-1 1 0 0.238 0.083 0.456 0.222 0.628l-0.001-0.002 9 10c0.184 0.204 0.449 0.331 0.743 0.331s0.56-0.127 0.743-0.33l0.001-0.001 9-10c0.137-0.17 0.22-0.388 0.22-0.626 0-0.552-0.448-1-1-1-0.276 0-0.526 0.112-0.707 0.293v0z"></path>
    </svg>
  `,
  'chevron-up': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12.743 6.333c-0.188-0.195-0.452-0.316-0.743-0.316s-0.555 0.121-0.743 0.315l-0 0-9 10c-0.137 0.17-0.22 0.388-0.22 0.626 0 0.552 0.448 1 1 1 0.276 0 0.526-0.112 0.707-0.293v0l8.257-9.173 8.257 9.173c0.181 0.181 0.431 0.292 0.707 0.292 0.552 0 1-0.448 1-1 0-0.238-0.083-0.456-0.222-0.628l0.001 0.002z"></path>
    </svg>
  `,
  clock: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M13 11.587V8a1 1 0 0 0-2 0v4c0 .07.007.138.021.203l-.001-.006a.855.855 0 0 0 .029.093l-.002-.006c0 .033 0 .067.03.1a.709.709 0 0 0 .055.103l-.002-.003.037.07c.04.057.081.107.127.153l2.827 2.83a1.002 1.002 0 0 0 1.417-1.417L13 11.587Z"/>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/>
    </svg>
  `,
  close: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M21.707 2.293a1 1 0 0 0-1.414 0L12 10.586 3.707 2.293a1 1 0 0 0-1.413 1.414l-.001-.001 8.293 8.293-8.293 8.293a1 1 0 0 0 0 1.414 1 1 0 0 0 1.414 0L12 13.413l8.293 8.293a1 1 0 0 0 1.414 0 1 1 0 0 0 0-1.414l-8.293-8.293 8.293-8.293a1 1 0 0 0 0-1.414z"/></svg>
    </svg>
  `,
  'closing-round': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/>
      <path d="M16.373 7.627a1 1 0 0 0-1.414 0l-2.96 2.96-2.96-2.96a1 1 0 0 0-1.413 1.414l-.001-.001 2.96 2.96-2.96 2.96a1 1 0 0 0 1.414 1.414l2.96-2.96 2.96 2.96a1 1 0 0 0 1.414-1.414L13.413 12l2.96-2.96a1 1 0 0 0 0-1.414v.001Z"/>
    </svg>`,
  confirm: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M21.528 2.167a1 1 0 0 0-1.384.277l-.002.004-11.333 17-5.127-5.153a1 1 0 0 0-1.413 1.414l-.001-.001 6 6a.997.997 0 0 0 .707.293h.1c.307-.032.57-.199.731-.44l.002-.004 12-18a1 1 0 0 0-.276-1.388l-.004-.002Z"/>
    </svg>
  `,
  eye: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 18.96c-5.263 0-10-5.68-10-6.96 0-1.28 4.737-6.96 10-6.96S22 10.72 22 12c0 1.28-4.737 6.96-10 6.96ZM4.1 12c.76 1.197 4.07 4.96 7.9 4.96s7.14-3.767 7.9-4.96c-.76-1.197-4.07-4.96-7.9-4.96S4.86 10.807 4.1 12Z"/>
      <path d="M12 16.107A4.11 4.11 0 0 1 7.893 12 4.11 4.11 0 0 1 12 7.893 4.11 4.11 0 0 1 16.107 12 4.11 4.11 0 0 1 12 16.107Zm0-6.21a2.107 2.107 0 1 0 0 4.213 2.107 2.107 0 0 0 0-4.213Z"/>
    </svg>
  `,
  'eye-crossed-out': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 16.107A4.11 4.11 0 0 1 7.893 12 4.11 4.11 0 0 1 12 7.893 4.11 4.11 0 0 1 16.107 12 4.11 4.11 0 0 1 12 16.107Zm0-6.21a2.107 2.107 0 1 0 0 4.213 2.107 2.107 0 0 0 0-4.213Z"/>
      <path d="M12 18.96c-5.263 0-10-5.68-10-6.96 0-1.28 4.737-6.96 10-6.96S22 10.72 22 12c0 1.28-4.737 6.96-10 6.96ZM4.1 12c.76 1.197 4.07 4.96 7.9 4.96s7.14-3.767 7.9-4.96c-.76-1.197-4.07-4.96-7.9-4.96S4.86 10.807 4.1 12Z"/>
      <path d="M3 22a1 1 0 0 1-.707-1.707l18-18a1 1 0 0 1 1.414 1.414l-18 18A.991.991 0 0 1 3 22Z"/>
    </svg>
  `,
  'info-circle': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/><path d="M13.333 7.833a1.5 1.5 0 1 1-3.001-.001 1.5 1.5 0 0 1 3.001.001ZM13 11.667a1 1 0 0 0-1-1h-1a1 1 0 0 0 0 2v2.667h2v-3.667Z"/><path d="M11 16.333v-1h-1a1 1 0 0 0 0 2h2a1 1 0 0 1-1-1Zm3-1h-1v1a1 1 0 0 1-1 1h2a1 1 0 0 0 0-2Z"/><path  d="M13 16.333v-1h-2v1a1 1 0 0 0 2 0Z"/></svg>`,
  'status-hook': `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
        <path fill="currentColor" d="m9.947 1.138-.005.008-.001.003-5.56 8.34-2.434-2.447-.004-.004a.648.648 0 0 0-1.093.475c0 .172.066.328.175.444l.003.004 3 2.999c.117.117.28.19.46.19h.065c.2-.021.37-.13.475-.286l.005-.008.001-.002 5.994-8.992a.65.65 0 0 0-.18-.902l-.007-.005-.002-.002a.65.65 0 0 0-.892.185Z"/>
    </svg>
  `,
  'status-minus': `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M10 5.375H2C1.65496 5.375 1.375 5.65496 1.375 6C1.375 6.34504 1.65496 6.625 2 6.625H10C10.345 6.625 10.625 6.34504 10.625 6C10.625 5.65496 10.345 5.375 10 5.375Z" fill="currentColor"/>
    </svg>
  `,
  pause: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M9 22a.99997.99997 0 0 0 1-1V3a1.00003 1.00003 0 0 0-1-1H5a1.00003 1.00003 0 0 0-1 1v18a.99997.99997 0 0 0 1 1h4ZM6 4h2v16H6V4ZM19 22c.2652 0 .5196-.1054.7071-.2929A1.0001 1.0001 0 0 0 20 21V3a.99997.99997 0 0 0-1-1h-4a.99997.99997 0 0 0-1 1v18c0 .2652.1054.5196.2929.7071S14.7348 22 15 22h4ZM16 4h2v16h-2V4Z"/>
    </svg>
  `,
  risk: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12.893 2.553a1.002 1.002 0 0 0-1.784-.006L2.106 20.553A1 1 0 0 0 3 22h18a1 1 0 0 0 .891-1.452l.003.006-9.001-18.001ZM4.617 20 12 5.237 19.383 20H4.617Z"/>
      <path d="M11 10.667V15a1 1 0 0 0 2 0v-4.333a1 1 0 0 0-2 0ZM13 18a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
    </svg>
  `,
  start: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="m57.44 29.76-37.333-24A2.667 2.667 0 0 0 16 8v48a2.668 2.668 0 0 0 2.667 2.666 2.672 2.672 0 0 0 1.45-.431l-.01.005 37.333-24a2.67 2.67 0 0 0 1.192-2.221c0-.923-.47-1.74-1.184-2.216l-.01-.006.002-.037ZM21.333 51.112V12.89l29.734 19.112-29.734 19.11Z"/>
    </svg>
  `,
  'confirm-circle': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/><path d="M15.843 7.473a.999.999 0 0 0-1.367.329l-.002.004-3.667 6.223-1.757-1.753a1 1 0 0 0-1.413 1.414l-.001-.001 2.667 2.667a.997.997 0 0 0 .695.31h.128c.314-.042.578-.223.731-.479l.003-.005 4.333-7.333a1 1 0 0 0-.345-1.374l-.005-.003v.001Z"/></svg>`,
  warning: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.893 2.55295C12.725 2.22395 12.388 2.00195 12 2.00195C11.612 2.00195 11.275 2.22295 11.109 2.54695L2.10598 20.553C2.03998 20.683 2.00098 20.837 2.00098 21C2.00098 21.552 2.44798 21.999 2.99998 22H21C21.552 21.999 21.999 21.552 21.999 21C21.999 20.837 21.96 20.683 21.891 20.548L21.894 20.554L12.893 2.55295ZM4.61698 20L12 5.23695L19.383 20H4.61698Z"/><path d="M11 10.667V15C11 15.552 11.448 16 12 16C12.552 16 13 15.552 13 15V10.667C13 10.115 12.552 9.66695 12 9.66695C11.448 9.66695 11 10.115 11 10.667Z"/><path d="M13 18C13 18.552 12.552 19 12 19C11.448 19 11 18.552 11 18C11 17.448 11.448 17 12 17C12.552 17 13 17.448 13 18Z"/></svg>`,
  'exclamation-circle': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 17C13 17.552 12.552 18 12 18C11.448 18 11 17.552 11 17C11 16.448 11.448 16 12 16C12.552 16 13 16.448 13 17Z"/><path d="M12 6C11.448 6 11 6.448 11 7V13C11 13.552 11.448 14 12 14C12.552 14 13 13.552 13 13V7C13 6.448 12.552 6 12 6Z"/><path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 20C7.582 20 4 16.418 4 12C4 7.582 7.582 4 12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20Z"/></svg>`,
  'magnifying-glass': `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21.707 20.293l-6.967-6.96c-0.046-0.046-0.096-0.087-0.15-0.124l-0.004-0.002c0.882-1.162 1.413-2.632 1.413-4.227 0-3.881-3.146-7.027-7.027-7.027s-7.027 3.146-7.027 7.027c0 3.881 3.146 7.027 7.027 7.027 1.594 0 3.065-0.531 4.244-1.426l-0.017 0.013c0.039 0.057 0.081 0.107 0.127 0.153l6.967 6.967c0.181 0.181 0.431 0.292 0.707 0.292s0.526-0.112 0.707-0.292v0c0.183-0.181 0.296-0.432 0.296-0.71s-0.113-0.529-0.296-0.71l-0-0zM9 14c-2.761 0-5-2.239-5-5s2.239-5 5-5c2.761 0 5 2.239 5 5v0c0 2.761-2.239 5-5 5v0z"></path></svg>`
};

const systemLibrary: IconLibrary = {
  name: 'system',
  resolver: (name: keyof typeof icons) => {
    if (name in icons) {
      return `data:image/svg+xml,${encodeURIComponent(icons[name])}`;
    }
    return '';
  },
  mutator: svg => svg.setAttribute('fill', 'currentColor')
};

export default systemLibrary;
