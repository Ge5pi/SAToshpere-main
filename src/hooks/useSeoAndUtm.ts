import { useEffect, useState } from 'react';
import { TranslationContent } from '../i18n/translations';
import { Locale, UtmParams } from '../types';

const UTM_STORAGE_KEY = 'satosphere_utm_params';

function setMetaContent(selector: string, content: string): void {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) {
    el.setAttribute('content', content);
  }
}

export function useSeoAndUtm(locale: Locale, copy: TranslationContent): UtmParams {
  const [utm, setUtm] = useState<UtmParams>({
    utmSource: 'direct',
    utmMedium: 'none',
    utmCampaign: 'satosphere_landing',
  });

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const source = searchParams.get('utm_source');
      const medium = searchParams.get('utm_medium');
      const campaign = searchParams.get('utm_campaign');

      if (source || medium || campaign) {
        const captured: UtmParams = {
          utmSource: source || 'ad_traffic',
          utmMedium: medium || 'cpc',
          utmCampaign: campaign || 'satosphere_ads',
        };
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
        setUtm(captured);
        return;
      }

      const cached = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Partial<UtmParams>;
        setUtm({
          utmSource: parsed.utmSource || 'direct',
          utmMedium: parsed.utmMedium || 'none',
          utmCampaign: parsed.utmCampaign || 'satosphere_landing',
        });
      } else if (document.referrer) {
        try {
          const refHost = new URL(document.referrer).hostname;
          if (refHost && refHost !== window.location.hostname) {
            setUtm({
              utmSource: refHost,
              utmMedium: 'referral',
              utmCampaign: 'organic_referral',
            });
          }
        } catch {
          // Ignore malformed referrer
        }
      }
    } catch {
      // Safe fallback in restricted storage environments
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = copy.seo.htmlLang;
    document.title = copy.seo.title;

    setMetaContent('meta[name="description"]', copy.seo.description);
    setMetaContent('meta[property="og:title"]', copy.seo.title);
    setMetaContent('meta[property="og:description"]', copy.seo.description);
    setMetaContent('meta[name="twitter:title"]', copy.seo.title);
    setMetaContent('meta[name="twitter:description"]', copy.seo.description);

    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl);

    const schemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'EducationalOrganization',
          name: 'SATosphere',
          url: canonicalUrl,
          description: copy.seo.description,
          areaServed: {
            '@type': 'Country',
            name: 'Kazakhstan',
          },
          knowsLanguage: ['ru', 'kk', 'en'],
        },
        {
          '@type': 'Course',
          name: copy.seo.title,
          description: copy.program.subtitle,
          provider: {
            '@type': 'EducationalOrganization',
            name: 'SATosphere',
            sameAs: canonicalUrl,
          },
          educationalLevel: locale === 'ru' ? '9–11 класс' : '9–11 сынып',
          timeRequired: 'P2M',
          offers: [
            {
              '@type': 'Offer',
              name: copy.form.planNames.diagnostic,
              price: '0',
              priceCurrency: 'KZT',
              availability: 'https://schema.org/InStock',
            },
            ...copy.pricing.tariffs.map((t) => ({
              '@type': 'Offer',
              name: t.name,
              price: String(t.packagePrice),
              priceCurrency: 'KZT',
              availability: 'https://schema.org/InStock',
            })),
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: copy.faq.items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        },
      ],
    };

    const scriptEl = document.getElementById('schema-jsonld');
    if (scriptEl) {
      scriptEl.textContent = JSON.stringify(schemaGraph);
    }
  }, [locale, copy]);

  return utm;
}
