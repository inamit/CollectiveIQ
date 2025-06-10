import { PostsProvider } from "./context/postsContext";
import {Outlet} from "react-router";
import NavBar from "./components/NavBar/NavBar.tsx";
import {ToastContainer} from "react-toastify";
import {UserProvider} from "./context/userContext.tsx";
import ChatComponent from "./components/Chat/ChatComponent.tsx"; // import this

function App() {
    const AUTO_CLOSE_TIME = 3000;

    return (
        <div className="App">
            <UserProvider>
                <PostsProvider>
                    <ToastContainer autoClose={AUTO_CLOSE_TIME} position="top-center" />
                    <NavBar />
                    <div className="appContainer">
                        <Outlet/>
                    </div>
                    <ChatComponent/>
                </PostsProvider>
            </UserProvider>
        </div>

    );
}
export default App;