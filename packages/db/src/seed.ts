import "dotenv/config";
import { connectDB } from "./connect";
import { UserModel } from "./models/User";
import { TaskModel } from "./models/Task";


async function run() {
await connectDB();
const user = await UserModel.findOneAndUpdate(
{ email: "demo@pracsphere.dev" },
{ name: "Demo User", email: "demo@pracsphere.dev" },
{ upsert: true, new: true }
);
await TaskModel.create({ title: "First shared‑DB task", userId: user._id });
console.log("Seeded ✔");
process.exit(0);
}
run().catch((e) => { console.error(e); process.exit(1); });