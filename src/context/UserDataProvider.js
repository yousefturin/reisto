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
                });
            });
            return () => unsubscribe(); // Unsubscribe on unmount
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
