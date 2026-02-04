import useAuth from "../../hooks/useAuth";

export default function Profile() {
    const { deleteProfile, logOut, user } = useAuth();

    console.log(user)

    return (
        <>
            <h1>Profile page</h1>
            <h3>Currently signed in:</h3>
            <p>{user?.email}</p>
            <button onClick={logOut}>Sign Out</button>
            <button onClick={deleteProfile}>Delete user</button>
        </>
    )
};