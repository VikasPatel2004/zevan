import { Link } from 'react-router-dom';

/**
 * BrandLogo — Reusable ZEVAN logo component.
 *
 * Props:
 *   variant: 'full' (icon + wordmark), 'icon' (icon only), 'wordmark' (wordmark only)
 *   size:    'navbar' | 'login' | 'sidebar' | 'footer'
 *   inverted: true for dark backgrounds (uses light wordmark)
 *   linked:  true to wrap in a <Link to="/">, false for static rendering
 *   className: additional wrapper classes
 */

export default function BrandLogo({
  variant = 'full',
  size = 'navbar',
  inverted = false,
  linked = true,
  className = '',
}) {
  const presets = {
    navbar: { icon: '40px', wordmark: '30px' },
    login: { icon: '40px', wordmark: '30px' },
    sidebar: { icon: '36px', wordmark: '27px' },
    footer: { icon: '32px', wordmark: '24px' },
  };

  const currentPreset = presets[size] || presets.navbar;

  // Use light wordmark on dark backgrounds
  const wordmarkSrc = inverted
    ? '/logo-wordmark-light.svg'
    : '/logo-wordmark.svg';

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {(variant === 'full' || variant === 'icon') && (
        <img
          src="/logo-icon.svg"
          alt=""
          style={{ height: currentPreset.icon }}
          className="w-auto object-contain"
          aria-hidden="true"
        />
      )}

      {(variant === 'full' || variant === 'wordmark') && (
        <img
          src={wordmarkSrc}
          alt="ZEVAN"
          style={{ height: currentPreset.wordmark }}
          className="w-auto object-contain"
        />
      )}
    </span>
  );

  if (linked) {
    return (
      <Link
        to="/"
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}