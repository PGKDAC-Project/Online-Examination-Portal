// Utility for local storage operations

export const getJson = (key, defaultValue = []) => {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return defaultValue;
        return JSON.parse(stored);
    } catch (e) {
        console.error(`Error parsing storage key "${key}":`, e);
        return defaultValue;
    }
};

export const setJson = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Error setting storage key "${key}":`, e);
    }
};
