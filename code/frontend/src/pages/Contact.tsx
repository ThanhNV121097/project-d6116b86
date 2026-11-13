import { T, useContent } from "../editable";
import { usePageMeta } from "../seo";
import ContactForm from "../components/ContactForm";
import SpecList from "../components/SpecList";

/**
 * How to reach the shop, and the form that reaches it. The details at the
 * left are drawn only where the owner has given them: a shop with no street
 * address shows no "Find us" row, and never a sentence about what is missing.
 */
export default function Contact() {
  usePageMeta("pages.contact.title", "pages.contact.description");
  const phone = useContent("contact.phone");
  const email = useContent("contact.email");
  const address = useContent("contact.address");
  const hours = useContent("contact.hours");
  return (
    <div className="py-8">
      <h1 data-testid="contact-heading" className="text-[length:var(--size-h1)] leading-tight text-ink"><T k="contact.heading" /></h1>
      <T k="pages.contact.lead" as="p" className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-soft" />
      <section className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
        <ContactForm className="min-w-0 flex-1 lg:max-w-[40rem]" />
        <div className="rounded bg-surface p-6 lg:w-96 lg:shrink-0">
          <SpecList items={[
            [<T key="p" k="pages.contact.phone" />, phone && <a href={`tel:${phone}`} className="font-medium text-accent hover:underline">{phone}</a>],
            [<T key="e" k="pages.contact.email" />, email && <a href={`mailto:${email}`} className="font-medium text-accent hover:underline">{email}</a>],
            [<T key="a" k="pages.contact.address" />, address],
            [<T key="h" k="pages.contact.hours" />, hours],
          ]} />
        </div>
      </section>
    </div>
  );
}
