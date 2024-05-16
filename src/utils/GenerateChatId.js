/**
 * Generates a chat room ID based on two user IDs.
 *
 * @param {string} userId1 - The ID of the first user.
 * @param {string} userId2 - The ID of the second user.
 * @returns {string} The generated chat room ID.
 */
export const GenerateRoomId = (userId1, userId2) => {
    const sortedIds = [userId2, userId1].sort();
    return roomId = sortedIds.join('-');
}