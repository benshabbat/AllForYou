import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { store } from "./store/index.js";
import { ToastProvider, ToastContainer } from "./components/common";
import AppContent from "./components/AppContent"; // רכיב מופרד

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router>
            <AppContent />
            <ToastContainer />
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
