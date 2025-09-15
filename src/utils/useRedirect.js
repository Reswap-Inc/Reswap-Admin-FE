export function handleLogin(response) {
    if (response.status === 404) {
      window.location.href = 'https://reswap.tmithun.com/login';
      return;
    }
  }
  