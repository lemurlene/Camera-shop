import { memo } from 'react';
import { SOCIAL_LINKS } from './const';

function SocialLinks(): JSX.Element {
  return (
    <ul className="social">
      {SOCIAL_LINKS.map(({ href, ariaLabel, icon }) => (
        <li key={icon} className="social__item">
          <a className="link" href={href} aria-label={ariaLabel}>
            <svg width="20" height="20" aria-hidden="true">
              <use xlinkHref={icon}></use>
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

export const SocialLinksMemo = memo(SocialLinks);
