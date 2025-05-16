import NavBar from "../components/NavBar/NavBar"

export default function LoginPage() {
    return (
        <>
        <NavBar />
        <form className="flex flex-col items-center my-20 mx-auto w-2xl p-5">
            <h1 className="text-4xl font-bold mb-6">Login</h1>
            <input
                type="text"
                placeholder="Username"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
            />
            <button className="bg-orange-500 text-white p-2 rounded hover:bg-orange-800 transition-colors w-full">
                Login
            </button>
            <p className="mt-4">
                Don't have an account?{" "}
                <a href="#" className="text-blue-500 hover:underline">
                    Register here
                </a>
            </p>
        </form>
        </>
    )
}