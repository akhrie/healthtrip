import React, { useEffect, useState } from 'react';

function Userdata() {
    const [myuserdata, setMyuserdata] = useState([]);

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = () => {
        fetch('http://localhost:4040/user')
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setMyuserdata(data);
                } else {
                    console.error('Invalid userdata format:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching userdata:', error);
            });
    };

    const toggleUserStatus = (userId, currentStatus) => {
        const newStatus = !currentStatus; // Toggle the status
        fetch(`http://localhost:4040/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        })
            .then((response) => response.json())
            .then(() => {
                // Update the user's status in the local state
                setMyuserdata((prevUserData) =>
                    prevUserData.map((user) =>
                        user._id === userId ? { ...user, status: newStatus } : user
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating user status:', error);
            });
    };

    const blockUser = (userId) => {
        toggleUserStatus(userId, true); // Set status to true (blocked)
    };

    const unblockUser = (userId) => {
        toggleUserStatus(userId, false); // Set status to false (unblocked)
    };

    const deleteUser = (userId) => {
        fetch(`http://localhost:4040/user/${userId}`, {
            method: 'DELETE',
        })
            .then(() => {
                // Remove the deleted user from the local state
                setMyuserdata((prevUserData) =>
                    prevUserData.filter((user) => user._id !== userId)
                );
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
    };

    return (
        <div>
            <h1>List of Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Create Date</th>
                        <th>Actions</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {myuserdata.map((user) => (
                        <tr key={user._id} className={user.status === 0 ? 'blocked-user' : ''}>
                            <td>{user.userName}</td>
                            <td>{user.city}</td>
                            <td>{user.country}</td>
                            <td>{user.createdDate}</td>
                            <td>
                                {user.status ? (
                                    <button onClick={() => blockUser(user._id)}>Block</button>
                                ) : (
                                    <button onClick={() => unblockUser(user._id)}>Unblock</button>
                                )}
                            </td>
                            <td>
                                <button onClick={() => deleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Userdata;
