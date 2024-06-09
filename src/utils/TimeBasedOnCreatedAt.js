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
 * Calculates the creation time based on the provided time object.
 * @param {Object} timeObject - The time object containing the seconds and nanoseconds.
 * @returns {string} - The formatted time string in the format 'hh:mm AM/PM'.
 */
export const CalculateCreateAt = (timeObject) => {
    const { seconds, nanoseconds } = timeObject;
    const date = new Date(seconds * 1000 + nanoseconds / 1000000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};