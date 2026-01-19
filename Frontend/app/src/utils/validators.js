// FORM INPUT : FULL

// 2 names allowed (first and last)
// allowed: letters, accented characters, hyphen
export const nameRegex = /^[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)?\s[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)?$/;

// enforces email pattern with @ and TLD
// allowed for local part: letters, numbers, selected symbols
// 2 letter TLD enforced
export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// German location enforced
// allowed letters, German umlaut chars, hyphen, no spaces 
export const locationRegex = /^[A-Za-zäüöÄÜÖ\-]+$/;

// must contain: lowercase, uppercase, number, special character
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

// SEARCH INPUT : PARTIAL

// allowed: letters, accented characters, spaces, hyphen
export const nameSmRegex = /^[A-Za-zÀ-ÿ\s-]*$/;

// allowed: letters, numbers, selected symbols
export const emailSmRegex = /^[A-Za-z0-9._%+-@]*$/;

