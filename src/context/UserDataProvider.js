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
