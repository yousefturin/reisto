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
 * Uploads an image to Firebase Storage and returns the download URL of the uploaded image.
 * @param {string} uri - The URI of the image to be uploaded.
 * @returns {Promise<string|null>} - A promise that resolves to the download URL of the uploaded image, or null if there was an error.
 */
export default UploadImageToStorage = async (uri, PathParent) => {
    try {
        // Fetch the blob directly from the uri
        const response = await fetch(uri);
        const blob = await response.blob();

        // Generate a unique filename for the image
        const filename = `${Date.now()}-${Math.floor(Math.random() * 1000000)}.jpg`;
        console.log(PathParent +  filename);
        // Upload the image to Firebase Storage
        const storageRef = firebase.storage().ref().child(PathParent +  filename);
        await storageRef.put(blob);

        // Get the download URL of the uploaded image
        const downloadURL = await storageRef.getDownloadURL();

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}
