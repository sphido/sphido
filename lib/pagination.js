'use strict';

/**
 * Return pagination array
 * [1, 2, 3, 4, 5]
 * @param {number} total
 * @param {number} perpage
 * @returns {number[]}
 */
module.exports = (total, perpage) => [...new Array(Math.ceil(total / perpage)).keys()].map(i => ++i);
