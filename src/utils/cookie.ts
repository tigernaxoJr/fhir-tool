/**
 * 讀取cookie
 */
function GetValue(name: string) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) return cookieValue;
    }
    return '';
}

export default {GetValue}