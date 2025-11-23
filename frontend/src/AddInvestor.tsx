import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Building2,
  FileText,
} from "lucide-react";

interface InvestorForm {
  fullName: string;
  idNumber: string;
  email: string;
  phone: string;
  investmentAmount: string;
  startDate: string;
  investorType: string;
  notes: string;
}

export default function App() {
  const [formData, setFormData] = useState<InvestorForm>({
    fullName: "",
    idNumber: "",
    email: "",
    phone: "",
    investmentAmount: "",
    startDate: "",
    investorType: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // המרת הנתונים לפורמט של הAPI
      const investorData = {
        full_name: formData.fullName,
        id_number: formData.idNumber,
        email: formData.email,
        phone: formData.phone,
        investment_amount: parseFloat(formData.investmentAmount),
        start_date: formData.startDate,
        investor_type: formData.investorType,
        notes: formData.notes || null,
      };

      // שליחה לAPI
      const response = await fetch("http://127.0.0.1:8000/api/investors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(investorData),
      });

      if (!response.ok) {
        throw new Error("Failed to save investor");
      }

      const result = await response.json();
      console.log("Success:", result);

      // הצלחה!
      setMessage("✅ Investor added successfully!");

      // איפוס הטופס
      handleCancel();

      // הסתרת ההודעה אחרי 3 שניות
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error adding investor. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      idNumber: "",
      email: "",
      phone: "",
      investmentAmount: "",
      startDate: "",
      investorType: "",
      notes: "",
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#F8F9FB" }}
    >
      {/* הודעת הצלחה/שגיאה */}
      {message && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-right ${
            message.includes("✅")
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message}
        </div>
      )}

      {/* Logo/App Title */}
      <div className="mb-8 text-center">
        <h1
          className="text-[#1A2B4A]"
          style={{ fontSize: "32px", fontWeight: "700" }}
        >
          InvestIQ
        </h1>
        <p className="text-[#717182] mt-1">Investor Management Portal</p>
      </div>

      {/* Form Card */}
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-[500px]"
        style={{ padding: "32px" }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-[#1A2B4A] mb-2"
            style={{ fontSize: "28px", fontWeight: "700" }}
          >
            ➕ Add New Investor
          </h2>
          <p className="text-[#717182]">
            Fill out the investor details to add them to the system.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-[#1A2B4A]">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#717182]" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
                required
                disabled={isLoading}
                className="pl-10 bg-[#F8F9FB] border-transparent hover:border-[#2F80ED]/20 focus:border-[#2F80ED] transition-colors"
              />
            </div>
          </div>

          {/* ID Number */}
          <div className="space-y-2">
            <Label htmlFor="idNumber" className="text-[#1A2B4A]">
              ID Number
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#717182]" />
              <Input
                id="idNumber"
                type="text"
                placeholder="Enter ID number"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idNumber: e.target.value,
                  })
                }
                required
                disabled={isLoading}
                className="pl-10 bg-[#F8F9FB] border-transparent hover:border-[#2F80ED]/20 focus:border-[#2F80ED] transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#1A2B4A]">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#717182]" />
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                required
                disabled={isLoading}
                className="pl-10 bg-[#F8F9FB] border-transparent hover:border-[#2F80ED]/20 focus:border-[#2F80ED] transition-colors"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#1A2B4A]">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#717182]" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                required
                disabled={isLoading}
                className="pl-10 bg-[#F8F9FB] border-transparent hover:border-[#2F80ED]/20 focus:border-[#2F80ED] transition-colors"
              />
            </div>
          </div>

          {/* Investment Amount */}
          <div className="space-y-2">
            <Label htmlFor="investmentAmount" className="text-[#1A2B4A]">
              Investment Amount (₪)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#717182]" />
              <Input
                id="investmentAmount"
                type="number"
                step="0.01"
                placeholder="Enter amount in shekels"
                value={formData.investmentAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    investmentAmount: e.target.value,
                  })
                }
                required
                disabled={isLoading}
                className="pl-10 bg-[#F8F9FB] border-transparent hover:border-[#2F80ED]/20 focus:border-[#2F80ED] transition-colors"
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-[#1A2B4A]">
              Start Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#717182]" />
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value,
                  })
                }
                required
                disabled={isLoading}
                className="pl-10 bg-[#F8F9FB] border-transparent hover:border-[#2F80ED]/20 focus:border-[#2F80ED] transition-colors"
              />
            </div>
          </div>

          {/* Investor Type */}
          <div className="space-y-2">
            <Label htmlFor="investorType" className="text-[#1A2B4A]">
              Investor Type
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#717182] z-10" />
              <Select
                value={formData.investorType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    investorType: value,
                  })
                }
                disabled={isLoading}
              >
                <SelectTrigger className="pl-10 bg-[#F8F9FB] border-transparent hover:border-[#2F80ED]/20 focus:border-[#2F80ED] transition-colors">
                  <SelectValue placeholder="Select investor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="institutional">Institutional</SelectItem>
                  <SelectItem value="angel">Angel</SelectItem>
                  <SelectItem value="fund">Fund</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#1A2B4A]">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or comments"
              value={formData.notes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes: e.target.value,
                })
              }
              disabled={isLoading}
              className="bg-[#F8F9FB] border-transparent hover:border-[#2F80ED]/20 focus:border-[#2F80ED] transition-colors min-h-[100px]"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, #2F80ED 0%, #56CCF2 100%)",
                borderRadius: "10px",
              }}
            >
              {isLoading ? "Saving..." : "Save Investor"}
            </Button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full text-[#717182] underline hover:text-[#2F80ED] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <p className="text-[#717182] mt-8">© 2025 InvestIQ. All rights reserved.</p>
    </div>
  );
}