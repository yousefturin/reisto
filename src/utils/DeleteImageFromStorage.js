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




import { firebase } from "../firebase";

/**
 * Deletes an image from Firebase Storage.
 * @param {string} imageUrl - The URL of the image to be deleted.
 * @returns {Promise<{ success: boolean, error: string }>} - A promise that resolves to an object with a success property indicating whether the image is deleted successfully, and an error property containing the error message if there is an error.
 */
export default DeleteImageFromStorage = async (imageUrl) => {
    try {
        // Convert the image URL to a reference
        const storageRef = firebase.storage().refFromURL(imageUrl);

        // Delete the image from storage
        await storageRef.delete();

        console.log('Image deleted successfully');
        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, error: error.message };
    }
}
