export const persistAuth = (userData: any) => {
  localStorage.setItem("bookBuddiesAuth", JSON.stringify(userData));
};

export const getPersistedAuth = () => {
  const data = localStorage.getItem("bookBuddiesAuth");
  return data ? JSON.parse(data) : null;
};

export const clearPersistedAuth = () => {
  localStorage.removeItem("bookBuddiesAuth");
};
