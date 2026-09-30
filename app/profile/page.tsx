import { pageUser } from "@/lib/auth";
import { dateLabel } from "@/lib/utils";
import { PageHeading, Badge } from "@/components/ui";
import { ProfileForm } from "@/components/profile-form";
export const metadata = { title: "Your profile" };
export default async function Profile() {
  const user = await pageUser("/profile");
  return (
    <div className="container section narrow">
      <PageHeading
        eyebrow="YOUR TRAVELMATE ACCOUNT"
        title="A little about you."
        description="Keep your contact details ready for your next journey."
      />
      <div className="panel profile-panel">
        <div className="profile-header">
          <span className="avatar">{user.name[0]}</span>
          <div>
            <h2>{user.name}</h2>
            <p>
              Joined {dateLabel(user.createdAt)} · <Badge>{user.role}</Badge>
            </p>
          </div>
        </div>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
