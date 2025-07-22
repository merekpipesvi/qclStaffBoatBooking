/**
 * Takes in an array and a condition to return two arrays, one that satisfies the condition and one that doesn't.
 * @param {Array} arr 
 * @param {() => boolean} condition 
 * @returns 
 */
export const splitFilter = ({array, condition}) => {
    const satisfied = [];
    const unsatisfied = [];

    array.forEach((element) => (condition(element) ? satisfied : unsatisfied).push(element));

    return { satisfied, unsatisfied };
}