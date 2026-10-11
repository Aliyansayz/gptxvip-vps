import { useEffect, useState } from "react";
import {
  Shell,
  useDemo,
  Card,
  Kpis,
  Select,
  Table,
  Dialog,
  Field,
  Button,
  Badge,
  csv,
  Notice,
  Empty,
  uid,
} from "../shared";
import { validate, seed, type Member, type Preferences } from "./data";
import { memberError, invitationError, onboarding } from "./formulas";
import { appendAudit } from "./actions";
import { Onboarding } from "./Views";
export default function App() {
  const { state, setState, reset } = useDemo("hq-admin", seed, validate);
  const [edit, setEdit] = useState<Member | null>(null);
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [settings, setSettings] = useState<Preferences | null>(null);
  const update = (patch: Partial<typeof state>) =>
    setState((s) => ({ ...s, ...patch }));
  const ws = state.workspaces.find(
    (w) => w.id === state.preferences.workspaceId,
  )!;
  const members = state.members.filter((m) => m.workspaceId === ws.id);
  const invitations = state.invitations.filter((i) => i.workspaceId === ws.id);
  const notifications = state.notifications.filter(
    (n) => n.workspaceId === ws.id,
  );
  const audit = state.audit.filter((a) => a.workspaceId === ws.id);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const change = () => setSystemDark(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const appearance =
    state.preferences.theme === "System"
      ? systemDark
        ? "dark"
        : "light"
      : state.preferences.theme === "Dark"
        ? "dark"
        : "light";
  const auditEntry = (s: typeof state, action: string, targetId: string) =>
    appendAudit(s, ws.id, action, targetId);
  return (
    <Shell
      slug="hq-admin"
      title="HQ Admin"
      subtitle="People, workspaces and everyday operations."
      accent="#6d54b5"
      theme={appearance}
      onThemeChange={(theme) =>
        setState((s) => ({
          ...s,
          preferences: {
            ...s.preferences,
            theme: theme === "dark" ? "Dark" : "Light",
          },
        }))
      }
      tabs={[
        "Overview",
        "Members / Roles",
        "Workspaces",
        "Notifications",
        "Settings / Onboarding",
      ]}
      view={state.view}
      onView={(v) => update({ view: v })}
      onReset={() => {
        reset();
        setEdit(null);
        setInvite(false);
        setSettings(null);
      }}
      actions={
        state.loggedIn && (
          <Button
            variant="secondary"
            onClick={() => {
              update({ loggedIn: false });
              setEdit(null);
              setInvite(false);
              setSettings(null);
            }}
          >
            Demo sign out
          </Button>
        )
      }
    >
      {!state.loggedIn ? (
        <Card title="Welcome back to HQ">
          <p>
            This is a local demo session. There is no backend authentication or
            email service.
          </p>
          <Button onClick={() => update({ loggedIn: true })}>
            Sign in as sample account
          </Button>
        </Card>
      ) : (
        <>
          <div className="product-filters">
            <Select
              label="Current workspace"
              value={ws.id}
              onChange={(workspaceId) => {
                setState((s) => ({
                  ...s,
                  preferences: { ...s.preferences, workspaceId },
                }));
                setEdit(null);
                setInvite(false);
                setSettings(null);
                setNotice("");
              }}
              options={state.workspaces.map((w) => ({
                value: w.id,
                label: w.name,
              }))}
            />
            <span className="product-chip">
              Hello, {state.preferences.displayName}
            </span>
          </div>
          {notice && <Notice>{notice}</Notice>}
          {state.view === "Overview" && (
            <>
              <Kpis
                items={[
                  {
                    label: "Active members",
                    value: members.filter((m) => m.status === "active").length,
                  },
                  {
                    label: "Pending invitations",
                    value: invitations.filter((i) => i.status === "pending")
                      .length,
                  },
                  {
                    label: "Unread notifications",
                    value: notifications.filter((n) => !n.read).length,
                  },
                  {
                    label: "Setup progress",
                    value: `${onboarding(state).filter((i) => i.done).length}/4`,
                  },
                ]}
              />
              <div className="product-grid">
                <Onboarding items={onboarding(state)} />
                <Card title="Operational audit">
                  {audit
                    .slice()
                    .reverse()
                    .map((a) => (
                      <div className="product-record" key={a.id}>
                        <strong>{a.action}</strong>
                        <small>
                          {a.at} · {a.targetId}
                        </small>
                      </div>
                    ))}
                  {!audit.length && (
                    <Empty>
                      No operations have been recorded in this workspace.
                    </Empty>
                  )}
                </Card>
              </div>
              <Card title="Workspace status">
                {state.service === "failed" ? (
                  <>
                    <Notice>
                      Workspace service is unavailable. Retry to restore the
                      service.
                    </Notice>
                    <Button onClick={() => update({ service: "ready" })}>
                      Retry health check
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge status="success">Workspace service ready</Badge>

                    <Button
                      variant="secondary"
                      onClick={() => update({ service: "failed" })}
                    >
                      Simulate health error
                    </Button>
                  </>
                )}
              </Card>
            </>
          )}
          {state.view === "Members / Roles" && (
            <div className="product-stack">
              <Card
                title={`${ws.name} members`}
                aside={
                  <Button
                    onClick={() => {
                      setInvite(true);
                      setEmail("");
                      setError("");
                    }}
                  >
                    Create demo invitation
                  </Button>
                }
              >
                <Table
                  caption="Members in the selected workspace"
                  heads={["Member", "Email", "Role", "Status", "Edit"]}
                >
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.role}</td>
                      <td>
                        <Badge>{m.status}</Badge>
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEdit({ ...m });
                            setError("");
                          }}
                        >
                          Edit member
                        </Button>
                      </td>
                    </tr>
                  ))}
                </Table>
              </Card>
              <Card title="Invitation queue">
                <p>These are local records; no email is sent.</p>
                {invitations.map((i) => (
                  <div className="product-record" key={i.id}>
                    <strong>{i.email}</strong>
                    <p>
                      {i.role} · {i.status}
                    </p>
                    {i.status === "pending" && (
                      <Button
                        variant="secondary"
                        onClick={() =>
                          setState((s) =>
                            auditEntry(
                              {
                                ...s,
                                invitations: s.invitations.map((r) =>
                                  r.id === i.id
                                    ? { ...r, status: "revoked" }
                                    : r,
                                ),
                              },
                              "Invitation revoked",
                              i.id,
                            ),
                          )
                        }
                      >
                        Revoke invitation
                      </Button>
                    )}
                  </div>
                ))}
                {!invitations.length && (
                  <Empty>
                    No invitations yet. Create a demo invitation to grow this
                    workspace.
                  </Empty>
                )}
              </Card>
            </div>
          )}
          {state.view === "Workspaces" && (
            <div className="product-grid equal">
              {state.workspaces.map((w) => (
                <Card key={w.id} title={w.name}>
                  <p>/{w.slug}</p>
                  <p>
                    {state.members.filter((m) => m.workspaceId === w.id).length}{" "}
                    members ·{" "}
                    {
                      state.invitations.filter(
                        (i) => i.workspaceId === w.id && i.status === "pending",
                      ).length
                    }{" "}
                    pending invitations
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        preferences: { ...s.preferences, workspaceId: w.id },
                      }))
                    }
                  >
                    {w.id === ws.id ? "Current workspace" : "Switch workspace"}
                  </Button>
                </Card>
              ))}
            </div>
          )}
          {state.view === "Notifications" && (
            <Card
              title="Workspace inbox"
              aside={
                <Button
                  variant="secondary"
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      notifications: s.notifications.filter(
                        (n) => n.workspaceId !== ws.id || !n.read,
                      ),
                    }))
                  }
                >
                  Clear read
                </Button>
              }
            >
              {notifications.map((n) => (
                <div className="product-record" key={n.id}>
                  <strong>
                    {n.title} · {n.read ? "Read" : "Unread"}
                  </strong>
                  <p>{n.body}</p>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        notifications: s.notifications.map((r) =>
                          r.id === n.id ? { ...r, read: !r.read } : r,
                        ),
                      }))
                    }
                  >
                    Mark {n.read ? "unread" : "read"}
                  </Button>
                </div>
              ))}
              {!notifications.length && (
                <Empty>Your workspace inbox is clear.</Empty>
              )}
            </Card>
          )}
          {state.view === "Settings / Onboarding" && (
            <div className="product-grid equal">
              <Onboarding items={onboarding(state)} />
              <Card title="Local preferences">
                <p>Display name: {state.preferences.displayName}</p>
                <p>Preferred appearance: {state.preferences.theme}</p>
                <p>
                  System follows your device appearance. Light and Dark apply
                  immediately; the header switch saves the same preference.
                </p>
                <Button
                  onClick={() => {
                    setSettings({ ...state.preferences });
                    setError("");
                  }}
                >
                  Edit preferences
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    csv(
                      "hq-workspace-audit",
                      audit.map((a) => ({ ...a })),
                    )
                  }
                >
                  Export workspace audit
                </Button>
              </Card>
            </div>
          )}
          {edit && (
            <Dialog title={`Edit ${edit.name}`} onClose={() => setEdit(null)}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const original = state.members.find((m) => m.id === edit.id)!;
                  const err = memberError(state.members, original, edit);
                  if (err) {
                    setError(err);
                    return;
                  }
                  setState((s) =>
                    auditEntry(
                      {
                        ...s,
                        members: s.members.map((m) =>
                          m.id === edit.id ? edit : m,
                        ),
                      },
                      "Member role/status updated",
                      edit.id,
                    ),
                  );
                  setEdit(null);
                  setNotice("Member settings saved.");
                }}
              >
                <Select
                  label="Role"
                  value={edit.role}
                  onChange={(v) =>
                    setEdit({ ...edit, role: v as Member["role"] })
                  }
                  options={["admin", "editor", "viewer"]}
                />
                <Select
                  label="Status"
                  value={edit.status}
                  onChange={(v) =>
                    setEdit({ ...edit, status: v as Member["status"] })
                  }
                  options={["active", "suspended"]}
                />
                {error && (
                  <p role="alert" className="product-error">
                    {error}
                  </p>
                )}
                <Button type="submit">Save member</Button>
              </form>
            </Dialog>
          )}
          {invite && (
            <Dialog
              title="Create local invitation"
              onClose={() => setInvite(false)}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const address = email.trim().toLowerCase();
                  const err = invitationError(state, address, ws.id);
                  if (err) {
                    setError(err);
                    return;
                  }
                  const id = uid(state.invitations, "invitation");
                  setState((s) =>
                    auditEntry(
                      {
                        ...s,
                        invitations: [
                          ...s.invitations,
                          {
                            id,
                            email: address,
                            role,
                            workspaceId: ws.id,
                            status: "pending",
                          },
                        ],
                      },
                      "Demo invitation created",
                      id,
                    ),
                  );
                  setInvite(false);
                  setNotice(
                    "Pending demo invitation created; no email was sent.",
                  );
                }}
              >
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                />
                <Select
                  label="Role"
                  value={role}
                  onChange={setRole}
                  options={["admin", "editor", "viewer"]}
                />
                <Button type="submit">Create pending invitation</Button>
              </form>
            </Dialog>
          )}
          {settings && (
            <Dialog
              title="Workspace preferences"
              onClose={() => setSettings(null)}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!settings.displayName.trim()) {
                    setError("Display name is required.");
                    return;
                  }
                  update({
                    preferences: {
                      ...settings,
                      displayName: settings.displayName.trim(),
                    },
                  });
                  setSettings(null);
                  setNotice("Local preferences saved.");
                }}
              >
                <Field
                  label="Display name"
                  value={settings.displayName}
                  onChange={(e) =>
                    setSettings({ ...settings, displayName: e.target.value })
                  }
                  error={error}
                />
                <Select
                  label="Appearance preference"
                  value={settings.theme}
                  onChange={(theme) => setSettings({ ...settings, theme })}
                  options={["System", "Light", "Dark"]}
                />
                <Button type="submit">Save preferences</Button>
              </form>
            </Dialog>
          )}
        </>
      )}
    </Shell>
  );
}
