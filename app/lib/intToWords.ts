/**
 * Function to convert a given number into words.
 * @param n - The number to be converted into words. Must be a non-negative integer.
 * @returns The word representation of the given number, or null if input is invalid.
 */
function intToWords(n: number): string | null {
    if (n < 0 || !Number.isInteger(n)) return null;

    const singleDigit: string[] = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const doubleDigit: string[] = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const belowHundred: string[] = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (n === 0) return 'Zero';

    const translate = (num: number): string => {
        let word = '';

        if (num < 10) {
            word = singleDigit[num] + ' ';
        } else if (num < 20) {
            word = doubleDigit[num - 10] + ' ';
        } else if (num < 100) {
            const rem = translate(num % 10);
            word = belowHundred[Math.floor(num / 10) - 2] + ' ' + rem;
        } else if (num < 1000) {
            word = singleDigit[Math.floor(num / 100)] + ' Hundred ' + translate(num % 100);
        } else if (num < 1_000_000) {
            word = translate(Math.floor(num / 1000)).trim() + ' Thousand ' + translate(num % 1000);
        } else if (num < 1_000_000_000) {
            word = translate(Math.floor(num / 1_000_000)).trim() + ' Million ' + translate(num % 1_000_000);
        } else {
            word = translate(Math.floor(num / 1_000_000_000)).trim() + ' Billion ' + translate(num % 1_000_000_000);
        }

        return word;
    };

    return translate(n).trim() + ' Only';
}

export default intToWords;
