import { useTranslation } from "react-i18next";

export function ResponsibleGambling() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
        {t('compliance.responsibleGamblingLinkLabel')}
      </h1>

      <div className="bg-surface-raised border border-border rounded-card p-6 space-y-4">
        <p className="text-sm text-text-secondary leading-relaxed">
          {t('compliance.disclaimerFull')}
        </p>

        <div className="bg-warning-bg border border-warning/20 rounded-control p-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            {/* PLACEHOLDER — jurisdiction-specific helplines and self-exclusion
                resources go here. Do not launch with this section empty or
                with a single hardcoded country's helpline for a worldwide
                audience. This needs legal sign-off per jurisdiction. */}
            Support resources for problem gambling vary by country. If gambling
            is affecting your life, please seek help from a local support
            service or your national health authority.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-2">Age requirement</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {t('compliance.ageGateBody')}
          </p>
        </div>
      </div>
    </div>
  );
}