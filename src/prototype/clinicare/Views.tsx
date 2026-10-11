import { Card, Badge, Button } from "../shared";
import type { Appointment } from "./data";
export function Schedule({
  rows,
  label,
  staff,
  onSelect,
}: {
  rows: Appointment[];
  label: (id: string) => string;
  staff: (id: string) => string;
  onSelect: (a: Appointment) => void;
}) {
  return (
    <div className="product-stack">
      {["Room 1", "Room 2", "Room 3"].map((room) => (
        <Card key={room} title={room}>
          {rows
            .filter((a) => a.room === room)
            .map((a) => (
              <div
                className="product-record"
                key={a.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr",
                  gap: 12,
                }}
              >
                <strong>
                  {a.startAt.slice(11)}
                  <small style={{ display: "block" }}>
                    {a.endAt.slice(11)}
                  </small>
                </strong>
                <div>
                  <Button variant="secondary" onClick={() => onSelect(a)}>
                    {label(a.patientId)}
                  </Button>
                  <p>
                    {staff(a.clinicianId)} · <Badge>{a.status}</Badge>
                  </p>
                </div>
              </div>
            ))}
          {!rows.some((a) => a.room === room) && (
            <p>No appointments in this room.</p>
          )}
        </Card>
      ))}
    </div>
  );
}
