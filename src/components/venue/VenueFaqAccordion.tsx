import { useState } from 'preact/hooks';
import type { FaqItem } from '../../types/wedding.ts';

interface VenueFaqAccordionProps {
  readonly items: readonly FaqItem[];
  readonly defaultOpenIndex?: number;
}

/**
 * Accessible single-open FAQ accordion using native disclosure buttons.
 */
export function VenueFaqAccordion({
  items,
  defaultOpenIndex = 0,
}: VenueFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="venue-faq-list" id="venue-faq-root">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const questionId = `venue-faq-question-${item.id}`;
        const answerId = `venue-faq-answer-${item.id}`;

        return (
          <div
            key={item.id}
            className={`venue-faq-item${isOpen ? ' is-open' : ''}`}
            data-faq-item={item.id}
          >
            <h3 className="venue-faq-item__heading">
              <button
                className="venue-faq-item__question"
                type="button"
                id={questionId}
                data-faq-trigger=""
                data-faq-index={String(index)}
                aria-expanded={isOpen ? 'true' : 'false'}
                aria-controls={answerId}
                onClick={() => toggleItem(index)}
              >
                <span>{item.question}</span>
                <span className="venue-faq-item__icon" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>

            <div
              className="venue-faq-item__answer"
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              hidden={!isOpen}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
