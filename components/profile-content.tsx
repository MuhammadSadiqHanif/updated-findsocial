"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Edit, Trash2, Info, X, Check } from "lucide-react"

export default function ProfileContent() {
  const [formData, setFormData] = useState({
    firstName: "Olivia",
    lastName: "Rhye",
    jobTitle: "Manager",
    phone: "+1 (555) 123-5413",
    location: "United States",
    timeZone: "US/Arizona - 7:00",
    email: "olivia@example.com",
  })

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteStep, setDeleteStep] = useState(1) // 1 = feedback, 2 = confirmation, 3 = success
  const [feedback, setFeedback] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
    setDeleteStep(1)
    setFeedback("")
  }

  const handleSkipContinue = () => {
    setDeleteStep(2)
  }

  const handleSubmitContinue = () => {
    setDeleteStep(2)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteStep(1)
    setFeedback("")
  }

  const handleConfirmDelete = () => {
    setDeleteStep(3)
  }

  const handleStartFresh = () => {
    setShowDeleteModal(false)
    setDeleteStep(1)
    setFeedback("")
    // Could redirect to login page or home page here
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#101828]">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-[#344054]">
                  First name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="h-11 border-[#d0d5dd] focus:border-[#7f56d9] focus:ring-[#7f56d9]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-[#344054]">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="h-11 border-[#d0d5dd] focus:border-[#7f56d9] focus:ring-[#7f56d9]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-sm font-medium text-[#344054]">
                  Job title
                </Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  className="h-11 border-[#d0d5dd] focus:border-[#7f56d9] focus:ring-[#7f56d9]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-[#344054]">
                  Phone
                </Label>
                <div className="flex">
                  <Select defaultValue="US">
                    <SelectTrigger className="w-20 h-11 border-[#d0d5dd] border-r-0 rounded-r-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">US</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="CA">CA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-11 border-[#d0d5dd] focus:border-[#7f56d9] focus:ring-[#7f56d9] rounded-l-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#344054]">Location</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger className="h-11 border-[#d0d5dd] focus:border-[#7f56d9] focus:ring-[#7f56d9]">
                    <SelectValue />
                    <Info className="w-4 h-4 text-[#667085] ml-auto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#344054]">Time zone</Label>
                <Select value={formData.timeZone} onValueChange={(value) => handleInputChange("timeZone", value)}>
                  <SelectTrigger className="h-11 border-[#d0d5dd] focus:border-[#7f56d9] focus:ring-[#7f56d9]">
                    <SelectValue />
                    <Info className="w-4 h-4 text-[#667085] ml-auto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US/Arizona - 7:00">US/Arizona - 7:00</SelectItem>
                    <SelectItem value="US/Pacific - 8:00">US/Pacific - 8:00</SelectItem>
                    <SelectItem value="US/Eastern - 5:00">US/Eastern - 5:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Login Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#101828]">Login Information</h2>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#344054]">
                Email
              </Label>
              <div className="flex gap-3">
                <Input
                  id="email"
                  value={formData.email}
                  readOnly
                  className="h-11 border-[#d0d5dd] bg-[#f9fafb] text-[#667085] flex-1"
                />
                <Button
                  variant="outline"
                  className="h-11 px-4 border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] bg-transparent"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#344054]">
                Password
              </Label>
              <div className="flex gap-3">
                <Input
                  id="password"
                  type="password"
                  value="••••••••••••••••••"
                  readOnly
                  className="h-11 border-[#d0d5dd] bg-[#f9fafb] text-[#667085] flex-1"
                />
                <Button
                  variant="outline"
                  className="h-11 px-4 border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] bg-transparent"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Card & Delete Account */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-[#f9f5ff] to-[#e9d7fe] rounded-lg p-8 text-center relative">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src="/professional-woman-avatar.png" alt="Olivia Rhye" />
                    <AvatarFallback className="text-xl font-semibold bg-[#7f56d9] text-white">OR</AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#7f56d9] hover:bg-[#6941c6] p-0"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </Button>
                </div>
                <h3 className="text-xl font-semibold text-[#101828] mb-1">Olivia Rhye</h3>
                <p className="text-[#667085]">olivia@example.com</p>
              </div>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#101828]">Delete Account</h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              Permanently remove your profile, data, and activity from the app. This action cannot be undone. Once
              deleted, you'll lose access to all your saved information and history.
            </p>
            <Button
              variant="outline"
              className="w-full h-11 border-[#fecdca] text-[#b42318] hover:bg-[#fef3f2] hover:border-[#fecdca] bg-transparent"
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-[#101828]">Delete My Account</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={handleCancelDelete}
              >
                <X className="h-4 w-4 text-[#667085]" />
              </Button>
            </div>
          </DialogHeader>

          {deleteStep < 3 && (
            <div className="px-6 pb-2">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      deleteStep >= 1 ? "bg-[#7f56d9] text-white" : "bg-[#f2f4f7] text-[#667085]"
                    }`}
                  >
                    {deleteStep > 1 ? "✓" : "1"}
                  </div>
                  <span className="ml-3 text-sm font-medium text-[#7f56d9]">Confirmation</span>
                </div>
                <div className="flex-1 mx-4 h-px bg-[#e4e7ec]"></div>
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      deleteStep >= 2 ? "bg-[#7f56d9] text-white" : "bg-[#f2f4f7] text-[#667085]"
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-3 text-sm font-medium text-[#667085]">Feedback</span>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 pb-6">
            {deleteStep === 1 ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#101828] mb-3">Before You Go...</h3>
                  <p className="text-sm text-[#667085] mb-4">
                    Could you share why you're leaving? Your feedback helps us improve and serve our users better.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#344054]">Tell us your reason (optional)</Label>
                    <Textarea
                      placeholder="Describe your list's purpose."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[120px] border-[#d0d5dd] focus:border-[#7f56d9] focus:ring-[#7f56d9] resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] bg-transparent"
                    onClick={handleSkipContinue}
                  >
                    Skip & Continue
                  </Button>
                  <Button
                    className="flex-1 h-11 bg-[#7f56d9] hover:bg-[#6941c6] text-white"
                    onClick={handleSubmitContinue}
                  >
                    Submit & Continue
                  </Button>
                </div>
              </div>
            ) : deleteStep === 2 ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#101828] mb-3">Are You Sure You Want to Leave?</h3>
                  <p className="text-sm text-[#667085] mb-4">
                    Your account, profile, and all related data will be permanently deleted. This means you'll lose
                    access to your saved information, history, and any ongoing activity.
                  </p>
                  <p className="text-sm text-[#667085]">
                    We'd be sad to see you go—once deleted, this can't be undone.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] bg-transparent"
                    onClick={handleCancelDelete}
                  >
                    Cancel & Keep My Account
                  </Button>
                  <Button
                    className="flex-1 h-11 bg-[#7f56d9] hover:bg-[#6941c6] text-white"
                    onClick={handleConfirmDelete}
                  >
                    Yes, Delete My Account
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-[#ecfdf3] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-[#067647]" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#101828]">Your Account Has Been Deleted</h3>

                  <div className="space-y-4 text-sm text-[#667085] leading-relaxed">
                    <p>
                      We've removed your profile and all related data from our system. Thank you for being part of our
                      journey—we truly appreciated having you here.
                    </p>

                    <p>If you ever decide to return, we'll be here to welcome you back with open arms.</p>

                    <p>Wishing you the very best in your next chapter. Take care and keep smiling.</p>
                  </div>
                </div>

                <Button className="w-full h-11 bg-[#7f56d9] hover:bg-[#6941c6] text-white" onClick={handleStartFresh}>
                  Start Fresh
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
