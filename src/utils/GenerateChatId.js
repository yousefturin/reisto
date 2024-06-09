/*
 * Copyright (C) 2024 Yusef Rayyan
 *
 * This file is part of REISTO.
 *
 * REISTO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * REISTO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with REISTO. If not, see <https://www.gnu.org/licenses/>.
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