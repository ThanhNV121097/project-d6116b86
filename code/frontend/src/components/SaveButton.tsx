import Icon from "./Icon";
import { toggleSaved, useSaved } from "../lib/saved";

/**
 * THE HEART on a card: a small white circle at the tile's top right. It holds
 * a choice (src/lib/saved.ts) and says so — filled when the thing is saved —
 * rather than being a mark that decorates the tile.
 */
export default function SaveButton({ id, name, className = "" }: { id: string; name: string; className?: string }) {
  const saved = useSaved(id);
  return (
    <button type="button" aria-pressed={saved} aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
      onClick={() => toggleSaved(id)}
      className={`grid h-8 w-8 place-items-center rounded-full bg-ground shadow-[var(--shadow-sm)] ${saved ? "text-accent" : "text-ink-soft hover:text-ink"} ${className}`}>
      <Icon name="wishlist" size={16} className={saved ? "fill-current" : ""} />
    </button>
  );
}
