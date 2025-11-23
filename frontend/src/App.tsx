import { useState } from "react";
import { Button } from "./components/ui/button";
import AddInvestorForm from "./AddInvestor";
import Chat from "./pages/Chat";
import { Plus, MessageCircle } from "lucide-react";

type Page = "add-investor" | "chat";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("add-investor");

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1A2B4A]">InvestIQ</h1>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentPage("add-investor")}
              variant={currentPage === "add-investor" ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                currentPage === "add-investor"
                  ? "bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white"
                  : "text-[#717182] border-[#2F80ED]"
              }`}
            >
              <Plus className="h-4 w-4" />
              הוסף משקיע
            </Button>
            
            <Button
              onClick={() => setCurrentPage("chat")}
              variant={currentPage === "chat" ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                currentPage === "chat"
                  ? "bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white"
                  : "text-[#717182] border-[#2F80ED]"
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              AI Chat
            </Button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {currentPage === "add-investor" && <AddInvestorForm />}
        {currentPage === "chat" && <Chat />}
      </main>
    </div>
  );
}