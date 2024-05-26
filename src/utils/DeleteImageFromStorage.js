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
