/**
 * Accessible single-open FAQ accordion. Native buttons keep keyboard and
 * screen-reader behaviour predictable; only one answer is expanded at a time.
 */
export class VenueFaqAccordion {
  constructor({ root, items, openFirstItem = true }) {
    this.root = root;
    this.items = items;
    this.openFirstItem = openFirstItem;
    this.itemElements = [];
    this.buttonElements = [];
    this.panelElements = [];
    this.iconElements = [];

    if (!this.root || this.items.length === 0) return;

    this.render();
    this.handleClick = this.handleClick.bind(this);
    this.root.addEventListener('click', this.handleClick);

    if (this.openFirstItem) {
      this.openItem(0);
    }
  }

  render() {
    const fragment = document.createDocumentFragment();

    this.items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'venue-faq-item';
      itemElement.dataset.faqItem = item.id;

      const heading = document.createElement('h3');
      heading.className = 'venue-faq-item__heading';

      const button = document.createElement('button');
      button.className = 'venue-faq-item__question';
      button.type = 'button';
      button.id = `venue-faq-question-${item.id}`;
      button.dataset.faqTrigger = '';
      button.dataset.faqIndex = String(index);
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', `venue-faq-answer-${item.id}`);

      const questionText = document.createElement('span');
      questionText.textContent = item.question;

      const icon = document.createElement('span');
      icon.className = 'venue-faq-item__icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '+';

      button.append(questionText, icon);
      heading.append(button);

      const panel = document.createElement('div');
      panel.className = 'venue-faq-item__answer';
      panel.id = `venue-faq-answer-${item.id}`;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', button.id);
      panel.hidden = true;

      const answerText = document.createElement('p');
      answerText.textContent = item.answer;
      panel.append(answerText);

      itemElement.append(heading, panel);
      fragment.append(itemElement);

      this.itemElements.push(itemElement);
      this.buttonElements.push(button);
      this.panelElements.push(panel);
      this.iconElements.push(icon);
    });

    this.root.replaceChildren(fragment);
  }

  handleClick(event) {
    const trigger = event.target.closest('[data-faq-trigger]');
    if (!trigger || !this.root.contains(trigger)) return;

    const index = Number(trigger.dataset.faqIndex);
    const isCurrentlyOpen = !this.panelElements[index].hidden;

    if (isCurrentlyOpen) {
      this.closeItem(index);
    } else {
      this.openItem(index);
    }
  }

  openItem(index) {
    this.panelElements.forEach((panel, panelIndex) => {
      const shouldOpen = panelIndex === index;
      panel.hidden = !shouldOpen;
      this.buttonElements[panelIndex].setAttribute('aria-expanded', String(shouldOpen));
      this.iconElements[panelIndex].textContent = shouldOpen ? '−' : '+';
      this.itemElements[panelIndex].classList.toggle('is-open', shouldOpen);
    });
  }

  closeItem(index) {
    this.panelElements[index].hidden = true;
    this.buttonElements[index].setAttribute('aria-expanded', 'false');
    this.iconElements[index].textContent = '+';
    this.itemElements[index].classList.remove('is-open');
  }

  destroy() {
    this.root.removeEventListener('click', this.handleClick);
  }
}
