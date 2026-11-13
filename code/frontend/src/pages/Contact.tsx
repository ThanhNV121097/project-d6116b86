import { type ReactNode } from "react";
import { T, useContent } from "../editable";
import { usePageMeta } from "../seo";
import { Picture } from "../picture";
import { digits } from "../components/ContactDock";
import ContactForm from "../components/ContactForm";
import Icon, { type IconName } from "../components/Icon";
import MapEmbed from "../components/MapEmbed";
import Script from "../components/Script";

/**
 * WRITE TO ÉP: the heading with its script and the form at the left; at the
 * right a sunlit photograph with a white card floated over it carrying the
 * ways to reach the shop — drawn only for the details the owner has filled
 * in, never a sentence about what is missing. A map follows when there is an
 * address.
 */
export default function Contact() {
  usePageMeta("pages.contact.title", "pages.contact.description");
  const phone = useContent("contact.phone");
  const zalo = useContent("contact.zalo");
  const email = useContent("contact.email");
  const address = useContent("contact.address");
  const hours = useContent("contact.hours");
  const image = useContent("pages.contact.image");
  const rows: { icon: IconName; k: string; value: ReactNode }[] = [];
  if (phone) rows.push({ icon: "phone", k: "pages.contact.phone", value: <a href={`tel:${digits(phone)}`} className="hover:underline">{phone}</a> });
  if (zalo) rows.push({ icon: "chat", k: "pages.contact.zalo", value: <a href={`https://zalo.me/${digits(zalo)}`} target="_blank" rel="noreferrer" className="hover:underline">{zalo}</a> });
  if (email) rows.push({ icon: "mail", k: "pages.contact.email", value: <a href={`mailto:${email}`} className="hover:underline">{email}</a> });
  if (address) rows.push({ icon: "address", k: "pages.contact.address", value: address });
  if (hours) rows.push({ icon: "hours", k: "pages.contact.hours", value: hours });
  return (
    <div className="pb-8 pt-8">
      <section className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <h1 data-testid="contact-heading" className="relative font-display text-[length:var(--size-h1)] uppercase leading-[0.95] text-ink">
            <T k="contact.heading" /><Script k="pages.contact.script" />
          </h1>
          <T k="pages.contact.lead" as="p" className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-soft" />
          <ContactForm className="mt-8" />
        </div>
        <div className="relative min-h-[26rem] overflow-hidden rounded bg-[var(--photo-deep)] lg:col-span-6 lg:-mr-[var(--gutter)] lg:min-h-[36rem] lg:rounded-r-none">
          {image && <Picture src={image} alt="" loading="eager" width={1280} height={853} motion="parallax" className="absolute inset-0 h-full w-full object-cover" />}
          {rows.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 rounded bg-ground p-5 text-ink shadow-[var(--shadow-md)] sm:right-auto sm:w-80">
              <ul className="flex flex-col gap-3 text-sm">
                {rows.map((r) => (
                  <li key={r.k} className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-ink"><Icon name={r.icon} size={16} /></span>
                    <span className="min-w-0"><T k={r.k} as="span" className="block text-xs uppercase tracking-widest text-ink-soft" /><span className="block break-words">{r.value}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      {address && <MapEmbed className="mt-12 h-80 overflow-hidden rounded" />}
    </div>
  );
}
