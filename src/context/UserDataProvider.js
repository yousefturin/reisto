/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




import React, { useState, useEffect, createContext, memo } from 'react';
import { firebase, db } from '../firebase';

// Create a context for the user data
export const UserContext = createContext(null);

const UserProviderComponent = ({ children }) => {
    const [userData, setUserData] = useState({ username: '', profile_picture: '', bio: '', displayed_name: '', link: '' });

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            // Fetch the data once
            const unsubscribe = db.collection('users').where('owner_uid', '==', user.uid).limit(1).onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => doc.data())[0];
                setUserData({
                    username: data.username,
                    profile_picture: data.profile_picture,
                    displayed_name: data.displayed_name,
                    bio: data.bio,
                    link: data.link,
                    owner_uid: data.owner_uid,
                    email: data.email
                });
            }, error => {
                console.error("Error listening to document:", error);
                return () => { };
            });
            return () => {
                console.log("Unsubscribed from user data.")
                unsubscribe();
            }  // Unsubscribe on unmount
        } else {
            console.error("No authenticated user found.");
            return () => { };
        }
    }, []);

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
};

// Wrap UserProviderComponent with React.memo
export const UserProvider = memo(UserProviderComponent);
