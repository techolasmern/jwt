const field_name = "AUTH_TOKEN"

export const storage = {
    set: (token) => {
        localStorage.setItem(field_name, token);
    },
    get: () => {
        return localStorage.getItem(field_name);
    },
    remove: () => {
        localStorage.removeItem(field_name);
    }
}