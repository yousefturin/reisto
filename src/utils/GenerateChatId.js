/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




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