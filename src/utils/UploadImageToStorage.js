import { firebase } from "../firebase";

/**
 * Uploads an image to Firebase Storage and returns the download URL of the uploaded image.
 * @param {string} uri - The URI of the image to be uploaded.
 * @returns {Promise<string|null>} - A promise that resolves to the download URL of the uploaded image, or null if there was an error.
 */
export default UploadImageToStorage = async (uri) => {
    try {
        // Fetch the blob directly from the uri
        const response = await fetch(uri);
        const blob = await response.blob();

        // Generate a unique filename for the image
        const filename = `${Date.now()}-${Math.floor(Math.random() * 1000000)}.jpg`;

        // Upload the image to Firebase Storage
        const storageRef = firebase.storage().ref().child(filename);
        await storageRef.put(blob);

        // Get the download URL of the uploaded image
        const downloadURL = await storageRef.getDownloadURL();

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}
