import { getSessionUser } from "@/lib/auth";
import { connectDB, UserModel } from "@repo/db";
import ProfileClient from "./ProfileClient";
import { Card } from "@repo/ui";

interface IUser {
  email: string;
  name: string;
}

export default async function ProfilePage() {
  const u = await getSessionUser();
  if (!u) return null;

  await connectDB();
  const userDoc = await UserModel.findOne({ _id: u.uid }).lean<IUser | null>();

  if (!userDoc) {
    return (
      <div className="p-6">
        <p className="text-red-500">User not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4 dark:bg-gray-900/60 dark:border-gray-800">
          <h2 className="font-semibold mb-3">Account</h2>
          <div className="text-sm">
            <p className="text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium">{userDoc.email}</p>
          </div>
        </Card>

        <ProfileClient name={userDoc.name} />
      </div>
    </div>
  );
}
