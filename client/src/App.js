import { GoogleOAuthProvider } from "@react-oauth/google";

import Messenger from "./components/Messenger";
import AccountProvider from "./context/AccountProvider";

function App() {
  const clientId='985435626169-k5aai34u3s1rhrtskk7eb836s0v43scv.apps.googleusercontent.com';
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AccountProvider>
         <Messenger />
      </AccountProvider>
      
    </GoogleOAuthProvider>
  );
}

export default App;
