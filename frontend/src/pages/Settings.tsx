import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const { user, loading, updateProfile, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  


  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile(name.trim());
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Password is required to delete account");
      return;
    }
  
    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      // Clear local state
      setDeletePassword("");
      setShowDeleteConfirm(false);
      // Navigate after a short delay to ensure state is cleared
      setTimeout(() => {
        navigate("/auth/signup");
      }, 500);
    } catch (error: any) {
      // Error is already handled by deleteAccount function
      console.error("Delete account error:", error);
    } finally {
      setDeleting(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      // After changing password, user is signed out
      navigate("/auth/signin");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading your settings...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-2xl font-semibold">You are not signed in</h1>
        <button
          onClick={() => navigate("/auth/signin")}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-3xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your profile information and change your password.
          </p>
        </div>

        {/* Profile section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-gray-400">
            Update your basic account details.
          </p>

          <form onSubmit={handleProfileSubmit} className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-800 text-sm text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
            >
              {savingProfile && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Save changes
            </button>
          </form>
        </section>

        {/* Password section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Change password</h2>
          <p className="text-sm text-gray-400">
            Enter your current password and a new password.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your current password"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
            >
              {changingPassword && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Change password
            </button>
          </form>
        </section>

        {/* Danger zone */}
<section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
  <div className="flex items-center gap-2 text-red-400">
    <AlertTriangle className="w-5 h-5" />
    <h2 className="text-xl font-semibold">Danger zone</h2>
  </div>

  <p className="text-sm text-gray-400">
    Deleting your account is permanent and cannot be undone.
  </p>

  {!showDeleteConfirm ? (
    <button
      onClick={() => setShowDeleteConfirm(true)}
      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium"
    >
      Delete account
    </button>
  ) : (
    <div className="space-y-4 bg-black/40 p-4 rounded-xl border border-red-500/20">
      <p className="text-sm text-gray-300">
        You are about to delete the account for{" "}
        <span className="font-semibold text-white">{user.name}</span>.
        This action is <span className="text-red-400 font-semibold">permanent</span>.
      </p>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          Confirm your password
        </label>
        <input
          type="password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter your password"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-sm font-medium"
        >
          {deleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Permanently delete
        </button>

        <button
          onClick={() => {
            setShowDeleteConfirm(false);
            setDeletePassword("");
          }}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</section>

      </div>
    </div>
  );
};

export default Settings;