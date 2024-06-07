/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
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
