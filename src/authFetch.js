const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return matches ? matches[2] : null;
};

export default async function fetchWithRefresh(url, options = {}) {
  // Якщо url не починається з http або /, додаємо /
  if (typeof url === 'string' && !url.startsWith('http') && !url.startsWith('/')) {
    url = '/' + url;
  }
  let accessToken = getCookie("access_token");
  let refreshToken = getCookie("refresh_token");

  // Встановлюємо Authorization
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  let response = await fetch(url, options);

  if (response.status === 401 && refreshToken) {
    // Спроба оновити токен
    const refreshResponse = await fetch("/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const tokens = await refreshResponse.json();
      // Зберігаємо нові токени в куках
      document.cookie = `access_token=${tokens.AccessToken}; path=/;`;
      document.cookie = `refresh_token=${tokens.RefreshToken}; path=/;`;

      // Повторюємо оригінальний запит з новим токеном
      options.headers.Authorization = `Bearer ${tokens.AccessToken}`;
      response = await fetch(url, options);
    } else {
      // Якщо не вдалось оновити токен — логаут
      logoutUser();
      throw new Error("Session expired. Please login again.");
    }
  }

  return response;
}

export function logoutUser() {
  document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  window.location.href = "/login";
}