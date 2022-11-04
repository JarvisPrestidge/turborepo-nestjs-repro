/**
 * Convert unknown object to string value
 *
 * @export
 * @param {unknown} val
 * @returns {string}
 */
export function toString(val: unknown): string {
    let value = String(val);
    if (value === "[object Object]") {
        try {
            value = JSON.stringify(val);
        } catch {
            //ignore
        }
    }
    return value;
}
