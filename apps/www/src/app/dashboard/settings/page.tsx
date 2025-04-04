import { UpdateEmail } from "./update-email";
import { UpdatePassword } from "./update-password";
import { Avatar } from "~/components/avatar";
import { notNull } from "~/lib/utils";
import { getSession } from "~/server";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";

export default async function Page() {
  const { user } = await getSession();

  const isOauthUser = user.oauthId !== null;

  const settings = [
    {
      label: "Avatar",
      children: (
        <div className="absolute right-5 top-3">
          <Avatar src={user.avatarUrl} name={user.username} />
        </div>
      ),
      actionLabel: "Upload",
    },
    {
      label: "Username",
      children: (
        <Input
          type="text"
          disabled={true}
          placeholder="New Username"
          value={user.username}
          className="my-4"
        />
      ),
      description: !isOauthUser ? "Change your username" : "",
    },
    {
      label: "Email",
      children: (
        <UpdateEmail
          disabled={isOauthUser}
          actionLabel="Save"
          description={
            !isOauthUser ? "We will email you to verify the change" : ""
          }
          userEmail={user.email}
        />
      ),
      description:
        "Please enter the email address you want to use to log in with Ethern.",
      actionDescription: "We will email you to verify the change.",
      actionLabel: "Save",
    },
    user.password === null
      ? null
      : {
          label: "Password",
          children: (
            <UpdatePassword
              actionLabel="Save"
              description="Please use minimum of 8 characters for password."
            />
          ),
          description: "Change your password",
        },
    {
      label: "Delete Account",
      children: (
        <div className="flex justify-end">
          <Button variant="destructive">Delete Account</Button>
        </div>
      ),
      description:
        "Permanently remove your Personal Account and all of its contents from the Ethern platform. This action is not reversible, so please continue with caution.",
      actionLabel: "Delete",
    },
  ];

  return (
    <div className="pb-20">
      <h1 className="mb-2 text-3xl font-bold">Settings</h1>

      <div className="flex flex-col gap-y-10">
        {settings.filter(notNull).map((setting, index) => (
          <SettingsCard
            key={setting.label}
            description={setting.description}
            label={setting.label}
            index={index}
          >
            {setting.children}
          </SettingsCard>
        ))}
      </div>
    </div>
  );
}

interface SettingCardProps {
  label: string;
  children: any;
  description?: string;
  index: number;
}

function SettingsCard({
  label,
  children,
  description,
  index,
}: SettingCardProps) {
  return (
    <div className="relative flex flex-col rounded-lg border border-white/10 px-5 py-5 text-lg">
      <div>{label}</div>
      <p className="pr-10 text-sm text-white/50">{description}</p>
      {children}
    </div>
  );
}
