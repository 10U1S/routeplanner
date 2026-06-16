"use client";

import { useState, useEffect, useRef } from "react";
import { Route } from "@/app/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type Hobby = "Wandern" | "Radfahren" | "Laufen" | "Klettern";

interface Profile {
  username: string;
  age: string;
  hobbies: Hobby[];
}

const DEFAULT_PROFILE: Profile = { username: "", age: "", hobbies: [] };
const STORAGE_KEY_PROFILE   = "routeplanner_profile";
const STORAGE_KEY_EARNED    = "routeplanner_completed";
const STORAGE_KEY_IMAGE     = "routeplanner_profileimage";
const STORAGE_KEY_BANNER    = "routeplanner_bannerimage";

// ─── Config ───────────────────────────────────────────────────────────────────

const HOBBY_CONFIG: Record<Hobby, { icon: string; border: string; bg: string; activeBg: string; activeText: string }> = {
  Wandern:   { icon: "🥾", border: "border-emerald-200", bg: "bg-emerald-50",  activeBg: "bg-emerald-500",  activeText: "text-white" },
  Radfahren: { icon: "🚴", border: "border-blue-200",    bg: "bg-blue-50",     activeBg: "bg-blue-500",     activeText: "text-white" },
  Laufen:    { icon: "🏃", border: "border-orange-200",  bg: "bg-orange-50",   activeBg: "bg-orange-500",   activeText: "text-white" },
  Klettern:  { icon: "🧗", border: "border-purple-200",  bg: "bg-purple-50",   activeBg: "bg-purple-500",   activeText: "text-white" },
};

const CATEGORY_ICON: Record<string, string> = {
  Wandern: "🥾", Radfahren: "🚴", Laufen: "🏃", Klettern: "🧗",
};

const DIFFICULTY_STYLE: Record<string, { bg: string; text: string }> = {
  leicht: { bg: "bg-emerald-100", text: "text-emerald-700" },
  mittel: { bg: "bg-amber-100",   text: "text-amber-700"   },
  schwer: { bg: "bg-rose-100",    text: "text-rose-700"    },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  if (!name.trim()) return "";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function sameIds(a: number[], b: number[]) {
  return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvatarCircle({
  name,
  imageUrl,
  onImageChange,
}: {
  name: string;
  imageUrl: string;
  onImageChange: (base64: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = getInitials(name);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onImageChange(reader.result);
    };
    reader.readAsDataURL(file);
    // reset so same file can be re-selected
    e.target.value = "";
  }

  return (
    <div
      className="relative mx-auto w-24 h-24 rounded-full cursor-pointer group ring-4 ring-white shadow-lg shadow-indigo-500/30"
      onClick={() => fileInputRef.current?.click()}
      title="Profilbild ändern"
    >
      {/* Image or initials */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profilbild"
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <span className="text-3xl font-bold text-white select-none">
            {initials || "👤"}
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-white text-[9px] font-semibold">Ändern</span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

/** Badge pill shown inside the profile card */
function EarnedBadgePill({ route }: { route: Route }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl shadow-sm">
      <span className="text-lg">{CATEGORY_ICON[route.category] ?? "📍"}</span>
      <div className="text-left">
        <p className="text-xs font-bold text-amber-800 leading-tight">{route.name}</p>
        <p className="text-[10px] text-amber-500 font-medium">{route.category}</p>
      </div>
      <span className="text-amber-400 text-sm">🏅</span>
    </div>
  );
}

/** Selectable route card in the badge picker section */
function SelectableRouteCard({
  route,
  selected,
  earned,
  onToggle,
}: {
  route: Route;
  selected: boolean;
  earned: boolean;
  onToggle: (id: number) => void;
}) {
  const diff = DIFFICULTY_STYLE[route.difficulty] ?? { bg: "bg-gray-100", text: "text-gray-700" };

  // Visual state:
  // earned + selected  → confirmed (indigo)
  // not earned + selected → pending/new (amber)
  // earned + not selected → being removed (rose tint)
  // neither → default
  const cardStyle =
    earned && selected
      ? "border-indigo-400 bg-indigo-50 shadow-md shadow-indigo-100"
      : !earned && selected
      ? "border-amber-400 bg-amber-50 shadow-md shadow-amber-100"
      : earned && !selected
      ? "border-rose-200 bg-rose-50/40"
      : "border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm";

  const checkColor =
    earned && selected ? "bg-indigo-500" :
    !earned && selected ? "bg-amber-500" : "";

  return (
    <div
      className={`relative rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer select-none ${cardStyle}`}
      onClick={() => onToggle(route.id)}
    >
      {/* Checkmark or minus indicator */}
      {selected && (
        <div className={`absolute top-3 right-3 w-6 h-6 rounded-full ${checkColor} flex items-center justify-center shadow-sm`}>
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      {earned && !selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-300 flex items-center justify-center shadow-sm">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl
          ${selected ? (earned ? "bg-indigo-100" : "bg-amber-100") : "bg-gray-50 border border-gray-100"}`}>
          {CATEGORY_ICON[route.category] ?? "📍"}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${selected ? (earned ? "text-indigo-800" : "text-amber-800") : "text-gray-800"}`}>
            {route.name}
          </p>
          <p className="text-xs text-gray-400">{route.category}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <span className="font-medium">{route.distance} km</span>
        <span>·</span>
        <span>{route.duration} Min.</span>
        <span>·</span>
        <span className={`px-2 py-0.5 rounded-full font-medium ${diff.bg} ${diff.text}`}>
          {route.difficulty}
        </span>
      </div>

      {earned && selected && (
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-indigo-600">
          🏅 Verdient
        </div>
      )}
      {!earned && selected && (
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-600">
          ⏳ Ausstehend – noch bestätigen
        </div>
      )}
      {earned && !selected && (
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-500">
          ✕ Wird entfernt – noch bestätigen
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KontoClient({ allRoutes }: { allRoutes: Route[] }) {
  const [profile, setProfile]           = useState<Profile>(DEFAULT_PROFILE);
  const [profileImage, setProfileImage] = useState<string>("");
  const [bannerImage, setBannerImage]   = useState<string>("");
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [earnedIds, setEarnedIds]     = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editing, setEditing]         = useState(false);
  const [draft, setDraft]             = useState<Profile>(DEFAULT_PROFILE);
  const [mounted, setMounted]         = useState(false);
  const [justSaved, setJustSaved]     = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (p) setProfile(JSON.parse(p));
      const img = localStorage.getItem(STORAGE_KEY_IMAGE);
      if (img) setProfileImage(img);
      const banner = localStorage.getItem(STORAGE_KEY_BANNER);
      if (banner) setBannerImage(banner);
      const e = localStorage.getItem(STORAGE_KEY_EARNED);
      const parsed: number[] = e ? JSON.parse(e) : [];
      setEarnedIds(parsed);
      setSelectedIds(parsed);
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  // Persist profile
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile, mounted]);

  // Persist profile image
  function handleImageChange(base64: string) {
    setProfileImage(base64);
    localStorage.setItem(STORAGE_KEY_IMAGE, base64);
  }

  // Persist banner image
  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBannerImage(reader.result);
        localStorage.setItem(STORAGE_KEY_BANNER, reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function startEditing() { setDraft({ ...profile }); setEditing(true); }
  function saveProfile()  { setProfile({ ...draft }); setEditing(false); }

  function toggleHobby(hobby: Hobby) {
    setDraft((p) => ({
      ...p,
      hobbies: p.hobbies.includes(hobby)
        ? p.hobbies.filter((h) => h !== hobby)
        : [...p.hobbies, hobby],
    }));
  }

  function toggleSelected(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function confirmBadges() {
    setEarnedIds(selectedIds);
    localStorage.setItem(STORAGE_KEY_EARNED, JSON.stringify(selectedIds));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  }

  const hasChanges = !sameIds(selectedIds, earnedIds);
  const earnedRoutes = allRoutes.filter((r) => earnedIds.includes(r.id));
  const isProfileEmpty = !profile.username && !profile.age && profile.hobbies.length === 0;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* ── Profile Card ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* ── Banner ── */}
        <div
          className="h-28 relative cursor-pointer group overflow-hidden"
          onClick={() => bannerInputRef.current?.click()}
          title="Banner ändern"
        >
          {bannerImage ? (
            <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,_white_0%,_transparent_60%)]" />
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-white text-sm font-semibold">Banner ändern</span>
          </div>
          <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
        </div>

        <div className="px-8 pb-8">
          <div className="-mt-12 mb-5">
            <AvatarCircle
              name={profile.username}
              imageUrl={profileImage}
              onImageChange={handleImageChange}
            />
          </div>

          {!editing ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.username || <span className="text-gray-400 italic">Kein Name gesetzt</span>}
              </h2>
              {profile.age && <p className="text-sm text-gray-500 mt-1">{profile.age} Jahre</p>}

              {/* Hobby chips */}
              {profile.hobbies.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {profile.hobbies.map((hobby) => {
                    const cfg = HOBBY_CONFIG[hobby];
                    return (
                      <span key={hobby}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${cfg.activeBg} ${cfg.activeText} shadow-sm`}>
                        {cfg.icon} {hobby}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* ── Earned Badges in profile ── */}
              {earnedRoutes.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    🏅 Meine Abzeichen
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {earnedRoutes.map((route) => (
                      <EarnedBadgePill key={route.id} route={route} />
                    ))}
                  </div>
                </div>
              )}

              {isProfileEmpty && earnedRoutes.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">Noch kein Profil angelegt.</p>
              )}

              <button
                onClick={startEditing}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
              >
                ✏️ Profil bearbeiten
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Benutzername</label>
                <input type="text" value={draft.username}
                  onChange={(e) => setDraft((p) => ({ ...p, username: e.target.value }))}
                  placeholder="Dein Name..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-400 focus:bg-white focus:outline-none transition-all text-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alter</label>
                <input type="number" min={1} max={120} value={draft.age}
                  onChange={(e) => setDraft((p) => ({ ...p, age: e.target.value }))}
                  placeholder="Dein Alter..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-400 focus:bg-white focus:outline-none transition-all text-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Hobbys <span className="text-gray-400 font-normal">(mehrere wählbar)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(Object.keys(HOBBY_CONFIG) as Hobby[]).map((hobby) => {
                    const cfg = HOBBY_CONFIG[hobby];
                    const active = draft.hobbies.includes(hobby);
                    return (
                      <button key={hobby} type="button" onClick={() => toggleHobby(hobby)}
                        className={`relative group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200
                          ${active ? `${cfg.activeBg} border-transparent shadow-md ${cfg.activeText}` : `${cfg.bg} ${cfg.border} hover:shadow-sm text-gray-700`}`}>
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cfg.icon}</span>
                        <span className="text-xs font-semibold">{hobby}</span>
                        {active && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={saveProfile}
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm">
                  💾 Speichern
                </button>
                <button onClick={() => setEditing(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors border border-gray-200">
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Abzeichen verdient", value: earnedIds.length,  icon: "🏅" },
          { label: "Gesamt-km",          value: `${earnedRoutes.reduce((s, r) => s + r.distance, 0)} km`, icon: "📏" },
          { label: "Gesamt-Zeit",        value: `${Math.round(earnedRoutes.reduce((s, r) => s + r.duration, 0) / 60)} Std.`, icon: "⏱️" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Badge Picker ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">🏅 Abzeichen verwalten</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Wähle Routen aus die du absolviert hast — dann bestätigen
            </p>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mt-1">
            {earnedIds.length} / {allRoutes.length}
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-400 inline-block" /> Verdient</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Neu ausgewählt</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-300 inline-block" /> Wird entfernt</span>
        </div>

        {allRoutes.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Keine Routen vorhanden.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allRoutes.map((route) => (
              <SelectableRouteCard
                key={route.id}
                route={route}
                selected={selectedIds.includes(route.id)}
                earned={earnedIds.includes(route.id)}
                onToggle={toggleSelected}
              />
            ))}
          </div>
        )}

        {/* ── Confirm bar ── */}
        <div className={`mt-6 transition-all duration-300 ${hasChanges ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"}`}>
          <div className="flex items-center gap-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl">
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Auswahl noch nicht gespeichert</p>
              <p className="text-xs text-amber-600 mt-0.5">
                {selectedIds.length} Route{selectedIds.length !== 1 ? "n" : ""} ausgewählt
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedIds(earnedIds)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Zurücksetzen
              </button>
              <button
                onClick={confirmBadges}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm shadow-amber-200"
              >
                ✓ Bestätigen
              </button>
            </div>
          </div>
        </div>

        {/* Success toast */}
        {justSaved && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700 animate-fade-in-up">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Abzeichen gespeichert! Sie erscheinen jetzt in deinem Profil.
          </div>
        )}
      </div>

    </div>
  );
}
