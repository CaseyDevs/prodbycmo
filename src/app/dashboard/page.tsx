import NavBar from "../components/NavBar/NavBar"

export default function DashboardPage() {

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100 text-black">
                <h1 className="text-4xl font-bold m-4">Dashboard</h1>
                <p className="text-lg">Welcome Admin!</p>
                <p className="text-lg">This is a placeholder page.</p>
            </div>
        </>
    )
}