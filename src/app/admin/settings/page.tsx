import CreateSettings from "@/components/Settings/Create";
import DeleteSettings from "@/components/Settings/Delete";
import { useGetAllSettings } from "@/utils/hooks/useSettings";

export default async function AdminSettingsPage() {

  const settings = await useGetAllSettings()

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </header>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-3 font-medium">Add / Update</h2>
        <CreateSettings />
      </section>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-3 font-medium">Existing</h2>
        {settings.length === 0 ? (
          <p className="text-sm text-neutral-600">No settings yet.</p>
        ) : (
          <ul className="divide-y">
            {settings.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{s.key}</p>
                  <pre className="mt-1 max-w-full overflow-auto rounded bg-neutral-50 p-2 text-sm text-neutral-800">{s.value}</pre>
                </div>
                <DeleteSettings id={s.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
