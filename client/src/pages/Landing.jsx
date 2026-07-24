

export default function LandingPage({ login }) {
    return (
        <>
            <h1>Placement Prep</h1>

            <button onClick={login}>
                Login with Google
            </button>
        </>
    );
}