import { memo } from 'react';

type FooterNavSectionProps = {
  title: string;
  items: Array<{ href: string; text: string }>;
};

function FooterItems({ title, items }: FooterNavSectionProps): JSX.Element {
  return (
    <li className="footer__nav-item">
      <p className="footer__title">{title}</p>
      <ul className="footer__list">
        {items.map(({ href, text }) => (
          <li key={text} className="footer__item">
            <a className="link" href={href}>
              {text}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

export const FooterItemsMemo = memo(FooterItems);
