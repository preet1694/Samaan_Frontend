/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 * @property {'sender' | 'carrier'} role
 * @property {Object} wallet
 * @property {number} wallet.balance
 * @property {number} wallet.blocked
 */

/**
 * @typedef {Object} Trip
 * @property {string} id
 * @property {string} carrierId
 * @property {string} source
 * @property {string} destination
 * @property {string} travelDate
 * @property {number} capacity
 * @property {number} price
 * @property {'available' | 'booked' | 'completed'} status
 */

/**
 * @typedef {Object} Package
 * @property {string} id
 * @property {string} senderId
 * @property {string} [carrierId]
 * @property {string} source
 * @property {string} destination
 * @property {number} weight
 * @property {string} description
 * @property {'pending' | 'assigned' | 'in-transit' | 'delivered'} status
 * @property {string} [pickupLocation]
 * @property {string} [dropLocation]
 */