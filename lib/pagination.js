'use strict';

/**
 * Return pagination array
 * [1, 2, 3, 4, 5]
 * @returns {number[]}
 */
module.exports = (total, perpage) => [...Array(Math.ceil(total / perpage)).keys()].map(i => ++i);