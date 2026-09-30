import { pageUser } from "@/lib/auth";
import { User, Booking } from "@/models";
import { PageHeading, Badge } from "@/components/ui";
import { dateLabel } from "@/lib/utils";
export default async function Users() {
  await pageUser("/admin/users", true);
  const [users, counts] = await Promise.all([
    User.find()
      .select("name email phone role createdAt")
      .sort({ createdAt: -1 })
      .lean(),
    Booking.aggregate<{ _id: { toString(): string }; count: number }>([
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ]),
  ]);
  return (
    <>
      <PageHeading
        title="Your traveler community."
        description="Account and booking information. Passwords and authentication secrets are never displayed."
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>ROLE</th>
              <th>BOOKINGS</th>
              <th>JOINED</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id.toString()}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <Badge>{u.role}</Badge>
                </td>
                <td>
                  {counts.find((c) => c._id.toString() === u._id.toString())
                    ?.count || 0}
                </td>
                <td>{dateLabel(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
